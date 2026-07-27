import { StorageModule } from '@/storage/storage.module';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [StorageModule],
})
export class ProductModule {}
