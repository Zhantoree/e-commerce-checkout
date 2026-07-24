import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  private prisma: PrismaClient;

  constructor(private config: ConfigService) {
    const connectionString = config.getOrThrow<string>('DATABASE_URL');

    const adapter = new PrismaPg({ connectionString });
    this.prisma = new PrismaClient({ adapter });
  }
  async getHello() {}
}
