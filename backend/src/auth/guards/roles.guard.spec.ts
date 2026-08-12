import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../../generated/prisma/client';
import { RolesGuard } from './roles.guard';

const contextFor = (role?: UserRole): ExecutionContext => ({
  getHandler: () => undefined,
  getClass: () => undefined,
  switchToHttp: () => ({ getRequest: () => ({ user: role ? { role } : undefined }) }),
} as unknown as ExecutionContext);

describe('RolesGuard', () => {
  it('allows the required role and rejects other roles', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue([UserRole.ADMIN]) };
    const guard = new RolesGuard(reflector as never);

    expect(guard.canActivate(contextFor(UserRole.ADMIN))).toBe(true);
    expect(guard.canActivate(contextFor(UserRole.USER))).toBe(false);
  });
});
