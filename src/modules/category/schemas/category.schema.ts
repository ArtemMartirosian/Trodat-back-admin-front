import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class Category {
  @Prop({required: true, type: String})
  name: string;

  @Prop({required: false, default: null})
  category1cId: string | null;

  @Prop({required: true, default: true})
  isPublic: boolean;

  // @OneToMany(() => ProductsSchema, (product) => product.category)
  // products: ProductsSchema[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
