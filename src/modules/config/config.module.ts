import { Module } from '@nestjs/common';
import * as NestConfig from '@nestjs/config';
import { ConfigService } from './config.service';
import {
  AppConfig,
  MinioConfig,
  SuperAdminConfig,
  MongoConfig,
} from './configs';

@Module({
  imports: [
    NestConfig.ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  providers: [
    NestConfig.ConfigService,
    ConfigService,
    AppConfig,
    SuperAdminConfig,
    MinioConfig,
    MongoConfig,
  ],
  exports: [
    AppConfig,
    SuperAdminConfig,
    ConfigService,
    MinioConfig,
    MongoConfig,
  ],
})
export class ConfigModule {}
