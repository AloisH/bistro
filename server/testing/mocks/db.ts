import { vi } from 'vitest';

function createModelMock() {
  return {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
    groupBy: vi.fn(),
    upsert: vi.fn(),
  };
}

export const mockDb = {
  user: createModelMock(),
  account: createModelMock(),
  session: createModelMock(),
  verification: createModelMock(),
  impersonationLog: createModelMock(),
  auditLog: createModelMock(),
  todo: createModelMock(),
  organization: createModelMock(),
  organizationMember: createModelMock(),
  organizationInvite: createModelMock(),
  $transaction: vi.fn(<T>(fn: (tx: typeof mockDb) => T) => fn(mockDb)),
  $executeRaw: vi.fn(),
  $queryRaw: vi.fn(),
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

export function resetMockDb() {
  for (const value of Object.values(mockDb)) {
    if (typeof value === 'object' && value !== null) {
      for (const fn of Object.values(value as Record<string, unknown>)) {
        if (typeof fn === 'function' && 'mockReset' in fn) {
          (fn as ReturnType<typeof vi.fn>).mockReset();
        }
      }
    }
    else if (typeof value === 'function' && 'mockReset' in value) {
      (value as ReturnType<typeof vi.fn>).mockReset();
    }
  }
}
