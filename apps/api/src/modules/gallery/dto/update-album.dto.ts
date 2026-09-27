import { IsString, IsOptional } from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  coverImage?: string | null;
}
