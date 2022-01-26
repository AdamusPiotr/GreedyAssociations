import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ExpressAdapter,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Hello';
  }

  @Post('fileUpload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    const rules = await Promise.all(this.appService.parseCsv(files));

    return rules;
  }

  @Post('system-lookup')
  @UseInterceptors(FileInterceptor('file'))
  async systemLookup(@UploadedFile() file: Express.Multer.File) {
    return this.appService.getTable(file);
  }
}
