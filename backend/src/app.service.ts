import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  private prisma: PrismaClient;

  constructor(private config: ConfigService) {
    const connectionString = config.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('No db url');
    }
    const adapter = new PrismaPg({ connectionString });
    this.prisma = new PrismaClient({ adapter });
  }
  async getHello() {
    console.log(process.env.DATABASE_URL);
    const users = this.prisma.user;

    const foundUsers = await users.update({
      where: {
        id: 1,
      },
      data: {
        email: 'no@gmail.com',
      },
    });
    console.log('foundUsers', foundUsers);
    // const products = await this.prisma.product.findMany();
    // console.log('products', products);
    console.log('DB connected');

    return 'Hello World!';
  }
}
