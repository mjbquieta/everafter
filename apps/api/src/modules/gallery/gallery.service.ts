import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { ReorderPhotosDto } from './dto/reorder-photos.dto';
import type {
  GalleryAlbumResponse,
  GalleryPhotoResponse,
} from '@everafter/types';
import type { GalleryAlbum, GalleryPhoto } from '@everafter/database';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async ensureAlbumBelongsToWedding(
    weddingId: string,
    albumId: string,
  ): Promise<GalleryAlbum> {
    const album = await this.prisma.galleryAlbum.findFirst({
      where: { id: albumId, weddingId },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  // ─── Album CRUD ─────────────────────────────────────────────────────────────

  async createAlbum(
    weddingId: string,
    dto: CreateAlbumDto,
  ): Promise<GalleryAlbumResponse> {
    const album = await this.prisma.galleryAlbum.create({
      data: {
        weddingId,
        title: dto.title,
        coverImage: dto.coverImage,
      },
      include: { photos: { orderBy: { sortOrder: 'asc' } } },
    });

    return this.toAlbumResponse(album);
  }

  async findAllAlbums(weddingId: string): Promise<GalleryAlbumResponse[]> {
    const albums = await this.prisma.galleryAlbum.findMany({
      where: { weddingId },
      include: { photos: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });

    return albums.map((a) => this.toAlbumResponse(a));
  }

  async findOneAlbum(
    weddingId: string,
    albumId: string,
  ): Promise<GalleryAlbumResponse> {
    const album = await this.prisma.galleryAlbum.findFirst({
      where: { id: albumId, weddingId },
      include: { photos: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return this.toAlbumResponse(album);
  }

  async updateAlbum(
    weddingId: string,
    albumId: string,
    dto: UpdateAlbumDto,
  ): Promise<GalleryAlbumResponse> {
    await this.ensureAlbumBelongsToWedding(weddingId, albumId);

    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.coverImage !== undefined) data.coverImage = dto.coverImage;

    const album = await this.prisma.galleryAlbum.update({
      where: { id: albumId },
      data,
      include: { photos: { orderBy: { sortOrder: 'asc' } } },
    });

    return this.toAlbumResponse(album);
  }

  async removeAlbum(weddingId: string, albumId: string): Promise<void> {
    await this.ensureAlbumBelongsToWedding(weddingId, albumId);

    await this.prisma.galleryAlbum.delete({
      where: { id: albumId },
    });
  }

  // ─── Photo CRUD ─────────────────────────────────────────────────────────────

  async createPhoto(
    weddingId: string,
    albumId: string,
    dto: CreatePhotoDto,
  ): Promise<GalleryPhotoResponse> {
    await this.ensureAlbumBelongsToWedding(weddingId, albumId);

    const photo = await this.prisma.galleryPhoto.create({
      data: {
        albumId,
        storageKey: dto.storageKey,
        caption: dto.caption,
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });

    return this.toPhotoResponse(photo);
  }

  async findAllPhotos(
    weddingId: string,
    albumId: string,
  ): Promise<GalleryPhotoResponse[]> {
    await this.ensureAlbumBelongsToWedding(weddingId, albumId);

    const photos = await this.prisma.galleryPhoto.findMany({
      where: { albumId },
      orderBy: { sortOrder: 'asc' },
    });

    return photos.map((p) => this.toPhotoResponse(p));
  }

  async findOnePhoto(
    weddingId: string,
    albumId: string,
    photoId: string,
  ): Promise<GalleryPhotoResponse> {
    await this.ensureAlbumBelongsToWedding(weddingId, albumId);

    const photo = await this.prisma.galleryPhoto.findFirst({
      where: { id: photoId, albumId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    return this.toPhotoResponse(photo);
  }

  async updatePhoto(
    weddingId: string,
    albumId: string,
    photoId: string,
    dto: UpdatePhotoDto,
  ): Promise<GalleryPhotoResponse> {
    await this.ensureAlbumBelongsToWedding(weddingId, albumId);

    const existing = await this.prisma.galleryPhoto.findFirst({
      where: { id: photoId, albumId },
    });

    if (!existing) {
      throw new NotFoundException('Photo not found');
    }

    const data: Record<string, unknown> = {};
    if (dto.caption !== undefined) data.caption = dto.caption;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;

    const photo = await this.prisma.galleryPhoto.update({
      where: { id: photoId },
      data,
    });

    return this.toPhotoResponse(photo);
  }

  async removePhoto(
    weddingId: string,
    albumId: string,
    photoId: string,
  ): Promise<void> {
    await this.ensureAlbumBelongsToWedding(weddingId, albumId);

    const existing = await this.prisma.galleryPhoto.findFirst({
      where: { id: photoId, albumId },
    });

    if (!existing) {
      throw new NotFoundException('Photo not found');
    }

    await this.prisma.galleryPhoto.delete({
      where: { id: photoId },
    });
  }

  async reorderPhotos(
    weddingId: string,
    albumId: string,
    dto: ReorderPhotosDto,
  ): Promise<GalleryPhotoResponse[]> {
    await this.ensureAlbumBelongsToWedding(weddingId, albumId);

    const existing = await this.prisma.galleryPhoto.findMany({
      where: { albumId },
      select: { id: true },
    });

    const existingIds = new Set(existing.map((p) => p.id));
    for (const id of dto.photoIds) {
      if (!existingIds.has(id)) {
        throw new NotFoundException(
          `Photo ${id} not found in this album`,
        );
      }
    }

    await this.prisma.$transaction(
      dto.photoIds.map((id, index) =>
        this.prisma.galleryPhoto.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );

    return this.findAllPhotos(weddingId, albumId);
  }

  // ─── Mappers ────────────────────────────────────────────────────────────────

  private toAlbumResponse(
    album: GalleryAlbum & { photos: GalleryPhoto[] },
  ): GalleryAlbumResponse {
    return {
      id: album.id,
      weddingId: album.weddingId,
      title: album.title,
      coverImage: album.coverImage,
      photos: album.photos.map((p) => this.toPhotoResponse(p)),
      createdAt: album.createdAt.toISOString(),
      updatedAt: album.updatedAt.toISOString(),
    };
  }

  private toPhotoResponse(photo: GalleryPhoto): GalleryPhotoResponse {
    return {
      id: photo.id,
      albumId: photo.albumId,
      storageKey: photo.storageKey,
      caption: photo.caption,
      sortOrder: photo.sortOrder,
      createdAt: photo.createdAt.toISOString(),
    };
  }
}
