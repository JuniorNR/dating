import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtOptions: JwtModuleOptions = {
  global: true,
  secret: process.env.JWT_SECRET || 'SECRET',
  signOptions: { expiresIn: '24h' },
};
