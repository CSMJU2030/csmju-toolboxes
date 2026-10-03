// backend/src/tools/tools.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { createPaginationMeta, normalizePagination } from '../pagination/pagination';
import type { ListToolsQueryDto } from './dto/list-tools-query.dto';
import type { CreateToolDto } from './dto/create-tool.dto';

@Injectable()
export class ToolsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListToolsQueryDto) {
    const pagination = normalizePagination(query);
    const where = { isActive: true, ...(query.category ? { category: query.category } : {}) };
    const [items, total] = await Promise.all([
      this.prisma.tool.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        skip: pagination.skip,
        take: pagination.limit,
      }),
      this.prisma.tool.count({ where }),
    ]);
    return {
      items,
      meta: createPaginationMeta(pagination.page, pagination.limit, total),
    };
  }

  async create(input: CreateToolDto) {
    return this.prisma.tool.create({ data: input });
  }

  async findOne(id: string) {
    const tool = await this.prisma.tool.findUnique({ where: { id } });
    if (!tool) throw new NotFoundException('Tool not found');
    return tool;
  }
}
