import { ApiResult, ApiStatus } from "./ApiResult";
import { ValidationMessage, ValidationResult } from "./validation/models";

export enum ViewStatusType {
  Ok,
  ValidationErrors,
  InternalServerError,
  UnAuthorize,
}

export type ViewStatus =
  | { status: ViewStatusType.Ok }
  | {
      status: ViewStatusType.ValidationErrors;
      errors: Array<string>;
      validationResult?: ValidationResult;
      showAlert: boolean;
    }
  | { status: ViewStatusType.InternalServerError; showAlert: boolean }
  | { status: ViewStatusType.UnAuthorize; showAlert: boolean };

export function statusFromApiResult(result: ApiResult): ViewStatus {
  if (result.status === ApiStatus.BadRequest) {
    return {
      status: ViewStatusType.ValidationErrors,
      errors: result.errors,
      validationResult: result.validationResult,
      showAlert: true,
    };
  }

  if (result.status === ApiStatus.Unauthorized) {
    return { status: ViewStatusType.UnAuthorize, showAlert: true };
  }

  if (result.status === ApiStatus.InternalServerError) {
    return { status: ViewStatusType.InternalServerError, showAlert: true };
  }

  return { status: ViewStatusType.Ok };
}

export function statusFromMessages(
  errors: string[],
  warnings: string[]
): ViewStatus {
  return statusFromValidationMessages(
    mapToValidationMessages(errors).concat(
      mapToValidationMessages(warnings, true)
    )
  );
}

export function statusFromValidationMessages(
  messages: ValidationMessage[]
): ViewStatus {
  if (messages.length === 0) {
    return { status: ViewStatusType.Ok };
  }

  return {
    status: ViewStatusType.ValidationErrors,
    errors: messages.filter((m) => !m.isWarning).map((m) => m.message),
    validationResult: {
      messages: messages,
    },
    showAlert: true,
  };
}

export function mapToValidationMessages(
  messages: string[],
  isWarning?: boolean
): ValidationMessage[] {
  return messages.map((m) => ({
    isWarning: !!isWarning,
    message: m,
  }));
}
