import type { CoreRole } from './auth.types';

export const CORE_ROLE_TO_SUBSYSTEM_ROLE: Record<CoreRole, string> = {
  student: 'USER',
  alumni: 'USER',
  staff: 'STAFF',
  lecturer: 'STAFF',
  guest: 'VIEWER',
  admin: 'ADMIN',
};
