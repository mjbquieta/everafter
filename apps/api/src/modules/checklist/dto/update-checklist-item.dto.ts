import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ChecklistPriority } from '@everafter/types';

export class UpdateChecklistItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  dueDate?: string | null;

  @IsOptional()
  @IsEnum(ChecklistPriority)
  priority?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  assignedTo?: string | null;
}
