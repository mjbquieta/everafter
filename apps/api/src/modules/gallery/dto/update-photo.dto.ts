import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdatePhotoDto {
  @IsOptional()
  @IsString()
  caption?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
