import { randomBytes, timingSafeEqual } from 'node:crypto';

import {
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { CoreHubTokenVerifier } from './core-hub-token.verifier';
import { Public } from './decorators/public.decorator';

const subsystemId = () => process.env.SUBSYSTEM_ID ?? 'csmju-toolboxes';
const cookiePrefix = () => subsystemId().replace(/-/g, '_');
const secureCookie = () => process.env.NODE_ENV === 'production';
const coreHubWebUrl = () =>
  process.env.CORE_HUB_WEB_URL ?? 'https://csmju2030.jowave.com';

function safeNext(value: unknown, origin: string): string {
  if (typeof value !== 'string' || value.length < 1 || value.length > 512) return '/';
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/';
  if ([...value].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) return '/';
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || url.pathname === '/auth' || url.pathname.startsWith('/auth/')) return '/';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}

function appendCookie(
  response: Response,
  name: string,
  value: string,
  options: { path: string; maxAge: number; httpOnly?: boolean },
): void {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path}`, `Max-Age=${options.maxAge}`, 'SameSite=Lax'];
  if (options.httpOnly) parts.push('HttpOnly');
  if (secureCookie()) parts.push('Secure');
  const existing = response.getHeader('Set-Cookie');
  const cookies = existing ? (Array.isArray(existing) ? existing : [String(existing)]) : [];
  response.setHeader('Set-Cookie', [...cookies, parts.join('; ')]);
}

function clearCookie(response: Response, name: string, path: string): void {
  appendCookie(response, name, '', { path, maxAge: 0, httpOnly: true });
}

function noStore(response: Response): void {
  response.setHeader('Cache-Control', 'no-store');
}

function readCookie(request: Request, name: string): string | undefined {
  for (const part of (request.headers.cookie ?? '').split(';')) {
    const separator = part.indexOf('=');
    if (separator >= 0 && part.slice(0, separator).trim() === name) {
      try { return decodeURIComponent(part.slice(separator + 1).trim()); } catch { return undefined; }
    }
  }
  return undefined;
}

@Controller('auth')
export class SsoController {
  constructor(private readonly tokenVerifier: CoreHubTokenVerifier) {}

  @Get('login')
  @Public()
  login(@Req() request: Request, @Res() response: Response): void {
    noStore(response);
    const origin = `${request.protocol}://${request.get('host')}`;
    const next = safeNext(request.query.next, origin);
    const state = randomBytes(32).toString('base64url');
    const packedNext = Buffer.from(next).toString('base64url');
    appendCookie(response, `${cookiePrefix()}_sso_state`, `${state}.${packedNext}`, {
      path: '/auth/callback', maxAge: 600, httpOnly: true,
    });
    const destination = new URL('/sso/authorize', coreHubWebUrl());
    destination.searchParams.set('subsystem', subsystemId());
    destination.searchParams.set('state', state);
    response.redirect(302, destination.toString());
  }

  @Get('callback')
  @Public()
  async callback(@Req() request: Request, @Res() response: Response): Promise<void> {
    noStore(response);
    response.setHeader('Referrer-Policy', 'no-referrer');
    const state = typeof request.query.state === 'string' ? request.query.state : undefined;
    const accessToken = typeof request.query.access_token === 'string' ? request.query.access_token : undefined;
    if (!accessToken) {
      if (state) clearCookie(response, `${cookiePrefix()}_sso_state`, '/auth/callback');
      response.status(400).send('Missing access token'); return;
    }
    if (!state) { response.redirect(302, '/auth/login'); return; }

    const stateCookieName = `${cookiePrefix()}_sso_state`;
    const packed = readCookie(request, stateCookieName);
    clearCookie(response, stateCookieName, '/auth/callback');
    if (!packed) { response.status(401).send('State verification failed. <a href="/auth/login">เข้าสู่ระบบอีกครั้ง</a>'); return; }

    const separator = packed.indexOf('.');
    const expected = separator >= 0 ? packed.slice(0, separator) : '';
    const encodedNext = separator >= 0 ? packed.slice(separator + 1) : '';
    const actualBytes = Buffer.from(state);
    const expectedBytes = Buffer.from(expected);
    if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) {
      response.status(401).send('State verification failed. <a href="/auth/login">เข้าสู่ระบบอีกครั้ง</a>'); return;
    }

    try {
      const user = await this.tokenVerifier.verify(accessToken);
      const maxAge = Math.max(0, user.tokenExpiresAt - Math.floor(Date.now() / 1000));
      if (maxAge === 0) { response.status(401).send('Access token expired'); return; }
      appendCookie(response, `${cookiePrefix()}_access_token`, accessToken, {
        path: '/', maxAge, httpOnly: true,
      });
      const next = Buffer.from(encodedNext, 'base64url').toString('utf8');
      const origin = `${request.protocol}://${request.get('host')}`;
      response.redirect(302, safeNext(next, origin));
    } catch {
      response.status(401).send('Invalid access token');
    }
  }

  @Post('logout')
  @Public()
  logout(@Res() response: Response): void {
    noStore(response);
    clearCookie(response, `${cookiePrefix()}_access_token`, '/');
    clearCookie(response, `${cookiePrefix()}_sso_state`, '/auth/callback');
    response.redirect(303, new URL('/logout', coreHubWebUrl()).toString());
  }
}
