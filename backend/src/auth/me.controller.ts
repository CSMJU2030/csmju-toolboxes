import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './auth.types';
import { CORE_ROLE_TO_SUBSYSTEM_ROLE } from './role-mapping';

@Controller('v1/me')
@ApiTags('identity')
@ApiBearerAuth()
export class MeController {
  @Get()
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return {
      id: user.coreUserId,
      email: user.email,
      coreRole: user.role,
      subsystemRole: CORE_ROLE_TO_SUBSYSTEM_ROLE[user.role],
      session: { expiresAt: new Date(user.tokenExpiresAt * 1000).toISOString() },
    };
  }
}
