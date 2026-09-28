import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { WeddingStatus } from '@everafter/types';

export class UpdateWeddingDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  weddingDate?: string | null;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsEnum(WeddingStatus)
  status?: WeddingStatus;

  @IsOptional()
  @IsString()
  customDomain?: string | null;
}
