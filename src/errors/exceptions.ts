/* istanbul ignore file */
import { HttpException, HttpStatus } from '@nestjs/common';
import { findKey, isObject } from 'lodash';

export const EXCEPTIONS = {
  ...HttpStatus,
  TOKEN_INVALID: 401,
};

export type ErrorResponseFormat = {
  code: keyof typeof EXCEPTIONS;
  status: number;
  message?: string | any;
  details?: string | any;
};

export class ApiError extends HttpException {
  code: keyof typeof EXCEPTIONS;

  static fromHttpException(ex: HttpException) {
    const status = ex.getStatus();
    const response = ex.getResponse();

    const errCode =
      findKey(HttpStatus, (v) => v === status) || 'INTERNAL_SERVER_ERROR';
    const message = isObject(response) ? (response as any).message : response;

    return new ApiError(errCode as keyof typeof HttpStatus, message);
  }

  constructor(
    errCode: keyof typeof EXCEPTIONS,
    message?: string | any,
    details?: string | any,
  ) {
    const status = EXCEPTIONS[errCode];

    const response: ErrorResponseFormat = {
      code: errCode,
      status,
      message,
      details,
    };

    super(response, status);

    // NodeJS expects a string message, but Nest for some reason sets it to object
    // without this the error is invisible in logs and in testing
    (this as any).message = isObject(this.message)
      ? JSON.stringify(this.message)
      : this.message;

    this.code = errCode;
  }

  getResponse() {
    const baseRes = super.getResponse();

    if (typeof baseRes === 'string') {
      return baseRes;
    }

    return {
      ...baseRes,
      details: (baseRes as any).details,
    };
  }

  getFullResponse() {
    const baseRes = super.getResponse();
    return baseRes;
  }
}
