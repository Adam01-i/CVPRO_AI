import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { UserRole } from '../../generated/prisma/client';
import { JwtPayload, SafeUser } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: JwtPayload): Promise<SafeUser> {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto): Promise<SafeUser> {
    return this.usersService.update(user.id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('me')
  async deleteMe(@CurrentUser() user: JwtPayload): Promise<void> {
    await this.usersService.remove(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<SafeUser> {
    if (user.id !== id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You cannot access this user.');
    }
    return this.usersService.findById(id);
  }
}
