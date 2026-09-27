import { IsString, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
