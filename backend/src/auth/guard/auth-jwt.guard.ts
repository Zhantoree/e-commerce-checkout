import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../token/token.service';

export const PublicRoute = Reflector.createDecorator<boolean | void>({
  transform: (value) => value ?? true,
});

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: TokenService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(PublicRoute, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwt.verifyRefreshToken(token);
      request.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
