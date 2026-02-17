import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RemoveUserBanDto {
  @ApiProperty({
    example: 1,
    description: 'User id',
  })
  @IsNumber()
  userId: number;
}
