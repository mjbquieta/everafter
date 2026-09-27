import { IsString } from 'class-validator';

export class AddClientDto {
  @IsString()
  weddingId!: string;
}
