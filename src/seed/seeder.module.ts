import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederService } from './seeder.service';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Role, User])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
