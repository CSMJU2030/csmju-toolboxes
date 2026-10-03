// backend/src/tools/tools.controller.ts

import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ToolsService } from './tools.service';

@Controller('v1/tools')
@ApiTags('tools')
@ApiBearerAuth()
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  @ApiOperation({ summary: 'List active tools' })
  @ApiOkResponse({
    description: 'Active tools ordered by creation date',
    schema: {
      type: 'object',
      required: ['success', 'data'],
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'name', 'category', 'isActive', 'createdAt', 'updatedAt'],
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string', example: 'ลดขนาดรูปภาพ' },
              description: { type: 'string', nullable: true },
              category: { type: 'string', enum: ['IMAGE', 'DOCUMENT', 'OTHER'] },
              isActive: { type: 'boolean', example: true },
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
  async findAll(): Promise<unknown> {
    return this.toolsService.findAll();
  }
}