import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { IsUsernameOrEmail } from "./is-username-or-email.decorator";

export class LoginDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsUsernameOrEmail({ message: "Either username or email must be provided" })
  username?: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}