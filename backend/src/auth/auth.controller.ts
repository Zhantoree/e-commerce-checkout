import { CreateUserDto, LoginUserDto } from '@/user/dto/create-user.dto';
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { refreshAliveTimeMs, TokenService } from './token/token.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('register')
  async register(
    @Body() body: CreateUserDto,
    @Req() _: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(body);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: refreshAliveTimeMs,
      path: '/auth',
    });

    return { accessToken };
  }

  @Post('/login')
  async login(
    @Body() body: LoginUserDto,
    @Req() _: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(body);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: refreshAliveTimeMs,
      path: '/auth',
    });

    return { accessToken, refreshToken };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawToken = req.cookies['refresh_token'];

    const { accessToken, refreshToken } =
      await this.tokenService.rotateRefreshToken(rawToken);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: refreshAliveTimeMs,
      path: '/',
    });

    return accessToken;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawToken = req.cookies['refresh_token'];
    await this.authService.logout(rawToken);

    res.clearCookie('refresh_token', { path: '/auth' });
    return { success: true };
  }
}
