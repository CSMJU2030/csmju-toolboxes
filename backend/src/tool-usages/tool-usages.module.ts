// backend/src/tool-usages/tool-usages.module.ts

import { Module } from '@nestjs/common';

import { ToolUsagesController } from './tool-usages.controller';
import { ToolUsagesService } from './tool-usages.service';

@Module({
  controllers: [ToolUsagesController],
  providers: [ToolUsagesService],
  exports: [ToolUsagesService],
})
export class ToolUsagesModule {}