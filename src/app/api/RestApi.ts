import {
  ApiResult,
  ApiStatus,
  ErrorApiResult,
  ObjectApiResult,
} from "./ApiResult";
import * as queryString from "querystring";
import { ValidationBehaviour, ValidationResult } from "./validation/models";
import { appendValidationBehaviourParams } from "./validation/apiValidationHelper";
import { mapToValidationMessages } from "./statuses";
import { PrimaryKey } from "../model/primaryKey.model";
import { AuthenticationService } from "../core/authenticationService";

export class RestApi<T extends PrimaryKey> {
  authenticationService = new AuthenticationService();
  constructor(protected baseUrl: string) {}

  async getAll(): Promise<T[]> {
    return await getData<T[]>(this.baseUrl + "/");
  }

  async get(id: string): Promise<T> {
    return await getData<T>(this.baseUrl + "/" + id);
  }

  async getOrEmpty(id: string): Promise<T | null> {
    return await getOrEmpty<T>(this.baseUrl + "/" + id);
  }

  async create(
    entity: T,
    validationBehaviour?: ValidationBehaviour
  ): Promise<ObjectApiResult<T>> {
    return await post<T>(
      appendValidationBehaviourParams(this.baseUrl, validationBehaviour),
      entity
    );
  }

  async update(
    entity: T,
    validationBehaviour?: ValidationBehaviour
  ): Promise<ObjectApiResult<T>> {
    return await put<T>(
      appendValidationBehaviourParams(
        this.baseUrl + "/" + entity.id,
        validationBehaviour
      ),
      entity
    );
  }

  async delete(
    id: string,
    validationBehaviour?: ValidationBehaviour
  ): Promise<ApiResult> {
    return await del(
      appendValidationBehaviourParams(
        this.baseUrl + "/" + id,
        validationBehaviour
      )
    );
  }
}
function getAccessToken() {
  return new AuthenticationService().getTokenFromStorage("access_token");
}

async function apiResultFromResponse(response: Response): Promise<ApiResult> {
  if (response.status === 200) {
    return { status: ApiStatus.Ok };
  }

  return errorFromApiResult(response);
}

async function errorFromApiResult(response: Response): Promise<ErrorApiResult> {
  // console.log("Api response: ", response);

  if (response.redirected && !!response.url) {
    let redirect = response.url;
    const returnStartI = redirect.indexOf("ReturnUrl=");
    if (returnStartI >= 0) {
      const returnEndI = redirect.indexOf("&", returnStartI);

      if (returnEndI < 0) {
        redirect = redirect.substring(0, returnStartI);
      } else {
        const toRemove = redirect.slice(returnStartI, returnEndI);
        redirect = redirect.replace(toRemove, "");
      }
    }

    if (redirect.includes("/%23/")) {
      redirect = redirect.replace("/%23/", "/#/");
    }

    window.location.replace(redirect);
    return { status: ApiStatus.Redirect };
  }

  if (response.status === 400) {
    const resp = await response.json();

    const validationResult: ValidationResult = resp.messages
      ? resp
      : { messages: [] };
    const errors: string[] = resp.errors;

    if (errors && errors.length > 0) {
      validationResult.messages.push(...mapToValidationMessages(errors));
    }

    return {
      status: ApiStatus.BadRequest,
      errors: resp.errors,
      validationResult,
    };
  }

  if (response.status === 401 || response.status === 302) {
    return { status: ApiStatus.Unauthorized };
  }

  if (response.status === 404) {
    return { status: ApiStatus.NotFound };
  }

  if (response.status === 500) {
    return { status: ApiStatus.InternalServerError };
  }

  throw "Not supported";
}

export async function objectApiResultFromResponse<T>(
  response: Response
): Promise<ObjectApiResult<T>> {
  if (response.status === 200) {
    let value: any;

    try {
      value = await response.json();
    } catch {
      value = null;
    }
    return { status: ApiStatus.Ok, value };
  }

  return errorFromApiResult(response);
}

export async function getData<T>(
  baseUrl: string,
  extraFields?: any
): Promise<T> {
  const params = extraFields ? "?" + queryString.stringify(extraFields) : "";
  const url = baseUrl + params;

  const response = await fetch(url, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept-Encoding": "gzip",
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  return await response.json();
}

export async function getOrEmpty<T>(url: string): Promise<T | null> {
  const response = await fetch(url, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept-Encoding": "gzip",
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  if (response.status === 204) return null;
  return await response.json();
}

export async function getWithResponse<T>(
  baseUrl: string,
  extraFields?: any
): Promise<ObjectApiResult<T>> {
  const params = extraFields ? "?" + queryString.stringify(extraFields) : "";
  const url = baseUrl + params;

  const response = await fetch(url, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept-Encoding": "gzip",
      Authorization: "Bearer " + getAccessToken(),
    },
  });

  return await objectApiResultFromResponse<T>(response);
}

export async function post<T>(
  url: string,
  body: any = {}
): Promise<ObjectApiResult<T>> {
  return await putOrPost<T>(url, body, "POST");
}

export async function put<T>(
  url: string,
  body: any = {}
): Promise<ObjectApiResult<T>> {
  return await putOrPost<T>(url, body, "PUT");
}

export async function del(url: string): Promise<ApiResult> {
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "same-origin",
  });
  return await apiResultFromResponse(response);
}

export async function postFormData(url: string, formData: FormData) {
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  return await objectApiResultFromResponse(response);
}

async function putOrPost<T>(url: string, body: any, method: "PUT" | "POST") {
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(body),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getAccessToken(),
    },
  });

  return await objectApiResultFromResponse<T>(response);
}

export function urlEncode(obj: any[]) {
  const str: Array<string> = [];
  for (const p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p) && obj[p]) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  }
  return str.join("&");
}

export async function patch<T>(url: string, body: any) {
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(body),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await objectApiResultFromResponse<T>(response);
}
