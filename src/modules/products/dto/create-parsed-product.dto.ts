import { File } from 'src/modules/file-service/schemas/file.schema';

export class CreateParsedProductDto {
  product_id: string;
  name: string;
  images: File[];
  is_active?: boolean;
}