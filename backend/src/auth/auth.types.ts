// backend/src/auth/auth.types.ts

export const CORE_ROLES = [
  'student',
  'alumni',
  'staff',
  'lecturer',
  'guest',
  'admin',
] as const;

export type CoreRole = (typeof CORE_ROLES)[number];

export interface CoreHubJwtPayload {
  sub: string;
  email?: string;
  role: CoreRole;
  sid?: string;
  iss: 'core-hub';
  aud: 'csmju2030';
  iat: number;
  exp: number;
  azp?: string;
}

export interface AuthenticatedUser {
  coreUserId: string;
  email?: string;
  role: CoreRole;
  sessionId?: string;
  tokenIssuedAt: number;
  tokenExpiresAt: number;
  azp?: string;
}