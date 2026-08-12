import { IsBoolean } from 'class-validator'; export class UpdateJobOfferStatusDto { @IsBoolean() isActive!: boolean; }
