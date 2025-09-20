'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { OrderInterface, OrderProduct } from '../utils/orderInterface';
type Product = {
  _id: string;
  title: string;
  price: number;
  image: string;
};




const DeleveredOrderComponent =
  ({
    fetchOrders,
    deleveredOders,
    products
  }: {
    fetchOrders: () => void;
    deleveredOders: OrderInterface[],
    products: Product[]
  }
  ) => {
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [detailToggleBtn, SetDetailToggleBtn] = useState<boolean>(false);

    const detailRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      fetchOrders()

    }, [])
    const handleShowDetails = (orderId: string) => {
      fetchOrders()
      setSelectedOrderId(orderId);
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    return (
      <>
        {deleveredOders.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8  rounded-2xl ">
            <h3 className="text-lg font-semibold text-gray-700">No Order History</h3>
            <p className="text-sm text-gray-500 mt-2">You haven not placed any orders yet.</p>
          </div>
        )}

        {deleveredOders.map((order) => (
          <div key={order._id} className="animate-fadeIn ">
            <div className="flex flex-wrap items-center w-full   justify-between gap-3 bg-green-50 rounded-xl p-4 mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" >
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-800">Order #{order._id}</p>
                <p className="text-gray-600 text-sm">Delivered{' '}on{' '}
                  {new Date(order.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="flex items-center mt-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm text-green-700">Delivered</span>
                </div>
              </div>
              <button
                onClick={() => {
                  handleShowDetails(order._id)
                  if (selectedOrderId === order._id) {
                    SetDetailToggleBtn((prev) => !prev)
                  }
                }}
                className="ml-auto w-full text-green-600 hover:text-green-800 font-medium">
                {detailToggleBtn && selectedOrderId === order._id ? 'Close Details ' : "View Details"}
              </button>
            {
              detailToggleBtn && selectedOrderId === order._id &&
              <div
                ref={detailRef}
                key={order._id}
                className="flex flex-wrap flex-col justify-between mb-8 w-full mt-3 rounded-xl bg-green-50  "
              >
                <hr className="border-t-2 border-gray-400" />

                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <span className="text-gray-400 text-sm">
                    {new Intl.DateTimeFormat("en-GB").format(new Date(order.updatedAt))}
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
                  {order.products.map((orderProduct: OrderProduct) => {

                    const product = products.find((p) => p._id === orderProduct.productId._id)!;


                    return (
                      product! && (
                        <div
                          key={orderProduct.productId._id}
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

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-500 transition">
                      Order
                    </button>

                  </div>


                </div>

              </div>
            }
            </div>
          </div>
        ))}
      </>

    );


  }

export default DeleveredOrderComponent
