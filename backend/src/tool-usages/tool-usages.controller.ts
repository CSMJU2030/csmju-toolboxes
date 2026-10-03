// backend/src/tool-usages/tool-usages.controller.ts

import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';

import { ToolUsagesService } from './tool-usages.service';

@Controller('v1/tool-usages')
@ApiTags('tool-usages')
@ApiBearerAuth()
export class ToolUsagesController {
  constructor(
    private readonly toolUsagesService: ToolUsagesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List tool usage history for the authenticated user' })
  @ApiOkResponse({
    description: 'Usage history ordered from newest to oldest',
    schema: {
      type: 'object',
      required: ['success', 'data'],
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'coreUserId', 'toolId', 'status', 'createdAt', 'updatedAt'],
            properties: {
              id: { type: 'string', format: 'uuid' },
              coreUserId: { type: 'string', maxLength: 64 },
              toolId: { type: 'string', format: 'uuid' },
              status: { type: 'string', enum: ['SUCCESS', 'FAILED'] },
              inputSizeBytes: { type: 'integer', nullable: true, minimum: 0 },
              outputSizeBytes: { type: 'integer', nullable: true, minimum: 0 },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Bearer access token is missing or invalid',
    schema: {
      type: 'object',
      required: ['success', 'error'],
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          required: ['code', 'message'],
          properties: {
            code: { type: 'string', example: 'UNAUTHORIZED' },
            message: { type: 'string' },
          },
        },
      },
    },
  })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<unknown> {
    return this.toolUsagesService.findAll(
      user.coreUserId,
    );
  }
}