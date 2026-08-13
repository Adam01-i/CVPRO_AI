import { PartialType } from '@nestjs/mapped-types';
import { CreateCvLinkDto } from './create-cv-link.dto';

export class UpdateCvLinkDto extends PartialType(CreateCvLinkDto) {}