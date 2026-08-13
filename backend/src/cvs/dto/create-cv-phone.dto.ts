import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCvPhoneDto {
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(60) label?: string;
  @IsString() @MinLength(3) @MaxLength(60) @Transform(({ value }: { value: string }) => value?.trim()) number!: string;
  @IsOptional() primary?: boolean = false;
}
