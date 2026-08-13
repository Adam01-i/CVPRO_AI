import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

import { LinkType } from '../../../generated/prisma/enums';

export class CreateCvLinkDto {
  @IsEnum(LinkType)
  type!: LinkType;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }: { value: string }) => value?.trim())
  label?: string;

  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  @Transform(({ value }: { value: string }) => value?.trim())
  url!: string;
}