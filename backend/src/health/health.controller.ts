// backend/src/health/health.controller.ts
// GET /api/health → { success, data: { status, service } }.

import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Check subsystem health' })
  @ApiOkResponse({
    description: 'Subsystem is ready',
    schema: {
      type: 'object',
      required: ['success', 'data'],
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          required: ['status', 'service'],
          properties: {
            status: { type: 'string', example: 'ok' },
            service: { type: 'string', example: 'csmju-toolboxes' },
          },
        },
      },
    },
  })
  health(): { status: string; service: string } {
    return {
      status: 'ok',
      service: process.env.SUBSYSTEM_ID ?? 'csmju-toolboxes',
    };
  }
}