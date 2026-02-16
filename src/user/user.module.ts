import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleService } from 'src/role/role.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, RoleService],
})
export class UserModule {}
