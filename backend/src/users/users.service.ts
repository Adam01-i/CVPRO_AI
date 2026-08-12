import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { SafeUser } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found.');
    return this.sanitizeUser(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<SafeUser> {
    await this.findById(id);
    const user = await this.prisma.user.update({ where: { id }, data: dto });
    return this.sanitizeUser(user);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.user.delete({ where: { id } });
  }

  private sanitizeUser(user: User): SafeUser {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
