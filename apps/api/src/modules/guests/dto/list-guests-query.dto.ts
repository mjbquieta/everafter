import { IsOptional, IsString, IsEnum } from 'class-validator';
import { RSVPStatus } from '@everafter/types';

export class ListGuestsQueryDto {
  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @IsString()
  side?: string;

  @IsOptional()
  @IsString()
  invitationStatus?: string;

  @IsOptional()
  @IsEnum(RSVPStatus)
  rsvpStatus?: string;
}
