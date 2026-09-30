import { IsOptional, IsString, IsArray } from 'class-validator';

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
  @IsString()
  ceremonyTime?: string | null;

  @IsOptional()
  @IsString()
  receptionName?: string | null;

  @IsOptional()
  @IsString()
  receptionAddress?: string | null;

  @IsOptional()
  @IsString()
  receptionTime?: string | null;

  @IsOptional()
  @IsString()
  ceremonyImage?: string | null;

  @IsOptional()
  @IsString()
  receptionImage?: string | null;

  @IsOptional()
  @IsString()
  dressCode?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dressCodeColors?: string[] | null;

  @IsOptional()
  @IsArray()
  scheduleEvents?: { time: string; title: string; description?: string }[] | null;

  @IsOptional()
  @IsArray()
  faqItems?: { question: string; answer: string }[] | null;
}
