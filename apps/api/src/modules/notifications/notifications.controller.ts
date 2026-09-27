import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  findAll(@Request() req: { user: { userId: string } }) {
    return this.notificationsService.findAll(req.user.userId);
  }

  @Get('unread')
  findUnread(@Request() req: { user: { userId: string } }) {
    return this.notificationsService.findUnread(req.user.userId);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req: { user: { userId: string } }) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Patch(':notificationId/read')
  markAsRead(
    @Request() req: { user: { userId: string } },
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.markAsRead(req.user.userId, notificationId);
  }

  @Delete(':notificationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Request() req: { user: { userId: string } },
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.remove(req.user.userId, notificationId);
  }
}
