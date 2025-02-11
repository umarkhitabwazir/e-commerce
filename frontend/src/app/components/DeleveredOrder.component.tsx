import React from 'react'
import Image from 'next/image';
type Product = {
  _id: string;
  title: string;
  price: number;
  image: string;
};

type Order = {
  _id: string;
  products: { productId: string; quantity: number }[];
  isDelivered: boolean;
  isPaid: boolean;
  totalPrice: number;
  taxPrice: number;
  shippingPrice: number;
  cancelled: boolean;
  createdAt: Date;
};


const DeleveredOrderComponent : React.FC<{ deleveredOders: Order[]; products: Product[] }> = ({
    deleveredOders,
    products
}:{
    deleveredOders:Order[],
    products: Product[]
}
) => {
  return (
    deleveredOders.map((order) => {
        const orderDate = new Date(order.createdAt);

        return (
          <div
            key={order._id}
            className="mb-8 p-6 border rounded-xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Order #{order._id.slice(-6).toUpperCase()}
              </h2>
              <span className="text-gray-400 text-sm">
                {new Intl.DateTimeFormat("en-GB").format(orderDate)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Delivery Status:{" "}
              <span
                className={`font-medium ${order.isDelivered ? "text-green-500" : "text-red-500"
                  }`}
              >
                {order.isDelivered ? "Delivered" : "Pending"}
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Payment Status:{" "}
              <span
                className={`font-medium ${order.isPaid ? "text-green-500" : "text-red-500"
                  }`}
              >
                {order.isPaid ? "Paid" : "Pending"}
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Total Price:{" "}
              <span className="font-medium text-gray-800">
                ${order.totalPrice.toFixed(2)}
              </span>{" "}
              (Tax: ${order.taxPrice.toFixed(2)}, Shipping: $
              {order.shippingPrice.toFixed(2)})
            </p>

            <div className="space-y-4">
              {order.products.map((orderProduct:{productId:string,quantity:number}) => {
                const product = products.find(
                  (p) => p._id === orderProduct.productId
                );

                return (
                  product && (
                    <div
                      key={orderProduct.productId}
                      className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-300"
                    >
                      <Image
                        src={product.image}
                        alt={product.title}
                        className=" rounded-lg object-cover"
                        width={50}
                        height={50}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Price: ${product.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {orderProduct.quantity}
                        </p>
                      </div>
                    </div>
                  )
                );
              })}

            </div>
            <div className="flex justify-end gap-4 mt-4">



              <div className="flex flex-col items-center ">
                <span className="text-sm text-red-500">
                  {/* minutes left to cancel */}
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-500 transition">
                  Order
                </button>

              </div>


            </div>

          </div>
        );
      })
  )
}

export default DeleveredOrderComponent
