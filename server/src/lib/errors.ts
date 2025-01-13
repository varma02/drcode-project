export enum ErrorCode {
  ServerError = "server_error",
  BadRequest = "bad_request",
  NotFound = "not_found",
  Unauthorized = "unauthorized",
  InvalidCredentials = "invalid_credentials",
  InvalidRequestBody = "invalid_request_body",
  FieldsRequired = "fields_required",
  FieldsInvalid = "fields_invalid",
  PasswordTooWeak = "password_too_weak",
  EmailInUse = "email_in_use",
  InvalidInvite = "invalid_invite",
}

export class BaseError extends Error {
  public code: string;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export class ServerError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.ServerError, message || "An unexpected error occurred."); 
  }
}
export class BadRequestError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.BadRequest, message || "Bad request."); 
  }
}
export class NotFoundError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.NotFound, message || "Resource not found."); 
  }
}
export class UnauthorizedError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.Unauthorized, message || "You are not authorized to perform this action."); 
  }
}
export class InvalidCredentialsError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.InvalidCredentials, message || "Invalid credentials."); 
  }
}
export class InvalidRequestBodyError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.InvalidRequestBody, message || "Invalid request body."); 
  }
}
export class FieldsRequiredError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.FieldsRequired, message || "Required field(s) are missing."); 
  }
}
export class FieldsInvalidError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.FieldsInvalid, message || "One or more fields are invalid."); 
  }
}
export class PasswordTooWeakError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.PasswordTooWeak, message || "Password does not meet minimum requirements."); 
  }
}
export class EmailInUseError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.EmailInUse, message || "Email is already in use."); 
  }
}
export class InvalidInviteError extends BaseError {
  constructor(message?: string) {
    super(ErrorCode.InvalidInvite, message || "Invite not found."); 
  }
}