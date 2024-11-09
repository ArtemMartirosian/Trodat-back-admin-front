import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Contacts extends Document {
  @Prop({ required: true, type: [String] })
  emails: string[];

  @Prop({ required: true, type: [String] })
  phones: string[];

  @Prop({
    required: true,
    type: [{ address: String, geolocation: String }],
  })
  addresses: { address: string; geolocation?: string }[];

  @Prop({
    type: [{ link: String, name: String }],
  })
  socialMedia: { link: string; name?: string }[];
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts);
