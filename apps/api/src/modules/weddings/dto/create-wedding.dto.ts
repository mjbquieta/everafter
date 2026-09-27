import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateWeddingDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsDateString()
  weddingDate?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}
