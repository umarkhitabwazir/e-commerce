interface ProductTypes {
    _id: string;
  title: string;
  price: number;
  description: string;
  category: string;  
  image: string;
  rating?: number;  
  countInStock: number;
  brand: string;
  user: string;
}
export type { ProductTypes }
