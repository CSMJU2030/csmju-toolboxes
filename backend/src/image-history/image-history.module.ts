import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ImageHistoryCleanupService } from './image-history-cleanup.service';
import { ImageHistoryController } from './image-history.controller';
import { ImageHistoryService } from './image-history.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ImageHistoryController],
  providers: [ImageHistoryService, ImageHistoryCleanupService],
})
export class ImageHistoryModule {}
