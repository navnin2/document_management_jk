import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';
import { Document } from '../entities/document.entity';

export class UpdateDocumentDto extends PartialType(OmitType(Document, [] as const)) { }
