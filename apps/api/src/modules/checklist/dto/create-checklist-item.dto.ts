import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ChecklistPriority } from '@everafter/types';

export class CreateChecklistItemDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(ChecklistPriority)
  priority?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}
