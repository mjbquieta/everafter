import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryAlbumsController } from './gallery-albums.controller';
import { GalleryPhotosController } from './gallery-photos.controller';
import { GalleryUploadController } from './gallery-upload.controller';
import { StorageModule } from '../../common/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [
    GalleryAlbumsController,
    GalleryPhotosController,
    GalleryUploadController,
  ],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
