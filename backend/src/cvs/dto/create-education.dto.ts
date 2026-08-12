import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { EducationLevel } from '../../../generated/prisma/client';
export class CreateEducationDto {
  @IsString() @MinLength(1) @MaxLength(255) institution!: string;
  @IsString() @MinLength(1) @MaxLength(255) degree!: string;
  @IsOptional() @IsString() @MaxLength(255) field?: string;
  @IsOptional() @IsEnum(EducationLevel) level?: EducationLevel;
  @IsOptional() @IsString() @MaxLength(255) location?: string;
  @IsOptional() @IsString() @MaxLength(5000) description?: string;
  @Type(() => Date) @IsDate() startDate!: Date;
  @IsOptional() @Type(() => Date) @IsDate() endDate?: Date;
  @IsOptional() @IsBoolean() isCurrent?: boolean;
}
