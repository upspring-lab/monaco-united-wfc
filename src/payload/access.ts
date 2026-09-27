import type { Access, FieldAccess, PayloadRequest } from 'payload';

export type Role = 'admin' | 'editor';

const roleOf = (req: PayloadRequest): Role | undefined => (req.user as { role?: Role } | null)?.role;

export const isAdmin = ({ req }: { req: PayloadRequest }): boolean => roleOf(req) === 'admin';

/** Admin ou éditeur connecté. */
export const isStaff = ({ req }: { req: PayloadRequest }): boolean => {
  const role = roleOf(req);
  return role === 'admin' || role === 'editor';
};

export const anyone: Access = () => true;
export const adminOnly: Access = isAdmin;
export const staffOnly: Access = isStaff;
export const nobody: Access = () => false;

/** Public : uniquement les documents publiés. Staff : tout, brouillons compris. */
export const publishedOrStaff: Access = args => (isStaff(args) ? true : { _status: { equals: 'published' } });

/** Un utilisateur peut se lire / se modifier lui-même ; un admin peut tout. */
export const adminOrSelf: Access = ({ req }) => {
  if (roleOf(req) === 'admin') return true;
  if (!req.user) return false;
  return { id: { equals: req.user.id } };
};

export const adminFieldOnly: FieldAccess = ({ req }) => roleOf(req) === 'admin';
