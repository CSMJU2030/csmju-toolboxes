import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type {} from 'multer';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';

import { ImageHistoryService } from './image-history.service';

@Controller('v1/image-history')
@ApiTags('image-history')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Bearer access token is missing or invalid' })
export class ImageHistoryController {
  constructor(private readonly imageHistoryService: ImageHistoryService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'original', maxCount: 1 },
    { name: 'compressed', maxCount: 1 },
  ], { limits: { fileSize: 25 * 1024 * 1024, files: 2 } }))
  @ApiOperation({ summary: 'Save original and compressed images for 30 days' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', required: ['original', 'compressed'], properties: {
    original: { type: 'string', format: 'binary' },
    compressed: { type: 'string', format: 'binary' },
  } } })
  @ApiCreatedResponse({ description: 'Image history record and download URLs' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFiles() files: { original?: Express.Multer.File[]; compressed?: Express.Multer.File[] },
  ) {
    const original = files.original?.[0];
    const compressed = files.compressed?.[0];
    if (!original || !compressed) {
      throw new BadRequestException('Both original and compressed image files are required');
    }
    return this.imageHistoryService.create(user.coreUserId, { original, compressed });
  }

  @Get()
  @ApiOperation({ summary: 'List unexpired image history for the authenticated user' })
  @ApiOkResponse({ description: 'Image history ordered from newest to oldest' })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.imageHistoryService.findAll(user.coreUserId);
  }

  @Get(':id/original')
  @ApiOperation({ summary: 'Download an original image owned by the authenticated user' })
  async downloadOriginal(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() response: Response,
  ): Promise<void> {
    const file = await this.imageHistoryService.getFile(user.coreUserId, id, 'original');
    this.sendFile(response, file.buffer, file.filename, file.mimeType);
  }

  @Get(':id/compressed')
  @ApiOperation({ summary: 'Download a compressed image owned by the authenticated user' })
  async downloadCompressed(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() response: Response,
  ): Promise<void> {
    const file = await this.imageHistoryService.getFile(user.coreUserId, id, 'compressed');
    this.sendFile(response, file.buffer, file.filename, file.mimeType);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an image history record and its files' })
  @ApiNoContentResponse({ description: 'Image history and stored files deleted' })
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.imageHistoryService.remove(user.coreUserId, id);
  }

  private sendFile(response: Response, buffer: Buffer, filename: string, mimeType: string): void {
    const encodedFilename = encodeURIComponent(filename);
    response.setHeader('Content-Type', mimeType);
    response.setHeader('Content-Length', buffer.length);
    response.setHeader('Content-Disposition', `attachment; filename="download"; filename*=UTF-8''${encodedFilename}`);
    response.setHeader('Cache-Control', 'no-store');
    response.send(buffer);
  }
}
