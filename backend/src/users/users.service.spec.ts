import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

const user: User = {
  id: 'user-1', email: 'user@example.com', passwordHash: 'secret', firstName: 'Ada', lastName: 'Lovelace',
  phone: null, location: null, profileImage: null, role: UserRole.USER,
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'),
};

describe('UsersService', () => {
  let service: UsersService;
  const prisma = { user: { findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('retrieves a user without the password hash', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    const result = await service.findById(user.id);
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('updates only the supplied profile fields', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    prisma.user.update.mockResolvedValue({ ...user, location: 'Dakar' });
    await expect(service.update(user.id, { location: 'Dakar' })).resolves.toMatchObject({ location: 'Dakar' });
  });

  it('deletes an existing user', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    prisma.user.delete.mockResolvedValue(user);
    await expect(service.remove(user.id)).resolves.toBeUndefined();
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: user.id } });
  });
});
