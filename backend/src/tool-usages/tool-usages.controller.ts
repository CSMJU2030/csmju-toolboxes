// backend/src/tool-usages/tool-usages.controller.ts

import { Controller, Get } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';

import { ToolUsagesService } from './tool-usages.service';

@Controller('v1/tool-usages')
export class ToolUsagesController {
  constructor(
    private readonly toolUsagesService: ToolUsagesService,
  ) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<unknown> {
    return this.toolUsagesService.findAll(
      user.coreUserId,
    );
  }
}