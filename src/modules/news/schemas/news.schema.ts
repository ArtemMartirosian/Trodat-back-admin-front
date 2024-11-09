import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class News {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, default: 'news' })
  type: 'news' | 'promotion';

  @Prop({ required: true, default: '' })
  shortDescription: string;

  @Prop({ required: true, default: '' })
  fullDescription: string;

  @Prop({ default: null })
  image: string;

  @Prop({ required: true, default: Date.now() })
  date: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
