import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

enum LinkTypeLocal {
  LINKEDIN = 'LINKEDIN',
  GITHUB = 'GITHUB',
  PORTFOLIO = 'PORTFOLIO',
  PERSONAL = 'PERSONAL',
  BEHANCE = 'BEHANCE',
  DRIBBBLE = 'DRIBBBLE',
  TWITTER = 'TWITTER',
  OTHER = 'OTHER',
}

export class CreateCvLinkDto {
  @IsEnum(LinkTypeLocal)
  type!: LinkTypeLocal;

  @IsOptional() @IsString() @MaxLength(150) @Transform(({ value }: { value: string }) => value?.trim()) label?: string;

  @IsUrl({ require_protocol: true }) @MaxLength(2048) @Transform(({ value }: { value: string }) => value?.trim()) url!: string;
}

export { LinkTypeLocal as LinkType };
