import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'ChiefCurry',
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  username: string;

  @ApiProperty({
    example: 'dating@mail.ru',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(5, 100)
  email: string;

  @ApiProperty({
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @Length(10, 255)
  password: string;
}
