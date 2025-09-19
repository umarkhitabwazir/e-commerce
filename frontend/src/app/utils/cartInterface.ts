export interface CartProductInterface {
  _id: string;
  title: string;
  price: number;
  image: string;
  description:string
}

export interface CartItemInterface {
  product: CartProductInterface;
  quantity: number;
  price: number;
  _id: string;
}

export interface CartDataInterface {
  _id: string;
  user: string;
  deleted:boolean;
  cartItems: CartItemInterface[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
