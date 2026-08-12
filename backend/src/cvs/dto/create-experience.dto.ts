import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateExperienceDto {
  @IsString() @MinLength(1) @MaxLength(200) company!: string;
  @IsString() @MinLength(1) @MaxLength(200) position!: string;
  @IsOptional() @IsString() @MaxLength(255) location?: string;
  @IsOptional() @IsString() @MaxLength(5000) description?: string;
  @Type(() => Date) @IsDate() startDate!: Date;
  @IsOptional() @Type(() => Date) @IsDate() endDate?: Date;
  @IsOptional() @IsBoolean() isCurrent?: boolean;
}
