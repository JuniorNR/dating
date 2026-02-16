import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.roleService.findOneByType('user');

    if (role === null) {
      throw new HttpException('Role user is not defined', HttpStatus.NOT_FOUND);
    }

    const newUser = this.prisma.user.create({
      data: {
        ...createUserDto,
        roles: {
          connect: {
            id: role.id,
          },
        },
      },
      include: {
        announcements: true,
        roles: true,
      },
    });
    return newUser;
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        announcements: true,
        roles: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      include: { roles: true, announcements: true },
    });
  }

  findOneByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username },
      include: { roles: true },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
      include: { roles: true },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return updatedUser;
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
