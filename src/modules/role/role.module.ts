import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { LoginLog } from '../auth/entity/loginlog.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Role, LoginLog, User])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
