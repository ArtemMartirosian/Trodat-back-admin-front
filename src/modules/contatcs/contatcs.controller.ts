import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { Contacts } from './schemas/contatcs.schema';
import { ContactsService } from './contatcs.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async getContacts(): Promise<Contacts> {
    return this.contactsService.getContacts();
  }

  @Post()
  async createOrUpdateContacts(
    @Body() createContactsDto: Partial<Contacts>,
  ): Promise<Contacts> {
    return this.contactsService.createOrUpdateContacts(createContactsDto);
  }

  @Delete()
  async deleteContacts(): Promise<void> {
    return this.contactsService.deleteContacts();
  }
}
