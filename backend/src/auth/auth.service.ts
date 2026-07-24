import { PrismaService } from '@/prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private tokenService: TokenService,
  ) {}

  async register({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existing = await this.db.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passHash = await bcrypt.hash(password, 12);

    const user = await this.db.user.create({
      data: { email, password: passHash, firstName, lastName },
    });

    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.email,
    );
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async loginUser({ email, password }) {
    const user = await this.db.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // remove expired tokens of user
    await this.db.refreshToken.deleteMany({
      where: {
        userId: user.id,
        expiresAt: { lt: new Date() },
      },
    });

    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.email,
    );
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async logout(rawRefreshToken: string) {
    const tokenHash = this.tokenService.hashToken(rawRefreshToken);

    await this.db.refreshToken.deleteMany({
      where: { tokenHash },
    });
  }
}
