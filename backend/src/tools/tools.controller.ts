// backend/src/tools/tools.controller.ts

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateToolDto } from './dto/create-tool.dto';
import { ListToolsQueryDto } from './dto/list-tools-query.dto';
import { ToolsService } from './tools.service';

@Controller('v1/tools')
@ApiTags('tools')
@ApiBearerAuth()
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  @ApiOperation({ summary: 'List active tools' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'category', required: false, enum: ['IMAGE', 'DOCUMENT', 'OTHER'] })
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
        meta: {
          type: 'object',
          required: ['total', 'page', 'limit', 'totalPages'],
          properties: {
            total: { type: 'integer', minimum: 0 },
            page: { type: 'integer', minimum: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100 },
            totalPages: { type: 'integer', minimum: 0 },
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
  async findAll(@Query() query: ListToolsQueryDto): Promise<unknown> {
    return this.toolsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tool by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNotFoundResponse({ description: 'Tool not found' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<unknown> {
    return this.toolsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a tool (staff or admin)' })
  @ApiCreatedResponse({ description: 'Tool created' })
  async create(
    @Body() input: CreateToolDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<unknown> {
    if (!['staff', 'admin'].includes(user.role)) {
      throw new ForbiddenException('Insufficient role to create tools');
    }
    return this.toolsService.create(input);
  }
}
