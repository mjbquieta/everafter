import { IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  userId!: string;

  @IsString()
  type!: string;

  @IsString()
  title!: string;

  @IsString()
  message!: string;
}
