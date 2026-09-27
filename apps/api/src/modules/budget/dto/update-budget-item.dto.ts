import { IsString, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';
import { PaymentStatus } from '@everafter/types';

export class UpdateBudgetItemDto {
  @IsOptional()
  @IsString()
  vendorName?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  actualCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  dueDate?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
