import { Body, Controller, Get, Post } from '@nestjs/common';
import { FileService } from './file.service';
import { downloadImagesByUrl } from 'src/helpers/utils';
import path from 'path';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  async upload(@Body() data) {
    const images_meta = await downloadImagesByUrl(data.urls);

    return await this.fileService.uploadMany(images_meta);
  }

  @Get('front')
  async front() {
    return path.resolve();
  }
}
