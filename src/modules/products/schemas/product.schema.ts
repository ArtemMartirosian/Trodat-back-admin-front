import { IProduct } from '../interfaces/products.interface';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Product implements IProduct {
  @Prop({ required: true })
  product1cId: string;

  @Prop({ required: true })
  article: string;

  @Prop({ required: true })
  name: string;

  @Prop({})
  description: string;

  @Prop({ required: true })
  description1c: string;

  @Prop({ type: [String] })
  color: string[];
  @Prop({ type: [String] })
  oneCimages: string[];

  @Prop({ type: [String] })
  equipment: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  })
  category: string | null;

  @Prop()
  size: string;

  @Prop()
  frame: string;

  @Prop()
  geometry: string;

  // @ManyToMany(() => FileSchema)
  // @Prop()
  // images: FileSchema[];

  @Prop()
  is_active: boolean;

  @Prop({ default: null })
  image: string;

  @Prop({})
  price: number; // Added price field

  // @ManyToOne(() => CategorySchema, (category) => category.products)
  // @JoinProp({ name: 'category_id' })
  // category: CategorySchema;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
