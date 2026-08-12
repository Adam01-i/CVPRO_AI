import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateLanguageDto { @IsString() @MinLength(1) @MaxLength(100) name!: string; @IsOptional() @IsString() @MaxLength(100) level?: string; }
