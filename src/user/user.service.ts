import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const newUser = this.prisma.user.create({
      data: createUserDto,
    });
    return newUser;
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        announcements: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return updatedUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
