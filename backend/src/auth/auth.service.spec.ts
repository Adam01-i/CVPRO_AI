import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

const makeUser = (passwordHash = 'hash'): User => ({
  id: 'user-1',
  email: 'user@example.com',
  passwordHash,
  firstName: 'Ada',
  lastName: 'Lovelace',
  phone: null,
  location: null,
  profileImage: null,
  role: UserRole.USER,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
});

describe('AuthService', () => {
  let service: AuthService;
  const prisma = { user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() } };
  const jwt = { signAsync: jest.fn().mockResolvedValue('signed-token') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('registers a user, hashes the password, and excludes the hash from its response', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(async ({ data }: { data: User }) => makeUser(data.passwordHash));

    const result = await service.register({
      email: 'USER@example.com', password: 'Password123!', firstName: 'Ada', lastName: 'Lovelace',
    });

    expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ email: 'user@example.com', role: UserRole.USER }),
    }));
    expect(result).toEqual(expect.objectContaining({ accessToken: 'signed-token' }));
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects a duplicate email address', async () => {
    prisma.user.findUnique.mockResolvedValue(makeUser());
    await expect(service.register({ email: 'user@example.com', password: 'Password123!', firstName: 'Ada', lastName: 'Lovelace' }))
      .rejects.toThrow('already exists');
  });

  it('logs in with valid credentials and rejects invalid credentials', async () => {
    const passwordHash = await bcrypt.hash('Password123!', 4);
    prisma.user.findUnique.mockResolvedValue(makeUser(passwordHash));
    await expect(service.login({ email: 'user@example.com', password: 'Password123!' }))
      .resolves.toEqual(expect.objectContaining({ accessToken: 'signed-token' }));
    await expect(service.login({ email: 'user@example.com', password: 'incorrect' }))
      .rejects.toThrow('Invalid email or password');
  });

  it('changes a password only after verifying the current password', async () => {
    const passwordHash = await bcrypt.hash('Password123!', 4);
    prisma.user.findUnique.mockResolvedValue(makeUser(passwordHash));
    prisma.user.update.mockResolvedValue(makeUser());

    await service.changePassword('user-1', { currentPassword: 'Password123!', newPassword: 'NewPassword123!' });

    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ passwordHash: expect.any(String) }),
    }));
  });
});
