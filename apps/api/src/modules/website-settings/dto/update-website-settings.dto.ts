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
  navigationStyle?: string;

  @IsOptional()
  @IsBoolean()
  animations?: boolean;

  @IsOptional()
  @IsString()
  footerText?: string | null;
}
