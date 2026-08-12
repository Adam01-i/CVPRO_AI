import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  @MaxLength(128)
  password!: string;

  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @MaxLength(30)
  phone?: string;
}
