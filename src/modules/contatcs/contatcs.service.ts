import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contacts } from './schemas/contatcs.schema';
@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contacts.name) private readonly contactsModel: Model<Contacts>,
  ) {}

  async getContacts(): Promise<Contacts> {
    const contacts = await this.contactsModel.findOne().exec();
    if (!contacts) {
      throw new NotFoundException('Contacts not found');
    }
    return contacts;
  }

  async createOrUpdateContacts(
    createContactsDto: Partial<Contacts>,
  ): Promise<Contacts> {
    const existingContacts = await this.contactsModel.findOne().exec();
    if (existingContacts) {
      return this.contactsModel
        .findByIdAndUpdate(existingContacts._id, createContactsDto, {
          new: true,
        })
        .exec();
    } else {
      return new this.contactsModel(createContactsDto).save();
    }
  }

  async deleteContacts(): Promise<void> {
    const result = await this.contactsModel.deleteMany().exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Contacts not found');
    }
  }
}
