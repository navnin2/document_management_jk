import { Controller, Get, Post, Body, Param, Delete, Query, Put, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PaginationDto } from 'src/config/condition.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { FileUploadService } from 'src/config/aws-s3/s3.service';
import { diskStorage } from 'multer';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService, private readonly s3service: FileUploadService) { }

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

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.documentsService.findAll(query);
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.documentsService.findOne(uid);
  }

  @Put(':uid')
  update(@Param('uid') uid: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(uid, updateDocumentDto);
  }

  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.documentsService.remove(uid);
  }
}
