import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddUserRoleDto } from './dto/add-user-role.dto';
import { AddUserBanDto } from './dto/add-user-ban.dto';
import { RemoveUserBanDto } from './dto/remove-user-ban.dto';
import type { AuthenticatedRequest } from 'src/common/types/jwt.types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.prisma.role.findFirst({
      where: { type: 'user' },
    });

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

  findAuth(request: AuthenticatedRequest) {
    return this.prisma.user.findFirst({
      where: { id: request.user.sub },
      include: { roles: true, announcements: true },
      omit: { password: true },
    });
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

  async addRole(addUserRoleDto: AddUserRoleDto) {
    const foundRole = await this.prisma.role.findFirst({
      where: {
        id: addUserRoleDto.roleId,
      },
    });

    if (!foundRole) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.user.update({
      where: { id: addUserRoleDto.userId },
      data: {
        roles: {
          connect: { id: addUserRoleDto.roleId },
        },
      },
      include: {
        roles: true,
        announcements: true,
      },
    });
  }

  async removeRole(addUserRoleDto: AddUserRoleDto) {
    return this.prisma.user.update({
      where: { id: addUserRoleDto.userId },
      data: {
        roles: {
          disconnect: { id: addUserRoleDto.roleId },
        },
      },
      include: {
        roles: true,
        announcements: true,
      },
    });
  }

  async addBan(addUserBanDto: AddUserBanDto) {
    return await this.prisma.user.update({
      where: { id: addUserBanDto.userId },
      data: {
        banned: true,
        banReason: addUserBanDto.reason,
      },
    });
  }

  async removeBan(removeUserBanDto: RemoveUserBanDto) {
    return await this.prisma.user.update({
      where: { id: removeUserBanDto.userId },
      data: {
        banned: false,
        banReason: null,
      },
    });
  }
}
