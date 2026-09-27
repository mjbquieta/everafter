import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string | undefined;

  @IsOptional()
  @IsString()
  lastName?: string | undefined;

  @IsOptional()
  @IsString()
  avatarUrl?: string | null | undefined;
}
