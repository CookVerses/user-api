import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

import { ApiError } from './exceptions';
import { TYPEORM_ERROR_CODE } from './typeorm-error-code';

export const RESPONSE_API_ERROR_SYMBOL = Symbol.for('RESPONSE_API_ERROR');

const convertException = (exception: unknown): ApiError => {
  if (exception instanceof ApiError) {
    return exception;
  } else if (exception instanceof HttpException) {
    return ApiError.fromHttpException(exception);
  } else if (exception instanceof EntityNotFoundError) {
    return new ApiError('NOT_FOUND', exception.message);
  } else if (
    exception instanceof QueryFailedError &&
    (exception as any).code === TYPEORM_ERROR_CODE.UNIQUE_CONSTRAINT
  ) {
    return new ApiError('CONFLICT', exception.message);
  } else if (
    exception instanceof QueryFailedError &&
    (exception as any).code === TYPEORM_ERROR_CODE.FOREIGN_KEY_CONSTRAINT
  ) {
    return new ApiError(
      'NOT_FOUND',
      (exception as QueryFailedError & { detail: string }).detail,
    );
  } else if (exception instanceof Error) {
    return new ApiError(
      'INTERNAL_SERVER_ERROR',
      exception.message,
      exception.stack || exception,
    );
  } else {
    return new ApiError('INTERNAL_SERVER_ERROR');
  }
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const ex = convertException(exception);
    response[RESPONSE_API_ERROR_SYMBOL] = ex;

    super.catch(ex, host);
  }
}
