interface ProductInterface {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: { _id: string, categoryName: string };
  image: string;
  rating?: number;
  countInStock: number;
  brand: string;
  user: string;
  createdAt: Date;
updatedAt:Date
}
export type { ProductInterface }
