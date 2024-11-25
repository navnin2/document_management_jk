import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederService } from './seeder.service';
import { Role } from 'src/modules/role/entities/role.entity';

@Module({
  imports: [SequelizeModule.forFeature([Role])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}