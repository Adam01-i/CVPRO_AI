import { Type } from 'class-transformer'; import { IsDate, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
export class CreateCertificationDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() @MaxLength(255) organization?: string;
  @IsOptional() @Type(() => Date) @IsDate() issueDate?: Date;
  @IsOptional() @Type(() => Date) @IsDate() expirationDate?: Date;
  @IsOptional() @IsString() @MaxLength(255) credentialId?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(2048) credentialUrl?: string;
}
