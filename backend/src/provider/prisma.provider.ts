import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaProvider
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ConfigService) {
    const connectionString = config.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('No db url');
    }
    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }
  async onModuleDestroy() {
    await this.$disconnect();
    throw new Error('Method not implemented.');
  }
  async onModuleInit() {
    await this.$connect();
  }
}
