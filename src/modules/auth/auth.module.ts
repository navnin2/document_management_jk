import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { CachingModule } from 'src/config/caching/caching.module';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoginLog } from './entities/login-log.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([LoginLog, Role]),
    ConfigModule,
    UserModule,
    CachingModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
  ],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }