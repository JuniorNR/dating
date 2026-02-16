import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'ChiefCurry',
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  username: string;

  @ApiProperty({
    example: 'Text!1234567890',
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @Length(10, 255)
  password: string;
}
