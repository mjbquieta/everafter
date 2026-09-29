import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { resolve, join, extname } from 'path';
import { mkdir, writeFile, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';
import type { StorageProvider } from './storage.provider';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly uploadDir: string;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = resolve(config.get<string>('UPLOAD_DIR', './uploads'));
  }

  async save(file: Express.Multer.File, subdir: string): Promise<string> {
    const dir = resolve(this.uploadDir, subdir);
    await mkdir(dir, { recursive: true });

    const ext = extname(file.originalname) || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const filePath = join(dir, filename);

    await writeFile(filePath, file.buffer);

    return join(subdir, filename);
  }

  async delete(filePath: string): Promise<void> {
    try {
      await unlink(resolve(this.uploadDir, filePath));
    } catch {
      // File may already be deleted
    }
  }

  getUrl(filePath: string): string {
    return `/uploads/${filePath}`;
  }
}
