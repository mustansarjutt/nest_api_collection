import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function IsUsernameOrEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isUsernameOrEmail",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          return !!(obj.username?.trim() || obj.email?.trim());
        },
        defaultMessage() {
          return "Either username or email must be provided";
        },
      },
    });
  };
}