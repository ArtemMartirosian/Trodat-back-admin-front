// import { Injectable } from '@nestjs/common';
// // import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
// import { ConfigService } from '../config.service';
//
// @Injectable()
// export class MySqlConfig implements TypeOrmOptionsFactory {
//   private readonly host: string;
//   private readonly port: number;
//   private readonly username: string;
//   private readonly password: string;
//   private readonly database: string;
//
//   constructor(configService: ConfigService) {
//     this.host = configService.getString('MYSQL_HOST');
//     this.port = configService.getNumber('MYSQL_PORT');
//     this.username = configService.getString('MYSQL_USER');
//     this.password = configService.getString('MYSQL_PASSWORD');
//     this.database = configService.getString('MYSQL_NAME');
//   }
//
//   createTypeOrmOptions(): TypeOrmModuleOptions {
//     return {
//       type: 'mysql',
//       host: this.host,
//       port: this.port,
//       username: this.username,
//       password: this.password,
//       database: this.database,
//       autoLoadEntities: true,
//       synchronize: true,
//     };
//   }
// }

export {};
