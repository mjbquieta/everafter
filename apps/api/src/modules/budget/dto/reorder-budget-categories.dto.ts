import { IsArray, IsString } from 'class-validator';

export class ReorderBudgetCategoriesDto {
  @IsArray()
  @IsString({ each: true })
  categoryIds!: string[];
}
