import { Module } from '@nestjs/common';
import { FileSchema, File } from './schemas/file.schema';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MinioClientModule } from '../minio-client/minio-client.module';
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{name: File.name, schema: FileSchema}]),
    MinioClientModule
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
