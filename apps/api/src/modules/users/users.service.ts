import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { UserResponse } from '@everafter/types';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.toUserResponse(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    return this.toUserResponse(user);
  }

  async updateLastLogin(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async setRefreshTokenHash(
    id: string,
    hash: string | null,
    expiresAt: Date | null,
  ) {
    await this.prisma.user.update({
      where: { id },
      data: {
        refreshTokenHash: hash,
        refreshTokenExpiresAt: expiresAt,
      },
    });
  }

  async getRefreshTokenHash(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { refreshTokenHash: true, refreshTokenExpiresAt: true },
    });
    return user;
  }

  private toUserResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    emailVerifiedAt: Date | null;
    lastLoginAt: Date | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
