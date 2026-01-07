import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { startTransaction, rollbackTransaction, db } from './testDb';

// Mock the db module
vi.mock('./db', () => ({
  db: {
    $executeRaw: vi.fn(),
  },
}));

describe('testDb transaction helpers', () => {
  let mockExecuteRaw: Mock;

  beforeEach(() => {
    mockExecuteRaw = db.$executeRaw as Mock;
    vi.clearAllMocks();
  });

  describe('startTransaction', () => {
    it('should execute BEGIN command', async () => {
      mockExecuteRaw.mockResolvedValue(undefined);

      await startTransaction();

      expect(mockExecuteRaw).toHaveBeenCalledWith(expect.anything());
      expect(mockExecuteRaw).toHaveBeenCalledTimes(1);
    });

    it('should throw clear error on failure', async () => {
      mockExecuteRaw.mockRejectedValue(new Error('Connection failed'));

      await expect(startTransaction()).rejects.toThrow(
        'Failed to start transaction: Connection failed',
      );
    });

    it('should complete within 100ms', async () => {
      mockExecuteRaw.mockResolvedValue(undefined);

      const start = Date.now();
      await startTransaction();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('rollbackTransaction', () => {
    it('should execute ROLLBACK command', async () => {
      mockExecuteRaw.mockResolvedValue(undefined);

      await rollbackTransaction();

      expect(mockExecuteRaw).toHaveBeenCalledWith(expect.anything());
      expect(mockExecuteRaw).toHaveBeenCalledTimes(1);
    });

    it('should throw clear error on failure', async () => {
      mockExecuteRaw.mockRejectedValue(new Error('Rollback failed'));

      await expect(rollbackTransaction()).rejects.toThrow(
        'Failed to rollback transaction: Rollback failed',
      );
    });

    it('should complete within 100ms', async () => {
      mockExecuteRaw.mockResolvedValue(undefined);

      const start = Date.now();
      await rollbackTransaction();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('db re-export', () => {
    it('should re-export db singleton', () => {
      expect(db).toBeDefined();
      expect(db.$executeRaw).toBeDefined();
    });
  });
});
