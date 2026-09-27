import { IsString, IsOptional, IsEmail, ValidateIf } from 'class-validator';

export class UpdateGuestDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  phone?: string | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  group?: string | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  side?: string | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  tableNumber?: string | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  mealPreference?: string | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  notes?: string | null;
}
