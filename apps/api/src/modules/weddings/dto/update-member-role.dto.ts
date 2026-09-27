import { IsEnum } from 'class-validator';
import { UserRole } from '@everafter/types';

export class UpdateMemberRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}
