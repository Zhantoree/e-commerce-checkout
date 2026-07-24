import { PrismaService } from '@/prisma/prisma.service';
import { StorageService } from '@/storage/storage.service';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class ProductService {
  constructor(
    private storage: StorageService,
    private db: PrismaService,
  ) {}

  async getList() {
    return await this.db.product.findMany();
  }

  async uploadImage(file: Express.Multer.File) {
    const extension = extname(file.originalname);
    const key = `products/${randomUUID()}${extension}`;
    await this.storage.upload(key, file.buffer, file.mimetype);

    return {
      key,
      url: this.storage.getPublicUrl(key),
    };
  }
}
