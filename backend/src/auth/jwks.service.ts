// backend/src/auth/jwks.service.ts

import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createRemoteJWKSet, importJWK, type JWK } from 'jose';

interface JwksResponse {
  keys: JWK[];
}

@Injectable()
export class JwksService {
  private readonly logger = new Logger(JwksService.name);

  private readonly jwksUrl =
    process.env.CORE_HUB_JWKS_URL ??
    'https://csmju2030.jowave.com/api/v1/.well-known/jwks.json';

  private readonly cacheTtlMs = 10 * 60 * 1000;
  private readonly minRefreshIntervalMs = 30 * 1000;

  private cachedKeys = new Map<string, JWK>();
  private cachedAt = 0;
  private lastRefreshAt = 0;

  // Keep the remote JWKS resolver available for future JWT verification.
  private readonly remoteJwks = createRemoteJWKSet(
    new URL(this.jwksUrl),
  );

  async getKey(kid: string): Promise<Awaited<ReturnType<typeof importJWK>>> {
    if (!kid) {
      throw new ServiceUnavailableException(
        'JWKS key id is required',
      );
    }

    await this.ensureCache();

    let jwk = this.cachedKeys.get(kid);

    if (!jwk) {
      await this.refreshIfAllowed('unknown_kid');
      jwk = this.cachedKeys.get(kid);
    }

    if (!jwk) {
      this.logger.warn(`Unknown JWKS kid: ${kid}`);

      throw new ServiceUnavailableException(
        'JWKS key not found',
      );
    }

    return importJWK(jwk, 'RS256');
  }

  private async ensureCache(): Promise<void> {
    const cacheExpired =
      Date.now() - this.cachedAt >= this.cacheTtlMs;

    if (this.cachedKeys.size === 0 || cacheExpired) {
      await this.refreshIfAllowed('cache_expired');
    }
  }

  private async refreshIfAllowed(reason: string): Promise<void> {
    const now = Date.now();

    if (
      this.lastRefreshAt > 0 &&
      now - this.lastRefreshAt < this.minRefreshIntervalMs
    ) {
      return;
    }

    this.lastRefreshAt = now;

    try {
      const response = await fetch(this.jwksUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `JWKS request failed with HTTP ${response.status}`,
        );
      }

      const body = (await response.json()) as JwksResponse;

      if (!body || !Array.isArray(body.keys)) {
        throw new Error('Invalid JWKS response format');
      }

      const nextKeys = new Map<string, JWK>();

      for (const jwk of body.keys) {
        if (
          jwk.kty !== 'RSA' ||
          typeof jwk.kid !== 'string' ||
          !jwk.n ||
          !jwk.e ||
          'd' in jwk
        ) {
          continue;
        }

        nextKeys.set(jwk.kid, jwk);
      }

      if (nextKeys.size === 0) {
        throw new Error(
          'JWKS contains no usable RSA public keys',
        );
      }

      this.cachedKeys = nextKeys;
      this.cachedAt = Date.now();

      this.logger.debug(
        `JWKS refreshed (${reason}): ${nextKeys.size} key(s)`,
      );
    } catch (error) {
      this.logger.error(
        `JWKS refresh failed (${reason})`,
        error instanceof Error ? error.stack : String(error),
      );

      if (this.cachedKeys.size === 0) {
        throw new ServiceUnavailableException(
          'Core Hub JWKS is unavailable',
        );
      }

      // Keep using the previously cached keys if Core Hub
      // is temporarily unavailable.
    }
  }
}