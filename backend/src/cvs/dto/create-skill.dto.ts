import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { SkillLevel } from '../../../generated/prisma/client';
export class CreateSkillDto {
  @IsOptional() @IsUUID() skillId?: string;
  @IsOptional() @IsString() @MaxLength(150) name?: string;
  @IsOptional() @IsString() @MaxLength(100) category?: string;
  @IsOptional() @IsEnum(SkillLevel) level?: SkillLevel;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 1 }) @Min(0) @Max(80) years?: number;
}
