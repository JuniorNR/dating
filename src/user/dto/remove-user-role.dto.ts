import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RemoveUserRoleDto {
  @ApiProperty({ example: 1, description: 'User id' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1, description: 'Role id' })
  @IsNumber()
  roleId: number;
}
