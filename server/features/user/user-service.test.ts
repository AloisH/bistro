import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './user-service';
import { userRepository } from './user-repository';
import { emailService } from '../email/email-service';
import { log } from '../../utils/request-context';

// Mock userRepository
vi.mock('./user-repository', () => ({
  userRepository: {
    findById: vi.fn(),
    updateProfile: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

// Mock emailService
vi.mock('../email/email-service', () => ({
  emailService: {
    sendAccountDeletion: vi.fn(),
  },
}));

// Mock request-context log
vi.mock('../../utils/request-context', () => ({
  log: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock createError
vi.mock('h3', () => ({
  createError: vi.fn(error => error),
}));

const mockFindById = userRepository.findById as ReturnType<typeof vi.fn>;
const mockDeleteUser = userRepository.deleteUser as ReturnType<typeof vi.fn>;
const mockSendAccountDeletion = emailService.sendAccountDeletion as ReturnType<typeof vi.fn>;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService();
    mockDeleteUser.mockResolvedValue(true);
    mockSendAccountDeletion.mockResolvedValue({ id: 'test-email-id' });
  });

  describe('deleteAccountWithPassword', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'scrypt:salt123:hash123',
      image: null,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      mockFindById.mockResolvedValue(mockUser);
    });

    it('sends deletion email before deleting account', async () => {
      // Mock password verification by using a real scrypt hash
      const crypto = await import('node:crypto');
      const { promisify } = await import('node:util');
      const scryptAsync = promisify(crypto.scrypt);

      const password = 'testpassword123';
      const salt = 'testsalt';
      const hash = ((await scryptAsync(password, salt, 64)) as Buffer).toString('hex');
      const hashedPassword = `scrypt:${salt}:${hash}`;

      mockFindById.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await userService.deleteAccountWithPassword('user-123', password);

      expect(mockSendAccountDeletion).toHaveBeenCalledWith({
        to: 'test@example.com',
        name: 'Test User',
      });
      expect(mockDeleteUser).toHaveBeenCalledWith('user-123');
      expect(mockSendAccountDeletion).toHaveBeenCalledBefore(mockDeleteUser);
    });

    it('uses undefined for name if user.name is null', async () => {
      const crypto = await import('node:crypto');
      const { promisify } = await import('node:util');
      const scryptAsync = promisify(crypto.scrypt);

      const password = 'testpassword123';
      const salt = 'testsalt';
      const hash = ((await scryptAsync(password, salt, 64)) as Buffer).toString('hex');
      const hashedPassword = `scrypt:${salt}:${hash}`;

      mockFindById.mockResolvedValue({
        ...mockUser,
        name: null,
        password: hashedPassword,
      });

      await userService.deleteAccountWithPassword('user-123', password);

      expect(mockSendAccountDeletion).toHaveBeenCalledWith({
        to: 'test@example.com',
        name: undefined,
      });
    });

    it('still deletes account even if email fails', async () => {
      const crypto = await import('node:crypto');
      const { promisify } = await import('node:util');
      const scryptAsync = promisify(crypto.scrypt);

      const password = 'testpassword123';
      const salt = 'testsalt';
      const hash = ((await scryptAsync(password, salt, 64)) as Buffer).toString('hex');
      const hashedPassword = `scrypt:${salt}:${hash}`;

      mockFindById.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      mockSendAccountDeletion.mockRejectedValue(new Error('Email service error'));

      await userService.deleteAccountWithPassword('user-123', password);

      expect(mockDeleteUser).toHaveBeenCalledWith('user-123');
    });

    it('logs warning if email fails', async () => {
      const crypto = await import('node:crypto');
      const { promisify } = await import('node:util');
      const scryptAsync = promisify(crypto.scrypt);

      const password = 'testpassword123';
      const salt = 'testsalt';
      const hash = ((await scryptAsync(password, salt, 64)) as Buffer).toString('hex');
      const hashedPassword = `scrypt:${salt}:${hash}`;

      mockFindById.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      mockSendAccountDeletion.mockRejectedValue(new Error('Email service error'));

      await userService.deleteAccountWithPassword('user-123', password);

      expect(log.warn).toHaveBeenCalledWith('Account deletion email failed');
    });
  });

  describe('deleteAccountWithEmail', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      password: null, // OAuth account
      image: null,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      mockFindById.mockResolvedValue(mockUser);
    });

    it('sends deletion email before deleting account', async () => {
      await userService.deleteAccountWithEmail('user-123', 'test@example.com');

      expect(mockSendAccountDeletion).toHaveBeenCalledWith({
        to: 'test@example.com',
        name: 'Test User',
      });
      expect(mockDeleteUser).toHaveBeenCalledWith('user-123');
      expect(mockSendAccountDeletion).toHaveBeenCalledBefore(mockDeleteUser);
    });

    it('uses undefined for name if user.name is null', async () => {
      mockFindById.mockResolvedValue({
        ...mockUser,
        name: null,
      });

      await userService.deleteAccountWithEmail('user-123', 'test@example.com');

      expect(mockSendAccountDeletion).toHaveBeenCalledWith({
        to: 'test@example.com',
        name: undefined,
      });
    });

    it('still deletes account even if email fails', async () => {
      mockSendAccountDeletion.mockRejectedValue(new Error('Email service error'));

      await userService.deleteAccountWithEmail('user-123', 'test@example.com');

      expect(mockDeleteUser).toHaveBeenCalledWith('user-123');
    });

    it('logs warning if email fails', async () => {
      mockSendAccountDeletion.mockRejectedValue(new Error('Email service error'));

      await userService.deleteAccountWithEmail('user-123', 'test@example.com');

      expect(log.warn).toHaveBeenCalledWith('Account deletion email failed');
    });
  });
});
