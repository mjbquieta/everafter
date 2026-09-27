import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { RequestWithUser } from '../interfaces/request-with-user.interface';

@Injectable()
export class WeddingTenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const weddingId = request.params.weddingId as string | undefined;

    if (!weddingId) {
      throw new ForbiddenException('Wedding ID is required');
    }

    const member = await this.prisma.weddingMember.findUnique({
      where: {
        weddingId_userId: {
          weddingId,
          userId: request.user.userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException(
        'You do not have access to this wedding',
      );
    }

    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
    });

    request.wedding = wedding!;
    request.weddingMember = member;

    return true;
  }
}
