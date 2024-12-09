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
    //update teh status that recived from python code to our db
    //it can be any data i just mention the status only based on the requrement it can be changed
    const [affectedCount, updatedRole] = await this.ingestionModel.update(body, { where: { uid: data.uid }, returning: true });
    if (!affectedCount) {
      throw new HttpException('ingestion not found', 404);
    }
  }
}
