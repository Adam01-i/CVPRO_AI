import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { SkillLevel } from '../../../generated/prisma/client';
export class UpdateSkillDto { @IsOptional() @IsEnum(SkillLevel) level?: SkillLevel; @IsOptional() @IsNumber({ maxDecimalPlaces: 1 }) @Min(0) @Max(80) years?: number; }
