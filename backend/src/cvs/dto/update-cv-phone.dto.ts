import { PartialType } from '@nestjs/mapped-types';
import { CreateCvPhoneDto } from './create-cv-phone.dto';

export class UpdateCvPhoneDto extends PartialType(CreateCvPhoneDto) {}
