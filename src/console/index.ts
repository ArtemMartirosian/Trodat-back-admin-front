import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { User } from '../modules/users/schemas/user.schema';
import { SuperAdminConfig } from '../modules/config/configs';
import { MinioClientService } from '../modules/minio-client/minio-client.service';

async function run() {
  const command = process.argv[2];
  const logger = new Logger('RunCommand');

  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get<UsersService>(UsersService);
  const minioClient = app.get<MinioClientService>(MinioClientService);

  switch (command) {
    case 'init':
      const adminProps = app.get<Partial<User>>(SuperAdminConfig);

      await userService.create({
        email: adminProps.email,
        password: adminProps.password,
        role: adminProps.role,
      });

      await minioClient.createBucket();

      logger.log('Command init was run');
      await app.close();
      return;
    default:
      logger.error('Command not found');
      await app.close();
  }
}

run();
