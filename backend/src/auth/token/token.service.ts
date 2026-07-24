import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as crypto from 'crypto';

export const refreshAliveTimeMs = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class TokenService {
  constructor(
    private jwt: JwtService,
    private db: PrismaService,
    private config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanExpiredRefreshTokens() {
    const result = await this.db.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    console.log(`Cleaned ${result.count} expired refresh tokens`);
  }

  hashToken(rawToken: string): string {
    return crypto
      .createHmac('sha256', this.config.get('HMAC_TOKEN_SECRET')!)
      .update(rawToken)
      .digest('hex');
  }

  async verifyRefreshToken(rawToken: string) {
    return this.jwt.verifyAsync(rawToken);
  }

  generateAccessToken(userId: number, email: string) {
    return this.jwt.sign(
      { sub: userId, email },
      {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const rawToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    await this.db.refreshToken.create({
      data: {
        tokenHash,
        userId: userId,
        expiresAt: new Date(Date.now() + refreshAliveTimeMs),
      },
    });
    return rawToken;
  }

  async rotateRefreshToken(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);

    const token = await this.db.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (!token || token.expiresAt < new Date() || token.revoked) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.db.refreshToken.delete({ where: { id: token.id } });

    const accessToken = this.generateAccessToken(
      token.userId,
      token.user.email,
    );

    const refreshToken = await this.generateRefreshToken(token.userId);

    return { accessToken, refreshToken };
  }
}
