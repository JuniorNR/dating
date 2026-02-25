import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import type { Response } from 'express';

@ApiTags('Authorization')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getCookieOptions() {
    const isProduction = process.env['NODE_ENV'] === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    } as const;
  }

  private setAuthCookie(response: Response, accessToken: string) {
    const cookieName = process.env['JWT_ACCESS_COOKIE_NAME'];

    response.cookie(String(cookieName), accessToken, {
      ...this.getCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Login your profile',
    description: 'Get access to your profile',
  })
  @ApiResponse({
    status: 201,
    description: 'Logged in',
    example: {
      accessToken: 'string',
    },
  })
  async login(
    @Body() createUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResult = await this.authService.login(createUserDto);
    this.setAuthCookie(response, authResult.accessToken);
    return authResult;
  }

  @Post('/registration')
  @ApiOperation({
    summary: 'Registration your profile',
    description: 'Get access to your profile',
  })
  @ApiResponse({
    status: 201,
    description: 'Your profile is registered',
    example: {
      accessToken: 'string',
    },
  })
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResult = await this.authService.registration(createUserDto);
    this.setAuthCookie(response, authResult.accessToken);
    return authResult;
  }

  @Post('/logout')
  @ApiOperation({
    summary: 'Logged out your profile',
    description: 'Get logged out from your profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out',
    example: {
      success: true,
    },
  })
  logout(@Res({ passthrough: true }) response: Response) {
    const cookieName = process.env['JWT_ACCESS_COOKIE_NAME'];
    response.clearCookie(String(cookieName), this.getCookieOptions());
    return { success: true };
  }
}
