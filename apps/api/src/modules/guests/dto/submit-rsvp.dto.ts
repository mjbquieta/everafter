import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { RSVPStatus } from '@everafter/types';

export class SubmitRsvpDto {
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
