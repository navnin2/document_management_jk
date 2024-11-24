import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Document } from './entities/document.entity';
import { FileUploadService } from 'src/config/aws-s3/s3.service';
import { Ingestion } from '../ingestion/entities/ingestion.entity';

@Module({
  imports: [SequelizeModule.forFeature([Document, Ingestion])],
  controllers: [DocumentsController],
  providers: [DocumentsService, FileUploadService],
})
export class DocumentsModule { }
