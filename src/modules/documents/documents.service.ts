import { HttpException, Injectable } from '@nestjs/common';
import { Document } from './entities/document.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Ingestion } from '../ingestion/entities/ingestion.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document) private readonly documentModel: typeof Document,
    @InjectModel(Ingestion) private readonly ingestionModel: typeof Ingestion
  ) { }
  async create(body, imageData): Promise<Document> {
    let ingestion;
    const payload = {
      image: imageData.Location,
      ...body
    };
    // uploaded the document and stor ein the db
    const data = await this.documentModel.create(payload);
    try {
      //creating the ingestion to manage the status
      ingestion = await this.ingestionModel.create({
        name: data.name,
        doc_url: data.doc_url
      });
    } catch (err) {
      console.log(err)
      return err
    }
    try {
      // Make a POST request to the Python backend using fetch
      const response = await fetch(process.env.PYTHON_URL, {
        method: 'POST',  // POST request to trigger ingestion
        headers: {
          'Content-Type': 'application/json',  // Content-Type header for JSON
        },
        //the doc_url has been passed to the python script
        body: JSON.stringify({
          name: data.name,
          doc_url: data.doc_url,
          uid: ingestion.uid
        }),  // You can send any necessary data here
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to trigger ingestion process: ${response.statusText}`);
      }

    } catch (err) {
      return err
    }
    return data;

  }


  async findAll(query): Promise<object> {
    const data = await this.documentModel.findAndCountAll({
      limit: query.limit ? query.limit : -1,
      offset: query.offset ? query.offset : 0,
      order: query.sort ? query.sort : [['createdAt', 'desc']]
    });

    return data
  }


  async findOne(uid: string): Promise<Document> {
    const data = await this.documentModel.findOne({
      where: {
        uid: uid
      }
    })
    return data
  }

  async update(uid, body): Promise<Document[]> {
    const [affectedCount, updatedRole] = await this.documentModel.update(body, { where: { uid }, returning: true });
    if (!affectedCount) {
      throw new HttpException('Banner not found', 404);
    }
    return updatedRole
  }

  async remove(uid: string): Promise<number> {
    const deletedRowsCount = await this.documentModel.destroy({ where: { uid }, });
    return deletedRowsCount;
  }
}
