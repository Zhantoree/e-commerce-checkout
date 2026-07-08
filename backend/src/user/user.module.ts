import { PrismaProvider } from '@/provider/prisma.provider';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaProvider],
})
export class UserModule {}
