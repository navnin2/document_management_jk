import { Controller, Get, Post, Body, Param, Delete, Query, Put, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PaginationDto } from 'src/config/condition.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileUploadService } from 'src/config/aws-s3/s3.service';
import { diskStorage } from 'multer';

@Controller('documents')
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService, private readonly s3service: FileUploadService) { }

  /**
   * post apii call to uplaod the doc to s3 and store to our databse
   * @param file 
   * @param body 
   * @returns 
   */
  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  @ApiConsumes('application/json', 'multipart/form-data')
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: CreateDocumentDto) {
    const imageData = await this.s3service.upload(file, 'banners');
    if (!imageData) {
      throw new HttpException('image upload failed', HttpStatus.BAD_REQUEST);
    }
    return await this.documentsService.create(body, imageData)
  }

  /**
   * find all docs 
   * @param query 
   * @returns 
   */
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.documentsService.findAll(query);
  }

  /**
   * get each doc details using uid
   * @param uid 
   * @returns 
   */
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.documentsService.findOne(uid);
  }

  /**
   * update the doc details
   * @param uid 
   * @param updateDocumentDto 
   * @returns 
   */
  @Put(':uid')
  update(@Param('uid') uid: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(uid, updateDocumentDto);
  }

  /**
   * delete the doc from db
   * @param uid 
   * @returns 
   */
  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.documentsService.remove(uid);
  }
}
