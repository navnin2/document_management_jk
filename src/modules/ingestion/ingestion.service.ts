import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Ingestion } from './entities/ingestion.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class IngestionService {
  constructor(@InjectModel(Ingestion) private readonly ingestionModel: typeof Ingestion) { }

  //function that update the status of the ingestion uisng the data passed to the python
  async handleIngestion(data): Promise<any> {
    const body = {
      status: data.status
    }
    const [affectedCount, updatedRole] = await this.ingestionModel.update(body, { where: { uid: data.uid }, returning: true });
    if (!affectedCount) {
      throw new HttpException('Banner not found', 404);
    }
  }
}
