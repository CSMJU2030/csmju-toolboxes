// backend/src/tools/tools.controller.ts

import { Controller, Get } from '@nestjs/common';

import { ToolsService } from './tools.service';

@Controller('v1/tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  async findAll(): Promise<unknown> {
    return this.toolsService.findAll();
  }
}