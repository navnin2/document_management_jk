import { OmitType } from "@nestjs/mapped-types";
import { Document } from "../entities/document.entity";

export class CreateDocumentDto extends OmitType(Document, [] as const)  {}
