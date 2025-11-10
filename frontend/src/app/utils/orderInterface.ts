export interface OrderProduct {
  productId: {
    _id:string;
  title:string,
  image:string,
  price:number,
      user?:{
        username:string,
        email:string
    }
},
  quantity: number;
}

export interface OrderInterface {
  _id: string;
  products: OrderProduct[];
  userId?: { username: string; email: string },
  paymentMethod?:string,
  isDelivered: boolean;
  isPaid: boolean;
  totalPrice: number;
  taxPrice: number;
  shippingPrice: number;
  orderPending: boolean;
  orderShipped: boolean;
  pickedByCounter: boolean;
  readyForPickup: boolean;
  confirmed: boolean;
  cancelled: boolean;
  createdAt: Date;
  updatedAt: Date;
  
}
