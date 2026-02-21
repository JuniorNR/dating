import { IsArray, IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @IsNumber({}, { each: true })
  memberIds: number[];
}
