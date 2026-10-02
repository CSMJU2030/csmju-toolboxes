// backend/src/auth/core-hub-token.verifier.ts

import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import {
  decodeProtectedHeader,
  jwtVerify,
  type JWTPayload,
} from 'jose';

import { JwksService } from './jwks.service';
import type {
  AuthenticatedUser,
  CoreRole,
} from './auth.types';

const CORE_HUB_ISSUER = 'core-hub';
const CORE_HUB_AUDIENCE = 'csmju2030';
const ALGORITHM = 'RS256';

const CLOCK_TOLERANCE_SECONDS = 60;
const MAX_TOKEN_LIFETIME_SECONDS = 900;

const CORE_ROLES = new Set<string>([
  'student',
  'alumni',
  'staff',
  'lecturer',
  'guest',
  'admin',
]);

interface VerifiedJwtPayload extends JWTPayload {
  sub: string;
  email?: string;
  role: CoreRole;
  sid?: string;
  iss: string;
  aud: string | string[];
  iat: number;
  exp: number;
  azp?: string;
}

@Injectable()
export class CoreHubTokenVerifier {
  private readonly logger = new Logger(
    CoreHubTokenVerifier.name,
  );

  private readonly subsystemId =
    process.env.SUBSYSTEM_ID ?? 'csmju-toolboxes';

  constructor(
    private readonly jwksService: JwksService,
  ) {}

  async verify(
    token: string,
  ): Promise<AuthenticatedUser> {
    if (!token || !token.trim()) {
      throw new UnauthorizedException(
        'Access token is required',
      );
    }

    const protectedHeader = this.decodeHeader(token);

    // Step 3: algorithm must be RS256.
    if (protectedHeader.alg !== ALGORITHM) {
      throw new UnauthorizedException(
        'Invalid token algorithm',
      );
    }

    // Step 4: kid is required for JWKS lookup.
    if (
      typeof protectedHeader.kid !== 'string' ||
      !protectedHeader.kid
    ) {
      throw new UnauthorizedException(
        'Token kid is required',
      );
    }

    const publicKey = await this.jwksService.getKey(
      protectedHeader.kid,
    );

    try {
      // Step 5-7:
      // - verify RS256 signature
      // - verify issuer
      // - verify audience
      // - verify exp with 60s clock tolerance
      const { payload } = await jwtVerify(
        token,
        publicKey,
        {
          algorithms: [ALGORITHM],
          issuer: CORE_HUB_ISSUER,
          audience: CORE_HUB_AUDIENCE,
          clockTolerance: CLOCK_TOLERANCE_SECONDS,
        },
      );

      return this.validateClaims(
        payload as VerifiedJwtPayload,
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.debug(
        `Core Hub JWT verification failed: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
      );

      throw new UnauthorizedException(
        'Invalid access token',
      );
    }
  }

  private decodeHeader(
    token: string,
  ): {
    alg?: string;
    kid?: string;
    typ?: string;
  } {
    try {
      return decodeProtectedHeader(token);
    } catch {
      throw new UnauthorizedException(
        'Invalid access token header',
      );
    }
  }

  private validateClaims(
    payload: VerifiedJwtPayload,
  ): AuthenticatedUser {
    // Step 8: sub must exist and be non-empty.
    if (
      typeof payload.sub !== 'string' ||
      payload.sub.trim().length === 0
    ) {
      throw new UnauthorizedException(
        'Token subject is required',
      );
    }

    // Core Hub identity is opaque text.
    // Do NOT parse it as UUID.
    if (payload.sub.length > 64) {
      throw new UnauthorizedException(
        'Token subject is invalid',
      );
    }

    // role must be one of the Core Hub roles.
    if (
      typeof payload.role !== 'string' ||
      !CORE_ROLES.has(payload.role)
    ) {
      throw new UnauthorizedException(
        'Token role is invalid',
      );
    }

    // Step 9: iat is mandatory.
    if (
      typeof payload.iat !== 'number' ||
      !Number.isFinite(payload.iat)
    ) {
      throw new UnauthorizedException(
        'Token issued-at time is required',
      );
    }

    if (
      typeof payload.exp !== 'number' ||
      !Number.isFinite(payload.exp)
    ) {
      throw new UnauthorizedException(
        'Token expiration time is required',
      );
    }

    const tokenLifetime =
      payload.exp - payload.iat;

    if (
      tokenLifetime >
      MAX_TOKEN_LIFETIME_SECONDS +
        CLOCK_TOLERANCE_SECONDS
    ) {
      throw new UnauthorizedException(
        'Token lifetime is too long',
      );
    }

    // Prevent malformed timestamps such as exp < iat.
    if (tokenLifetime < 0) {
      throw new UnauthorizedException(
        'Token lifetime is invalid',
      );
    }

    // Step 10:
    // azp is optional in standards 1.7.0.
    // When present, it must match this subsystem.
    if (
      payload.azp !== undefined &&
      payload.azp !== this.subsystemId
    ) {
      throw new UnauthorizedException(
        'Token is not issued for this subsystem',
      );
    }

    return {
      coreUserId: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sid,
      tokenIssuedAt: payload.iat,
      tokenExpiresAt: payload.exp,
    };
  }
}