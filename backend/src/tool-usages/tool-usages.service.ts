// backend/src/tool-usages/tool-usages.service.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToolUsagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(coreUserId: string) {
    return this.prisma.toolUsage.findMany({
      where: {
        coreUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}