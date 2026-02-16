import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
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
