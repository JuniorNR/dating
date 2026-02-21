import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  chatId: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
