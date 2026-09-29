export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

export interface StorageProvider {
  save(file: Express.Multer.File, subdir: string): Promise<string>;
  delete(filePath: string): Promise<void>;
  getUrl(filePath: string): string;
}
