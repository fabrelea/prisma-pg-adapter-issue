import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from './generated/prisma/client';

export type { PrismaClient } from './generated/prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({
  log: ['error', 'info', 'warn', 'query'],
  adapter: new PrismaPg(pool),
});
