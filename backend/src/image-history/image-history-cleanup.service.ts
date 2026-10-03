import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';

import { ImageHistoryService } from './image-history.service';

@Injectable()
export class ImageHistoryCleanupService {
  private readonly logger = new Logger(ImageHistoryCleanupService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly imageHistoryService: ImageHistoryService,
  ) {}

  @Cron('0 3 * * *', { timeZone: 'Asia/Bangkok' })
  async deleteExpiredFiles(): Promise<void> {
    const deleted = await this.prisma.$transaction(async (tx) => {
      const [{ locked }] = await tx.$queryRaw<{ locked: boolean }[]>`SELECT pg_try_advisory_xact_lock(30803001) AS locked`;
      if (!locked) return 0;
      return this.imageHistoryService.removeExpired(tx);
    });
    if (deleted > 0) {
      this.logger.log(JSON.stringify({ event: 'image_history.expired_deleted', count: deleted }));
    }
  }
}
