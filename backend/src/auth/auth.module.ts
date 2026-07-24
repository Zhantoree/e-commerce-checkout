import { UserModule } from '@/user/user.module';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token/token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    UserModule,
  ],
  exports: [TokenService],
  controllers: [AuthController],
  providers: [UserService, TokenService, AuthService],
})
export class AuthModule {}
