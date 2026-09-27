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
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeddingTenantGuard } from '../auth/guards/wedding-tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@everafter/types';
import { GalleryService } from './gallery.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { ReorderPhotosDto } from './dto/reorder-photos.dto';

@Controller('weddings/:weddingId/gallery/albums/:albumId/photos')
@UseGuards(JwtAuthGuard, WeddingTenantGuard)
export class GalleryPhotosController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  findAll(
    @Param('weddingId') weddingId: string,
    @Param('albumId') albumId: string,
  ) {
    return this.galleryService.findAllPhotos(weddingId, albumId);
  }

  @Get(':photoId')
  findOne(
    @Param('weddingId') weddingId: string,
    @Param('albumId') albumId: string,
    @Param('photoId') photoId: string,
  ) {
    return this.galleryService.findOnePhoto(weddingId, albumId, photoId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  create(
    @Param('weddingId') weddingId: string,
    @Param('albumId') albumId: string,
    @Body() dto: CreatePhotoDto,
  ) {
    return this.galleryService.createPhoto(weddingId, albumId, dto);
  }

  @Patch(':photoId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  update(
    @Param('weddingId') weddingId: string,
    @Param('albumId') albumId: string,
    @Param('photoId') photoId: string,
    @Body() dto: UpdatePhotoDto,
  ) {
    return this.galleryService.updatePhoto(weddingId, albumId, photoId, dto);
  }

  @Delete(':photoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  remove(
    @Param('weddingId') weddingId: string,
    @Param('albumId') albumId: string,
    @Param('photoId') photoId: string,
  ) {
    return this.galleryService.removePhoto(weddingId, albumId, photoId);
  }

  @Put('reorder')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE, UserRole.PLANNER)
  reorder(
    @Param('weddingId') weddingId: string,
    @Param('albumId') albumId: string,
    @Body() dto: ReorderPhotosDto,
  ) {
    return this.galleryService.reorderPhotos(weddingId, albumId, dto);
  }
}
