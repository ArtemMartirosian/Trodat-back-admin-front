import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './interfaces/file.interface';
import { MinioConfig } from '../config/configs/minio.config';
import { getFileExtension, hashFileName } from 'src/helpers/utils';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  constructor(
    private readonly minio: MinioService,
    private readonly fileConfig: MinioConfig,
  ) {
    this.logger = new Logger('MinioStorageService');
  }

  public get client() {
    return this.minio.client;
  }

  async upload(
    file: BufferedFile,
    baseBucket: string = this.fileConfig.getBucketName(),
  ) {
    try {
      const config = this.fileConfig.create();

      if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      }

      const temp_filename = Date.now().toString();
      const hashedFileName = hashFileName(temp_filename);
      const ext = getFileExtension(file.originalname);
      const metaData = {
        'Content-Type': file.mimetype,
        'X-Amz-Meta-Testing': '1234',
      };
      const filename = `${hashedFileName}${ext}`;

      await this.client.putObject(baseBucket, filename, file.buffer, metaData);

      return {
        url: `http://${config.endPoint}:${config.port}/${baseBucket}/${filename}`,
      };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(
    objectName: string,
    baseBucket: string = this.fileConfig.getBucketName(),
  ) {
    try {
      await this.client.removeObject(baseBucket, objectName);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw new HttpException(
        'Oops, something went wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createBucket() {
    const bucketName = this.fileConfig.getBucketName();
    const publicPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    this.client.bucketExists(bucketName, (exists) => {
      if (!exists) {
        this.client.makeBucket(bucketName, 'us-east-1', (err) => {
          if (err) {
            this.logger.error('Error creating bucket:', err);
          } else {
            this.logger.log('Bucket created successfully.');
            this.client.setBucketPolicy(
              bucketName,
              JSON.stringify(publicPolicy),
              (policyErr) => {
                if (policyErr) {
                  this.logger.error('Error setting bucket policy:', policyErr);
                } else {
                  this.logger.log('Bucket policy set to public.');
                }
              },
            );
          }
        });
      }
    });
  }
}
