import { Module } from '@nestjs/common';
import { CategoryModule } from './modules/category/category.module';
import { UsersModule } from './modules/users/users.module';
import { MongoConfig } from './modules/config/configs';
import { ConfigModule } from './modules/config/config.module';
import { ConfigService } from './modules/config/config.service';
import { ProductsModule } from './modules/products/products.module';
import { MinioClientModule } from './modules/minio-client/minio-client.module';
import { FileModule } from './modules/file-service/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsModule } from './modules/news/news.module';
import { MulterModule } from '@nestjs/platform-express';
import { CustomerModule } from './modules/customer/customer.module';
import { ContactsModule } from './modules/contatcs/contatcs.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: MongoConfig,
    }),
    CategoryModule,
    UsersModule,
    CustomerModule,
    ProductsModule,
    ContactsModule,
    OrdersModule,
    NewsModule,
    MinioClientModule,
    FileModule,
    HttpModule,
    MulterModule.register({ dest: '/uploads' }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '/frontend/build'),
    //   exclude: ['/api*'],
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/customers'),
      serveRoot: '/uploads/customers', // Optional: custom URL to access files
    }),
  ],
})
export class AppModule {}
