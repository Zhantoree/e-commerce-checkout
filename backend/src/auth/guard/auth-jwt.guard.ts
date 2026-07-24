import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: TokenService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split(' ')[1];
    console.log('token', token);

    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwt.verifyRefreshToken(token);
    console.log('payload', payload);
    request.user = payload;
    return true;
  }
}
