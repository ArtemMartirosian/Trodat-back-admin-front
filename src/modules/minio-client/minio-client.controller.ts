import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from './interfaces/file.interface';

@Controller('minio-client')
export class MinioClientController {
  constructor(private readonly minioClientService: MinioClientService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(@UploadedFile() image: BufferedFile) {
    return await this.minioClientService.upload(image);
  }
}
