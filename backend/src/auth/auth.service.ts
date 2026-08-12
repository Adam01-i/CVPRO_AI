import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export type SafeUser = Omit<User, 'passwordHash'>;
export type JwtPayload = Pick<SafeUser, 'id' | 'email' | 'role'>;

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string; user: SafeUser }> {
    const email = registerDto.email.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('An account already exists for this email address.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        role: UserRole.USER,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: SafeUser }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email.toLowerCase() },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.buildAuthResponse(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(dto.newPassword, SALT_ROUNDS) },
    });
  }

  sanitizeUser(user: User): SafeUser {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private async buildAuthResponse(user: User): Promise<{ accessToken: string; user: SafeUser }> {
    const safeUser = this.sanitizeUser(user);
    const payload: JwtPayload = { id: safeUser.id, email: safeUser.email, role: safeUser.role };

    return { accessToken: await this.jwtService.signAsync(payload), user: safeUser };
  }
}
