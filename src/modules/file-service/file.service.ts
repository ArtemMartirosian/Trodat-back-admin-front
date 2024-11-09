import {Injectable} from '@nestjs/common';
import {MinioClientService} from '../minio-client/minio-client.service';
import {BufferedFile} from '../minio-client/interfaces/file.interface';
import {File} from './schemas/file.schema';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    private minioService: MinioClientService,
  ) {}

  async create(file_url: string) {
    const file = new this.fileModel({
      url: file_url,
    });
    return await file.save();
  }

  async uploadMany(files: BufferedFile[]): Promise<File[]> {
    const file_entities = [];

    for (const file of files) {
      const entity = await this.upload(file);
      file_entities.push(entity);
    }

    return file_entities;
  }

  async upload(file: BufferedFile) {
    const { url } = await this.minioService.upload(file);
    return await this.create(url);
  }
}
