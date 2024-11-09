import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsTrimmedStringWithoutTab(
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsTrimmedStringWithoutTab',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `${propertyName} should be a trimmed string without tab character`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' &&
            !value.endsWith(' ') &&
            !value.startsWith(' ') &&
            !/\s{2,}|\t/.test(value) &&
            value !== ''
          );
        },
      },
    });
  };
}
