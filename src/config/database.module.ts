import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

const logger: Logger = new Logger('QueryLog');

/**
 * configeration of the database
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        autoLoadModels: true, //load the model each time
        logging: (sql: string) =>
          process.env.DATABASE_LOGGING === 'Y' ? logger.log(sql) : false, // make true when we need to see the SQL query while buildinga and calling API
        synchronize: true, // Be cautious about using synchronize in production
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}