import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateCvDto {
  @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MinLength(1) @MaxLength(200) title!: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(5000) summary?: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim().toLowerCase()) @IsEmail() @MaxLength(255) email?: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(30) phone?: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(255) address?: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(255) addressLine?: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(30) postalCode?: string;
  @IsOptional() @Transform(({ value }: { value: string }) => value?.trim()) @IsString() @MaxLength(150) city?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(2048) linkedin?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(2048) github?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(2048) portfolio?: string;
  // Non exposé côté DTO d'écriture publique : photoUrl est géré exclusivement
  // par l'endpoint POST /cvs/:id/photo, jamais via ce DTO texte, pour éviter
  // qu'un client envoie n'importe quelle URL sans passer par la validation d'upload.
  @IsOptional() @IsString() @MaxLength(50) templateId?: string;
  @IsOptional() @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'accentColor doit être une couleur hex valide (#rrggbb).' }) accentColor?: string;
}