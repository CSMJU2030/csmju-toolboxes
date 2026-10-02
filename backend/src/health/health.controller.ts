// backend/src/health/health.controller.ts
// GET /api/health → { success, data: { status: "ok", service } } (envelope เติมโดย ResponseInterceptor)

import { Controller, Get } from '@nestjs/common';

import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  health(): { status: string; service: string } {
    return {
      status: 'ok',
      service: process.env.SUBSYSTEM_ID ?? 'csmju-toolboxes',
    };
  }
}