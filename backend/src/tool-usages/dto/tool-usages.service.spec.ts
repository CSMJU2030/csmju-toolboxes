// backend/src/tool-usages/dto/tool-usages.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../prisma/prisma.service';
import { ToolUsagesService } from '../tool-usages.service';

describe('ToolUsagesService', () => {
  let service: ToolUsagesService;

  const prismaMock = {
    toolUsage: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ToolUsagesService,
          {
            provide: PrismaService,
            useValue: prismaMock,
          },
        ],
      }).compile();

    service =
      module.get<ToolUsagesService>(
        ToolUsagesService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return tool usages for the specified user ordered by createdAt descending', async () => {
    const coreUserId = 'user-1';

    const usages = [
      {
        id: 'usage-1',
        coreUserId: 'user-1',
        toolId: 'tool-1',
        status: 'SUCCESS',
        createdAt: new Date('2026-01-02'),
      },
    ];

    prismaMock.toolUsage.findMany.mockResolvedValue(
      usages,
    );

    const result =
      await service.findAll(coreUserId);

    expect(result).toEqual(usages);

    expect(
      prismaMock.toolUsage.findMany,
    ).toHaveBeenCalledWith({
      where: {
        coreUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });
});