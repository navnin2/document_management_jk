import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { setupSwagger } from './config/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalResponseInterceptor } from './config/globel.intesepter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const env = process.env.NODE_ENV || 'dev';
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  if (env !== 'prod') {
    /* Morgan logger in non-production env */
    app.use(morgan('tiny'));
    /* Swagger documentation */
    /* Only available in non-production env */
    setupSwagger(app)
  }
  await app.listen(configService.get('PORT'));
  //check the swagger url in log 
  Logger.log(
    `Server running on http://localhost:${configService.get('PORT')}/api-documentation in ${configService.get('VERSION')} mode`,
    'Bootstrap',
  );
}
bootstrap();
