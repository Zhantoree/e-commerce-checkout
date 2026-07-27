import { PublicRoute } from '@/auth/guard/auth-jwt.guard';
import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';

@PublicRoute()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getList(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query() query,
  ) {
    const list = await this.productService.getList();
    return list;
  }

  @Post('/upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!file) {
      throw new BadRequestException('File not found');
    }

    return await this.productService.uploadImage(file);
  }
}
