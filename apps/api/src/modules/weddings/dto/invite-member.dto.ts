import { IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '@everafter/types';

export class InviteMemberDto {
  @IsEmail()
  email!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
