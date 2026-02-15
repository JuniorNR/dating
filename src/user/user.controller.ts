import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: 'Create one new user',
  })
  @ApiResponse({
    status: 200,
    description: 'User is created',
    type: UserEntity,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all',
    description: 'Get all users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserEntity],
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one user by id',
    description: 'Get one user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'One user',
    type: UserEntity,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update one user by id',
    description: 'Update one user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Updated one user',
    type: UserEntity,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete one user by id',
    description: 'Delete one user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted one user',
    type: UserEntity,
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
