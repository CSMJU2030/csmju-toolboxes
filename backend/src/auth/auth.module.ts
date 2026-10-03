// backend/src/auth/auth.module.ts

import { Module } from '@nestjs/common';

import { CoreHubTokenVerifier } from './core-hub-token.verifier';
import { CoreHubJwtGuard } from './guards/core-hub-jwt.guard';
import { JwksService } from './jwks.service';
import { MeController } from './me.controller';
import { SsoController } from './sso.controller';

@Module({
  controllers: [SsoController, MeController],
  providers: [
    JwksService,
    CoreHubTokenVerifier,
    CoreHubJwtGuard,
  ],
  exports: [
    JwksService,
    CoreHubTokenVerifier,
    CoreHubJwtGuard,
  ],
})
export class AuthModule {}
