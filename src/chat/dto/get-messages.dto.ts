import { IsNumber, IsOptional } from 'class-validator';

export class GetMessagesDto {
  @IsNumber()
  chatId: number;

  @IsOptional()
  @IsNumber()
  cursor?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
