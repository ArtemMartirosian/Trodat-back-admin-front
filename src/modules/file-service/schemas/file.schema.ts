import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class File {
  @Prop()
  url: string;

  // @ManyToMany(() => ProductsSchema, (product) => product.images)
  // products: ProductsSchema[];
}

export const FileSchema = SchemaFactory.createForClass(File);