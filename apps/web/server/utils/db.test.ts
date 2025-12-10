import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules before any imports
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(function () {
    return {
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    };
  }),
}));

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: vi.fn(function () {
    return {
      provider: 'postgres',
      getConnectionInfo: vi.fn(),
    };
  }),
}));

vi.mock('pg', () => ({
  default: {
    Pool: vi.fn(function () {
      return {
        connect: vi.fn(),
        end: vi.fn(),
      };
    }),
  },
}));

describe('db singleton', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exports db instance', async () => {
    const { db } = await import('./db');
    expect(db).toBeDefined();
  });

  it('creates singleton pattern', async () => {
    const { db: db1 } = await import('./db');
    const { db: db2 } = await import('./db');

    expect(db1).toBe(db2);
  });
});
