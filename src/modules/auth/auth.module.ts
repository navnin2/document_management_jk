import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { CachingModule } from 'src/config/caching/caching.module';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoginLog } from './entities/login-log.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([LoginLog]),
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
