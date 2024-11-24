import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ingestion } from './entities/ingestion.entity';

@Module({
  imports:[SequelizeModule.forFeature([Ingestion])],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
