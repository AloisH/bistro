import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/client';
import { incrementDbQueries, log } from './request-context';

const isDev = process.env.NODE_ENV === 'development';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const adapter = new PrismaPg({ connectionString });

  const client = new PrismaClient({
    adapter,
    log: isDev
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'stdout', level: 'error' },
          { emit: 'stdout', level: 'warn' },
        ]
      : [{ emit: 'stdout', level: 'error' }],
  });

  // Route queries to request trace in dev
  if (isDev) {
    client.$on('query', (e) => {
      incrementDbQueries();
      // Truncate long queries for readability
      const query = e.query.length > 100 ? `${e.query.slice(0, 100)}...` : e.query;
      log.debug(`DB ${e.duration}ms: ${query}`);
    });
  }

  return client;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

declare global {
  var prisma: PrismaClientSingleton | undefined;
}

export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}
