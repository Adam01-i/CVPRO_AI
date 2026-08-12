import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  profileImage?: string;
}
