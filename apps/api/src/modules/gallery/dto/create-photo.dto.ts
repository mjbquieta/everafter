import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  storageKey!: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
