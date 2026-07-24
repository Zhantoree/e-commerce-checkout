import { AuthModule } from '@/auth/auth.module';
import { StorageModule } from '@/storage/storage.module';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [StorageModule, AuthModule],
})
export class ProductModule {}
