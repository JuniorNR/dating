import { IsNumber } from 'class-validator';

export class TypingMessageDto {
  @IsNumber()
  chatId: number;
}
