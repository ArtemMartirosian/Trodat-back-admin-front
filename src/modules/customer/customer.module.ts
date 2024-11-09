// customer.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './customer.schema';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
    MulterModule.register({
      dest: './uploads/customers', // Define the folder to store uploaded images
    }),
    ConfigModule,
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService], // Export CustomerService if it's needed in other modules
})
export class CustomerModule {}
