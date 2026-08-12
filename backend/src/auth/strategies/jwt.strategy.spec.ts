import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../../generated/prisma/client';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  const config = { getOrThrow: jest.fn().mockReturnValue('test-secret') };
  const prisma = { user: { findUnique: jest.fn() } };
  const strategy = new JwtStrategy(config as never, prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it('returns the current user data for a valid token payload', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'user@example.com', role: UserRole.USER });
    await expect(strategy.validate({ id: 'user-1', email: 'old@example.com', role: UserRole.ADMIN }))
      .resolves.toEqual({ id: 'user-1', email: 'user@example.com', role: UserRole.USER });
  });

  it('rejects a token for a deleted user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(strategy.validate({ id: 'missing', email: 'user@example.com', role: UserRole.USER }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });
});
