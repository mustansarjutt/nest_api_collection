import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class RegisterUserDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  lastName: string;
  
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(3)
  @Matches(/^[A-Za-z][A-Za-z0-9_]*$/, {
    message: "Username must start with a letter and contain only letters, numbers, and underscores with no spaces"
  })
  username: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(6)
  password: string;
}