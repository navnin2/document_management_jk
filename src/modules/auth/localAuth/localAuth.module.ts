import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthModule } from '../auth.module';
import { LocalAuthService } from './localAuth.service';
import { LocalAuthController } from './localAuth.controler';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/modules/user/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([User]), AuthModule],
  providers: [LocalAuthService, LocalStrategy],
  controllers: [LocalAuthController],
})
export class LocalAuthModule {}