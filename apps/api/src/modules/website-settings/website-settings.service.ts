import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateWebsiteSettingsDto } from './dto/update-website-settings.dto';
import type { WebsiteSettingsResponse } from '@everafter/types';
import type { WebsiteSettings } from '@everafter/database';

@Injectable()
export class WebsiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(weddingId: string): Promise<WebsiteSettingsResponse> {
    const settings = await this.prisma.websiteSettings.upsert({
      where: { weddingId },
      create: { weddingId },
      update: {},
    });

    return this.toResponse(settings);
  }

  async update(
    weddingId: string,
    dto: UpdateWebsiteSettingsDto,
  ): Promise<WebsiteSettingsResponse> {
    const data: Record<string, unknown> = {};
    if (dto.theme !== undefined) data.theme = dto.theme;
    if (dto.primaryColor !== undefined) data.primaryColor = dto.primaryColor;
    if (dto.secondaryColor !== undefined) data.secondaryColor = dto.secondaryColor;
    if (dto.font !== undefined) data.font = dto.font;
    if (dto.heroImage !== undefined) data.heroImage = dto.heroImage;
    if (dto.heroBanner !== undefined) data.heroBanner = dto.heroBanner;
    if (dto.navigationStyle !== undefined) data.navigationStyle = dto.navigationStyle;
    if (dto.animations !== undefined) data.animations = dto.animations;
    if (dto.footerText !== undefined) data.footerText = dto.footerText;

    const settings = await this.prisma.websiteSettings.upsert({
      where: { weddingId },
      create: { weddingId, ...data },
      update: data,
    });

    return this.toResponse(settings);
  }

  private toResponse(settings: WebsiteSettings): WebsiteSettingsResponse {
    return {
      id: settings.id,
      weddingId: settings.weddingId,
      theme: settings.theme,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      font: settings.font,
      heroImage: settings.heroImage,
      heroBanner: settings.heroBanner,
      navigationStyle: settings.navigationStyle,
      animations: settings.animations,
      footerText: settings.footerText,
    };
  }
}
