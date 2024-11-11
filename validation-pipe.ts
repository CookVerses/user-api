import { ValidationPipe } from '@nestjs/common';

export default () =>
  new ValidationPipe({
    disableErrorMessages: false,
    whitelist: true,
    transform: true,
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: false,
    skipNullProperties: false,
    skipUndefinedProperties: false,
    validationError: {
      target: false,
      value: true,
    },
  });
