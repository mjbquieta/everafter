import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateWebsiteSettingsDto {
  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  font?: string;

  @IsOptional()
  @IsString()
  heroImage?: string | null;

  @IsOptional()
  @IsString()
  heroBanner?: string | null;

  @IsOptional()
  @IsString()
  layout?: string;

  @IsOptional()
  @IsString()
  navigationStyle?: string;

  @IsOptional()
  @IsString()
  dividerStyle?: string;

  @IsOptional()
  @IsString()
  dividerSize?: string;

  @IsOptional()
  @IsBoolean()
  animations?: boolean;

  @IsOptional()
  sections?: Record<string, boolean> | null;

  @IsOptional()
  @IsString()
  footerText?: string | null;

  @IsOptional()
  @IsBoolean()
  enableBackgroundMusic?: boolean;

  @IsOptional()
  @IsString()
  audioUrl?: string | null;
}
