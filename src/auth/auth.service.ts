import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

type UserWithRoles = Prisma.UserGetPayload<{ include: { roles: true } }>;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.validateLoginUser(loginUserDto);

    return await this.generateAuthToken(user);
  }

  async registration(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const newUser = await this.validateRegistrationUser(createUserDto);
    return await this.generateAuthToken(newUser);
  }

  private async generateAuthToken(
    user: UserWithRoles,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  private async validateLoginUser(toValidateUser: LoginUserDto) {
    const user = await this.userService.findOneByUsername(
      toValidateUser.username,
    );

    if (!user) {
      throw new NotFoundException('Username or password is incorrect');
    }

    const passwordEquals = await bcrypt.compare(
      toValidateUser.password,
      user.password,
    );

    if (!passwordEquals) {
      throw new NotFoundException('Username or password is incorrect');
    }

    return user;
  }

  private async validateRegistrationUser(toValidateUser: CreateUserDto) {
    const checkByUsername = await this.userService.findOneByUsername(
      toValidateUser.username,
    );
    if (checkByUsername !== null) {
      throw new BadRequestException('Username already exists');
    }
    const checkByEmail = await this.userService.findOneByEmail(
      toValidateUser.email,
    );
    if (checkByEmail !== null) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(toValidateUser.password, 10);

    const newUser = await this.userService.create({
      ...toValidateUser,
      password: hashedPassword,
    });

    return newUser;
  }
}
