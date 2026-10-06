import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { PublicMemoriesController } from './public-memories.controller';
import { StorageModule } from '../../common/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [PublicController, PublicMemoriesController],
  providers: [PublicService],
})
export class PublicModule {}
