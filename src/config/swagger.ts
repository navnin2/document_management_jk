import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * swagger setup to config the api documentation
 * @param app 
 */
export const setupSwagger = (app: INestApplication) => {

  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME'))
    .setVersion(configService.get('VERSION'))
    .setDescription(`The Document Management for JK tech API description. Version: ${configService.get('VERSION')}
    `)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api-documentation', app, document, {
    useGlobalPrefix: false,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });


}