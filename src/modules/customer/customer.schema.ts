import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';

@Schema()
export class Customer {
  @Prop()
  email: string;

  @Exclude() // Exclude password from the response
  @Prop()
  password: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;
  @Prop()
  patronymic: string;

  @Prop()
  phone: string;

  @Prop()
  imageUrl?: string; // Optional property to store the image URL or filename
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
