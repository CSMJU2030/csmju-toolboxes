// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { CoreHubJwtGuard } from './auth/guards/core-hub-jwt.guard';
import { HealthModule } from './health/health.module';
import { ImageHistoryModule } from './image-history/image-history.module';
import { PrismaModule } from './prisma/prisma.module';
import { ToolsModule } from './tools/tools.module';
import { ToolUsagesModule } from './tool-usages/tool-usages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env.local', '.env'],
    }),

    PrismaModule,
    AuthModule,
    HealthModule,
    ImageHistoryModule,
    ToolsModule,
    ToolUsagesModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: CoreHubJwtGuard,
    },
  ],
})
export class AppModule {}
