export interface IProduct {
  product1cId: string;
  article: string;
  name: string;
  description: string;
  description1c: string;
  color: string[];
  equipment: string[];
  category: string | null;
  size?: string;
  frame?: string;
  geometry?: string;
  is_active?: boolean;
  price?: number;
  oneCimages: string[]; // Add this line for slider images
}
