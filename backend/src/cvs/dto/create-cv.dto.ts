import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateCvDto {
  @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MinLength(1) @MaxLength(200) title!: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(5000) summary?: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(150) profession?: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim().toLowerCase()) @IsEmail() @MaxLength(255) email?: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(30) phone?: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(255) address?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(2048) linkedin?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(2048) github?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(2048) portfolio?: string;
}
