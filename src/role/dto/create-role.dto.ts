import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'user',
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  name: string;

  @ApiProperty({
    example: 'user',
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  type: string;

  @ApiProperty({
    example: 'User is default role of our project',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 255)
  description: string;
}
