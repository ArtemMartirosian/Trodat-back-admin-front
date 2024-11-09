import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config.service';

@Injectable()
export class AppConfig {
  public readonly name: string;
  public readonly port: number;
  public readonly isProduction: boolean;
  public readonly parse_url: string;

  constructor(configService: ConfigService) {
    this.name = configService.getString('APP_NAME');
    this.port = configService.getNumber('APP_PORT');
    this.isProduction = configService.getBoolean('APP_PRODUCTION');
    this.parse_url = configService.getString('APP_PARSE_URL');
  }

  public get now(): Date {
    return new Date();
  }
}
