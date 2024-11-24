import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { UserModule } from './modules/user/user.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { RoleModule } from './modules/role/role.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { LocalAuthModule } from './modules/auth/localAuth/localAuth.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt/jwt-auth.guard';
import { RolesGuard } from './modules/auth/roles.guard';
import { SeederModule } from './seed/seeder.module';
import { SeederService } from './seed/seeder.service';

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
    LocalAuthModule,
    AuthModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ]
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seederService: SeederService) {}

  async onApplicationBootstrap() {
    await this.seederService.seedRoles();
  }
}
