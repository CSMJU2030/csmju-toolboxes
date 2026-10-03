// backend/src/auth/guards/core-hub-jwt.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { CoreHubTokenVerifier } from '../core-hub-token.verifier';
import type { AuthenticatedUser } from '../auth.types';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class CoreHubJwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenVerifier: CoreHubTokenVerifier,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token =
      this.extractBearerToken(request) ??
      this.extractSessionCookie(request);

    if (!token) {
      throw new UnauthorizedException(
        'Bearer access token is required',
      );
    }

    const user = await this.tokenVerifier.verify(token);

    request.user = user;

    return true;
  }

  private extractBearerToken(
    request: Request,
  ): string | null {
    const authorization = request.headers.authorization;

    if (
      typeof authorization !== 'string' ||
      authorization.trim().length === 0
    ) {
      return null;
    }

    const [scheme, credentials] =
      authorization.trim().split(/\s+/);

    if (
      scheme?.toLowerCase() !== 'bearer' ||
      !credentials
    ) {
      return null;
    }

    return credentials;
  }

  private extractSessionCookie(request: Request): string | null {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return null;

    const cookieName = `${(process.env.SUBSYSTEM_ID ?? 'csmju-toolboxes').replace(/-/g, '_')}_access_token`;
    for (const part of cookieHeader.split(';')) {
      const separator = part.indexOf('=');
      if (separator < 0 || part.slice(0, separator).trim() !== cookieName) continue;
      try {
        return decodeURIComponent(part.slice(separator + 1).trim());
      } catch {
        return null;
      }
    }
    return null;
  }
}
