import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtOptions } from './constants/auth.constants';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule.register(jwtOptions), UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
