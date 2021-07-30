import moment from "moment";

interface Validation<T> {
  validationMessage: string;
  isValidFn: (entity: T) => boolean;
  condition?: (entity: T) => boolean;
}

interface ChildValidation<T, TS> {
  fieldName: string;
  collectionFn: (entity: T) => Array<TS>;
  validator: Validator<TS>;
}

export class Validator<T> {
  private validations: Array<Validation<T>> = [];
  private childValidations: Array<ChildValidation<T, any>> = [];

  add(validationMessage: string, isValidFn: (entity: T) => boolean) {
    this.validations.push({ validationMessage, isValidFn });

    return this;
  }

  addConditional(
    condition: (entity: T) => boolean,
    validationMessage: string,
    isValidFn: (entity: T) => boolean
  ) {
    this.validations.push({ condition, validationMessage, isValidFn });

    return this;
  }

  addRequired(fieldName: string, expression: (entity: T) => any) {
    this.validations.push({
      validationMessage: `The ${fieldName} is required`,
      isValidFn: (entity) => !!expression(entity),
    });

    return this;
  }

  requirePositive(fieldName: string, fieldSelector: (entity: T) => number) {
    this.validations.push({
      validationMessage: `The ${fieldName} should be positive`,
      isValidFn: (entity) => fieldSelector(entity) >= 0,
    });

    return this;
  }

  requirePercentage(fieldName: string, fieldSelector: (entity: T) => number) {
    this.validations.push({
      validationMessage: `The ${fieldName} should be a valid percentage (between 0 and 100)`,
      isValidFn: (entity) =>
        fieldSelector(entity) >= 0 && fieldSelector(entity) <= 100,
    });

    return this;
  }

  requireMinDate(
    fieldName: string,
    fieldSelector: (entity: T) => string | null,
    dateFn: (entity: T) => string | null
  ) {
    return this.requireDateRange(
      fieldName,
      fieldSelector,
      dateFn,
      (field, check) => moment(field).isSameOrAfter(check)
    );
  }

  requireMaxDate(
    fieldName: string,
    fieldSelector: (entity: T) => string | null,
    dateFn: (entity: T) => string | null
  ) {
    return this.requireDateRange(
      fieldName,
      fieldSelector,
      dateFn,
      (field, check) => moment(field).isSameOrBefore(check)
    );
  }

  requireDateRange(
    fieldName: string,
    fieldSelector: (entity: T) => string | null,
    dateFn: (entity: T) => string | null,
    compareFn: (field: string, check: string) => boolean
  ) {
    this.validations.push({
      validationMessage: `The ${fieldName} should be earlier than the given end date`,
      isValidFn: (entity) => {
        const field = fieldSelector(entity);
        const check = dateFn(entity);

        if (check && field) {
          return compareFn(field, check);
        }

        return true;
      },
    });

    return this;
  }

  addChildValidation<TS>(
    fieldName: string,
    collectionFn: (entity: T) => Array<TS>,
    buildFn: (validator: Validator<TS>) => Validator<TS>
  ) {
    const validator = buildFn(new Validator<TS>());

    this.childValidations.push({
      fieldName,
      collectionFn,
      validator,
    });

    return this;
  }

  addFromValidator(validator: Validator<T>) {
    this.validations.push(...validator.validations);
    return this;
  }

  validate(entity: T): Array<string> {
    // First we run the normal validations on the entity
    const entityValidations = this.validations
      .filter((v) => (v.condition ? v.condition(entity) : true))
      .filter((v) => !v.isValidFn(entity))
      .map((v) => v.validationMessage);

    // Then we run all the validators on the child entities
    const childValidations = this.childValidations
      .map((cv) =>
        cv
          .collectionFn(entity)
          .map((child, i) =>
            cv.validator
              .validate(child)
              .map(
                (validationMessage) =>
                  `${cv.fieldName} [#${i + 1}]: ${validationMessage}`
              )
          )
          // Flatten
          .reduce((prev, curr) => prev.concat(curr), [])
      )
      // Flatten
      .reduce((prev, curr) => prev.concat(curr), []);

    return entityValidations.concat(childValidations);
  }
}
