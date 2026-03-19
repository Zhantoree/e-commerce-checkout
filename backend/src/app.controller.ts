import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
@Controller('cats')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getCats() {
    return this.appService.getHello();
  }
}
