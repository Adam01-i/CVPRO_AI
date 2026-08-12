import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class MatchCvDto {
  @IsUUID()
  cvId!: string;

  @IsUUID()
  jobOfferId!: string;
}

export class QueryMatchingDto {
  @IsOptional()
  @IsUUID()
  cvId?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minScore?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  maxScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;
}

export class AnalyzeMatchingDto extends MatchCvDto {}
