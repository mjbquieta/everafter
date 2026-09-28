import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { RSVPStatus } from '@everafter/types';

export class PublicRsvpDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(RSVPStatus)
  status!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  companionCount?: number;

  @IsOptional()
  @IsString()
  mealPreference?: string;

  @IsOptional()
  @IsString()
  songRequest?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
