import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config.service';

@Injectable()
export class MinioConfig {
  private readonly endPoint: string;
  private readonly port: number;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly bucket: string;

  constructor(configService: ConfigService) {
    this.endPoint = configService.getString('MINIO_ENDPOINT');
    this.port = configService.getNumber('MINIO_PORT');
    this.accessKey = configService.getString('MINIO_ROOT_USER');
    this.secretKey = configService.getString('MINIO_ROOT_PASSWORD');
    this.bucket = configService.getString('MINIO_BUCKET');
  }

  create() {
    return {
      endPoint: this.endPoint,
      port: this.port,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      useSSL: false,
    };
  }

  getBucketName() {
    return this.bucket;
  }

  getUrl() {
    return this.endPoint;
  }
}
