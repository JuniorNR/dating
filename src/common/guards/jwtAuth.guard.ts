import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs/internal/Observable';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtPayload, AuthenticatedRequest } from '../types/jwt.types';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    try {
      const cookieName = process.env['JWT_ACCESS_COOKIE_NAME'];
      const tokenFromCookieRaw: unknown = request.cookies[String(cookieName)];
      const tokenFromCookie =
        typeof tokenFromCookieRaw === 'string' ? tokenFromCookieRaw : undefined;

      const authHeader = request.headers.authorization;
      const bearer = authHeader?.split(' ')[0];
      const tokenFromHeader = authHeader?.split(' ')[1];

      const token =
        tokenFromCookie ?? (bearer === 'Bearer' ? tokenFromHeader : undefined);

      if (!token) {
        throw new UnauthorizedException({
          message: this.i18n.t('error.userNotAuthorized'),
        });
      }

      const user = this.jwtService.verify<JwtPayload>(token);

      request.user = user;
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException({
        message: this.i18n.t('error.userNotAuthorized'),
      });
    }
  }
}
