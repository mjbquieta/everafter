import { Module } from '@nestjs/common';
import { PlannersService } from './planners.service';
import { PlannersController } from './planners.controller';

@Module({
  controllers: [PlannersController],
  providers: [PlannersService],
  exports: [PlannersService],
})
export class PlannersModule {}
