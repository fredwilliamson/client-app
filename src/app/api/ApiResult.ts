import { ValidationResult } from "./validation/models";

export interface GetAllRequest {
  pageSize: number;
  pageNumber: number;
  properties?: string;
  searchExpression?: string;
  orderBys?: string;
}

export type PageResult<T> = {
  total: number;
  results: Array<T>;
};

export enum ApiStatus {
  Ok,
  Unauthorized,
  BadRequest,
  InternalServerError,
  NoActionRequired,
  NotFound,
  Redirect,
}

export type ErrorApiResult =
  | {
      status: ApiStatus.BadRequest;
      errors: Array<string>;
      validationResult: ValidationResult;
    }
  | { status: ApiStatus.Unauthorized }
  | { status: ApiStatus.InternalServerError }
  | { status: ApiStatus.NotFound }
  | { status: ApiStatus.Redirect };

export type ApiResult =
  | { status: ApiStatus.Ok }
  | { status: ApiStatus.NoActionRequired }
  | ErrorApiResult;

export type ObjectApiResult<T> =
  | { status: ApiStatus.Ok; value: T }
  | ErrorApiResult;
