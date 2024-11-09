import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Orders extends Document {
  @Prop({
    type: [{ id: String, count: Number }],
  })
  products: { id: string; count: number }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop()
  customerName: string;
  @Prop({
    type: String,
    enum: ['В ожидании', 'Отправлен', 'Доставлен', 'Отменен'],
    default: 'pending',
  })
  status: string;

  @Prop()
  customerEmail: string;

  @Prop()
  customerPhone: string;

  @Prop()
  customerLastName: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
