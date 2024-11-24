import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IngestionService } from './ingestion.service';

@Controller()
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  //microservice will listen to Ingestion_Management and upate the status of the ingestion
  @MessagePattern('Ingestion_Management')
  async handleIngestion(data: any) {
    return this.ingestionService.handleIngestion(data);
  }
}
