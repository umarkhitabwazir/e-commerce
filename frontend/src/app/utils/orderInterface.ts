interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface OrderInterface {
  _id: string;
  products: OrderProduct[];
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
}
