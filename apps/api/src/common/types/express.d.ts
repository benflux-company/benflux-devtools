import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: PrismaUser & { orgId: string | null; roles: string[] };
    }
  }
}

export {};
