import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { UserModule } from './modules/user/user.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { RoleModule } from './modules/role/role.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { APP_GUARD } from '@nestjs/core';
import { SeederModule } from './seed/seeder.module';
import { SeederService } from './seed/seeder.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './modules/role/entities/role.entity';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { LoginLog } from './modules/auth/entity/loginlog.entity';
import { User } from './modules/user/entities/user.entity';
import { RolesGuard } from './modules/auth/role.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    DocumentsModule,
    RoleModule,
    IngestionModule,
    SeederModule,
    AuthModule,
    SequelizeModule.forFeature([LoginLog, User, Role]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seederService: SeederService) {}

  async onApplicationBootstrap() {
    await this.seederService.seedRoles();
    await this.seederService.seedUser();
  }
}
