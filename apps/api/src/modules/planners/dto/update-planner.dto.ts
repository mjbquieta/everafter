import { IsString, IsOptional } from 'class-validator';

export class UpdatePlannerDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  website?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;
}
