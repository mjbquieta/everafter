import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import type { UserResponse } from '@everafter/types';

@Injectable()
export class AuthService {
  private readonly refreshTokenExpiresIn: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.refreshTokenExpiresIn =
      this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') ?? '7d';
  }

  async register(dto: RegisterDto): Promise<UserResponse> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

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

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.usersService.updateLastLogin(user.id);

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const refreshTokenExpiresAt = this.getRefreshTokenExpiry();

    await this.usersService.setRefreshTokenHash(
      user.id,
      refreshTokenHash,
      refreshTokenExpiresAt,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
        lastLoginAt: new Date().toISOString(),
        status: user.status,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }

  async refresh(token: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        refreshTokenHash: tokenHash,
        refreshTokenExpiresAt: { gt: new Date() },
        status: 'active',
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const newRefreshToken = crypto.randomBytes(32).toString('hex');
    const newRefreshTokenHash = crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex');
    const refreshTokenExpiresAt = this.getRefreshTokenExpiry();

    await this.usersService.setRefreshTokenHash(
      user.id,
      newRefreshTokenHash,
      refreshTokenExpiresAt,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
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
      },
    };
  }

  async logout(userId: string) {
    await this.usersService.setRefreshTokenHash(userId, null, null);
  }

  private getRefreshTokenExpiry(): Date {
    const match = this.refreshTokenExpiresIn.match(/^(\d+)([dhms])$/);
    if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const value = parseInt(match[1], 10);
    const unit = match[2];
    const ms: Record<string, number> = {
      d: 24 * 60 * 60 * 1000,
      h: 60 * 60 * 1000,
      m: 60 * 1000,
      s: 1000,
    };

    return new Date(Date.now() + value * ms[unit]);
  }
}
