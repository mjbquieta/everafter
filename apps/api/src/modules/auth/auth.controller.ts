import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import type { RequestWithUser } from './interfaces/request-with-user.interface';

const REFRESH_COOKIE = 'ea_refresh';
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie(REFRESH_COOKIE, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_MAX_AGE,
      path: '/api/v1/auth',
    });

    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'No refresh token provided',
          details: [],
        },
      });
      return;
    }

    const result = await this.authService.refresh(token);

    res.cookie(REFRESH_COOKIE, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_MAX_AGE,
      path: '/api/v1/auth',
    });

    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.userId);

    res.clearCookie(REFRESH_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: RequestWithUser) {
    return this.usersService.findById(req.user.userId);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail() {
    return { message: 'Email verification not yet implemented' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword() {
    return { message: 'Password reset email not yet implemented' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword() {
    return { message: 'Password reset not yet implemented' };
  }
}
