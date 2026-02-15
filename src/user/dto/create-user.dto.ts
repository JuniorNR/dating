import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'dating@mail.ru',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234567890',
  })
  @IsString()
  @IsStrongPassword()
  password: string;
}
