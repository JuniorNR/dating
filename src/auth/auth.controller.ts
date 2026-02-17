import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Authorization')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  login(@Body() createUserDto: LoginUserDto) {
    return this.authService.login(createUserDto);
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
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }
}
