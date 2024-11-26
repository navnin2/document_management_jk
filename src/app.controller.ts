import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './config/decorater/public.decorater';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }
}
