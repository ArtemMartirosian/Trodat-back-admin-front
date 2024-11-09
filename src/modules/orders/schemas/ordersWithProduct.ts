// src/orders/types/order-with-product-details.type.ts
import { Document } from 'mongoose';
import { Product } from '../../products/schemas/product.schema'; // Assuming Product schema exists

export interface OrderWithProductDetails extends Document {
  products: Array<Product & { count: number }>;
  totalPrice: number;
}
