import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddUserBanDto {
  @ApiProperty({
    example: 1,
    description: 'User id',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'Account blocking due to Statement #14',
    description: 'Ban or unban user on this project',
  })
  @IsString()
  reason: string;
}
