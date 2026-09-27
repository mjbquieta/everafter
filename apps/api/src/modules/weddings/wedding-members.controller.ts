import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeddingTenantGuard } from '../auth/guards/wedding-tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@everafter/types';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { WeddingsService } from './weddings.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Controller('weddings/:weddingId/members')
@UseGuards(JwtAuthGuard, WeddingTenantGuard)
export class WeddingMembersController {
  constructor(private readonly weddingsService: WeddingsService) {}

  @Get()
  listMembers(@Param('weddingId') weddingId: string) {
    return this.weddingsService.listMembers(weddingId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE)
  inviteMember(
    @Param('weddingId') weddingId: string,
    @Req() req: RequestWithUser,
    @Body() dto: InviteMemberDto,
  ) {
    return this.weddingsService.inviteMember(weddingId, req.user.userId, dto);
  }

  @Patch(':memberId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE)
  updateRole(
    @Param('weddingId') weddingId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.weddingsService.updateMemberRole(weddingId, memberId, dto);
  }

  @Delete(':memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COUPLE)
  removeMember(
    @Param('weddingId') weddingId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.weddingsService.removeMember(weddingId, memberId);
  }
}
