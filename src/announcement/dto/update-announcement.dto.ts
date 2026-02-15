import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAnnouncementDto {
  @ApiProperty({
    example: 'I want to find a woman',
  })
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Im 20 y.o. and i have a nice car',
  })
  @IsString()
  content?: string;
}
