type adminOrdersInterface = {
    _id: string;
    cancelled: boolean;
    createdAt: Date;
    isDelivered: boolean;
    isPaid: boolean;
    paymentMethod: string;
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