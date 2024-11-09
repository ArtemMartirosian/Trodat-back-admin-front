import {CategoryType} from "./Category.type";

export type ProductType = {
  _id: string;
  product1cId: string;
  article: string,
  name: string;
  description: string;
  description1c: string;
  color: string[];
  equipment: string[];
  category: CategoryType;
  size: string;
  frame: string;
  geometry: string;
  is_active: boolean;
  __v: number;
};