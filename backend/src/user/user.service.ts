import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}
  async getUser({ email }) {
    return await this.db.user.findUnique({
      where: {
        email,
      },
    });
  }
  create(createUserDto: CreateUserDto) {}
}
