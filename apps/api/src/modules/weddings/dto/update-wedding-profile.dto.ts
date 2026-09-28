import { IsOptional, IsString, IsDateString, IsArray } from 'class-validator';

export class UpdateWeddingProfileDto {
  @IsOptional()
  @IsString()
  brideName?: string | null;

  @IsOptional()
  @IsString()
  groomName?: string | null;

  @IsOptional()
  @IsString()
  proposalStory?: string | null;

  @IsOptional()
  @IsString()
  loveStory?: string | null;

  @IsOptional()
  @IsString()
  weddingHashtag?: string | null;

  @IsOptional()
  @IsString()
  ceremonyName?: string | null;

  @IsOptional()
  @IsString()
  ceremonyAddress?: string | null;

  @IsOptional()
  @IsDateString()
  ceremonyTime?: string | null;

  @IsOptional()
  @IsString()
  receptionName?: string | null;

  @IsOptional()
  @IsString()
  receptionAddress?: string | null;

  @IsOptional()
  @IsDateString()
  receptionTime?: string | null;

  @IsOptional()
  @IsString()
  dressCode?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dressCodeColors?: string[] | null;
}
