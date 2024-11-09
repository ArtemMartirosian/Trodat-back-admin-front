import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contacts, ContactsSchema } from './schemas/contatcs.schema';
import { ContactsController } from './contatcs.controller';
import { ContactsService } from './contatcs.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contacts.name, schema: ContactsSchema },
    ]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
