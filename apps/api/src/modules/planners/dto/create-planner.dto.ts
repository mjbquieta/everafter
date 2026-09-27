import { IsString, IsOptional } from 'class-validator';

export class CreatePlannerDto {
  @IsString()
  businessName!: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
