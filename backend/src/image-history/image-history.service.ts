import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';

import type {} from 'multer';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const TOOL_ID = '61a454f9-1c52-4d0e-882f-7f16d3cdff01';
const RETENTION_DAYS = 30;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export interface UploadedImagePair {
  original: Express.Multer.File;
  compressed: Express.Multer.File;
}

@Injectable()
export class ImageHistoryService {
  private readonly logger = new Logger(ImageHistoryService.name);
  private readonly storageDirectory = resolve(
    process.env.IMAGE_STORAGE_PATH ?? 'data/image-history',
  );

  constructor(private readonly prisma: PrismaService) {}

  async create(coreUserId: string, pair: UploadedImagePair) {
    this.validateFile(pair.original);
    this.validateFile(pair.compressed);
    const tool = await this.prisma.tool.findFirst({
      where: { id: TOOL_ID, isActive: true, category: 'IMAGE' },
      select: { id: true },
    });
    if (!tool) throw new NotFoundException('Image compressor is unavailable');

    const id = randomUUID();
    const originalExtension = MIME_EXTENSIONS[pair.original.mimetype];
    const outputExtension = MIME_EXTENSIONS[pair.compressed.mimetype];
    const originalStorageKey = `${id}-original${originalExtension}`;
    const outputStorageKey = `${id}-compressed${outputExtension}`;
    await mkdir(this.storageDirectory, { recursive: true });

    try {
      await writeFile(resolve(this.storageDirectory, originalStorageKey), pair.original.buffer, { flag: 'wx' });
      await writeFile(resolve(this.storageDirectory, outputStorageKey), pair.compressed.buffer, { flag: 'wx' });
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000);
      const record = await this.prisma.$transaction(async (tx) => {
        const history = await tx.imageHistory.create({
          data: {
            id,
            coreUserId,
            toolId: tool.id,
            originalFilename: this.safeFilename(pair.original.originalname, originalExtension),
            originalMimeType: pair.original.mimetype,
            originalSizeBytes: pair.original.size,
            originalStorageKey,
            outputFilename: this.compressedFilename(pair.original.originalname, outputExtension),
            outputMimeType: pair.compressed.mimetype,
            outputSizeBytes: pair.compressed.size,
            outputStorageKey,
            createdAt,
            expiresAt,
          },
        });
        await tx.toolUsage.create({
          data: {
            coreUserId,
            toolId: tool.id,
            status: 'SUCCESS',
            inputSizeBytes: pair.original.size,
            outputSizeBytes: pair.compressed.size,
          },
        });
        return history;
      });
      return this.publicRecord(record);
    } catch (error) {
      await Promise.all([
        rm(resolve(this.storageDirectory, originalStorageKey), { force: true }),
        rm(resolve(this.storageDirectory, outputStorageKey), { force: true }),
      ]);
      throw error;
    }
  }

  async findAll(coreUserId: string) {
    const records = await this.prisma.imageHistory.findMany({
      where: { coreUserId, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => this.publicRecord(record));
  }

  async getFile(coreUserId: string, id: string, kind: 'original' | 'compressed') {
    const record = await this.prisma.imageHistory.findFirst({
      where: { id, coreUserId, expiresAt: { gt: new Date() } },
    });
    if (!record) throw new NotFoundException('Image history was not found');
    const storageKey = kind === 'original' ? record.originalStorageKey : record.outputStorageKey;
    const filename = kind === 'original' ? record.originalFilename : record.outputFilename;
    const mimeType = kind === 'original' ? record.originalMimeType : record.outputMimeType;
    try {
      return { buffer: await readFile(resolve(this.storageDirectory, storageKey)), filename, mimeType };
    } catch {
      this.logger.warn(JSON.stringify({ event: 'image_history.file_missing', historyId: record.id, kind }));
      throw new NotFoundException('Image file is no longer available');
    }
  }

  async remove(coreUserId: string, id: string): Promise<void> {
    const record = await this.prisma.imageHistory.findFirst({ where: { id, coreUserId } });
    if (!record) throw new NotFoundException('Image history was not found');
    await this.removeStoredFiles(record.originalStorageKey, record.outputStorageKey);
    await this.prisma.imageHistory.delete({ where: { id } });
  }

  async removeExpired(tx?: Prisma.TransactionClient): Promise<number> {
    const db = tx ?? this.prisma;
    const now = new Date();
    const expired = await db.imageHistory.findMany({
      where: { expiresAt: { lte: now } },
      select: { id: true, originalStorageKey: true, outputStorageKey: true },
    });
    for (const record of expired) {
      await this.removeStoredFiles(record.originalStorageKey, record.outputStorageKey);
    }
    if (expired.length === 0) return 0;
    const deleted = await db.imageHistory.deleteMany({
      where: { id: { in: expired.map(({ id }) => id) }, expiresAt: { lte: now } },
    });
    return deleted.count;
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file || file.size <= 0 || file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('Each image must be between 1 byte and 25 MB');
    }
    if (!MIME_EXTENSIONS[file.mimetype] || !this.hasValidSignature(file)) {
      throw new BadRequestException('Only valid JPG, PNG, or WebP files are accepted');
    }
  }

  private hasValidSignature(file: Express.Multer.File): boolean {
    const bytes = file.buffer;
    if (file.mimetype === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (file.mimetype === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  }

  private safeFilename(input: string, extension: string): string {
    const stem = basename(input, extname(input))
      .split('')
      .filter((character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127 && !'<>:"/\\|?*'.includes(character))
      .join('')
      .trim()
      .slice(0, 120) || 'image';
    return `${stem}${extension}`;
  }

  private compressedFilename(input: string, extension: string): string {
    const stem = this.safeFilename(input, '').replace(/\.$/, '');
    return `${stem}-compressed${extension}`;
  }

  private publicRecord(record: {
    id: string; originalFilename: string; originalMimeType: string; originalSizeBytes: number;
    outputFilename: string; outputMimeType: string; outputSizeBytes: number; createdAt: Date; expiresAt: Date;
  }) {
    return {
      id: record.id,
      originalFilename: record.originalFilename,
      originalMimeType: record.originalMimeType,
      originalSizeBytes: record.originalSizeBytes,
      outputFilename: record.outputFilename,
      outputMimeType: record.outputMimeType,
      outputSizeBytes: record.outputSizeBytes,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt,
      originalDownloadUrl: `/api/v1/image-history/${record.id}/original`,
      compressedDownloadUrl: `/api/v1/image-history/${record.id}/compressed`,
    };
  }

  private async removeStoredFiles(...keys: string[]): Promise<void> {
    await Promise.all(keys.map(async (key) => {
      try {
        await rm(resolve(this.storageDirectory, key));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
    }));
  }
}
