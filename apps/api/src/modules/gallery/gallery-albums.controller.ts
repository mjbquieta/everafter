import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeddingTenantGuard } from '../auth/guards/wedding-tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@everafter/types';
import { GalleryService } from './gallery.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('weddings/:weddingId/gallery/albums')
@UseGuards(JwtAuthGuard, WeddingTenantGuard)
export class GalleryAlbumsController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  findAll(@Param('weddingId') weddingId: string) {
    return this.galleryService.findAllAlbums(weddingId);
  }

  @Get(':albumId')
  findOne(
    @Param('weddingId') weddingId: string,
    @Param('albumId') albumId: string,
  ) {
    return this.galleryService.findOneAlbum(weddingId, albumId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  create(
    @Param('weddingId') weddingId: string,
    @Body() dto: CreateAlbumDto,
  ) {
    return this.galleryService.createAlbum(weddingId, dto);
  }

  @Patch(':albumId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  update(
    @Param('weddingId') weddingId: string,
    @Param('albumId') albumId: string,
    @Body() dto: UpdateAlbumDto,
  ) {
    return this.galleryService.updateAlbum(weddingId, albumId, dto);
  }

  @Delete(':albumId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  remove(
    @Param('weddingId') weddingId: string,
    @Param('albumId') albumId: string,
  ) {
    return this.galleryService.removeAlbum(weddingId, albumId);
  }
}
