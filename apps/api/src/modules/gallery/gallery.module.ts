import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryAlbumsController } from './gallery-albums.controller';
import { GalleryPhotosController } from './gallery-photos.controller';

@Module({
  controllers: [GalleryAlbumsController, GalleryPhotosController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
