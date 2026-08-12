import { Type } from 'class-transformer'; import { IsDate, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
export class CreateProjectDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsOptional() @IsString() @MaxLength(5000) description?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(2048) url?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(2048) githubUrl?: string;
  @IsOptional() @IsString() @MaxLength(1000) technologies?: string;
  @IsOptional() @Type(() => Date) @IsDate() startDate?: Date;
  @IsOptional() @Type(() => Date) @IsDate() endDate?: Date;
}
