type adminOrdersInterface = {
    _id: string;
    cancelled: boolean;
    createdAt: Date;
    isDelivered: boolean;
    isPaid: boolean;
    paymentMethod: string;
      paymentData:{
   paymentPlatform:string,
    accountUsername:string,
    accountNumber:string,
    userId:string,
  },
    transactionId:string,
    refund:boolean
    products: [{
        productId: {
            image: string;
            title: string;
            price: number;
            _id: string;

        };
        quantity: number;
        _id: string;

    }];
    address: {
           _id: string,
      fullName: string,
      user: string,
      Province: string,
      City: string,
      phone:number,
      Building: number,
      HouseNo: number,
      Floor: number,
      Street: string,
    }
    ;
    shippingPrice: number;
    taxPrice: number;
    orderPending: boolean;
    orderShipped: boolean;
    pickedByCounter: boolean;
    readyForPickup: boolean;
    confirmed: boolean;
    totalPrice: number;
    userId: {
        email: string;
        phone: string
        username: string
    }
}

export default adminOrdersInterface