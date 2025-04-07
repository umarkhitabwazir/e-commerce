"use client";
import axios from 'axios';
import Image from 'next/image';
import React, {  useState } from 'react';
import useSWR from 'swr';
import TrackOrderComponent from './TrackOrder.component';
import { OrderInterface } from '../utils/orderInterface';
import { ProductInterface } from '../utils/productsInterface';
const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(res => res.data);
console.log("fetcher", fetcher);


interface PendingOrderComponentProps {
  pendingOders: OrderInterface[];
  remainingMinutes: { [key: string]: number };
  products: ProductInterface[];
}

const PendingOrderComponent: React.FC<PendingOrderComponentProps> = ({
  pendingOders,
  remainingMinutes,
  products
}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [openTrackOrder, setOpenTrackOrder] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductInterface | null>(null);
  const { data: orders, error, mutate } = useSWR(`${API_URL}/user-order`, fetcher);
 

  const isCancellingOrder = () => {
    setIsCancelling(true);
  };

  const handleCancelOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const orderId = e.currentTarget.id;
    setLoading(true);
    if (!orderId) return;
    if (remainingMinutes[orderId] <= 0) return;
    
    try {
      const cancelOrder = await axios.post(`${API_URL}/cancel-order/${orderId}`, {}, { withCredentials: true });
 
      if (cancelOrder.status === 200) {
        mutate();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
      setIsCancelling(false);
    }
  };

  if (error) return <div>Error loading orders</div>;
  if (!orders) return <div>Loading...</div>;

  return (
    <div>
      {pendingOders.map((order) => {
        const orderDate = new Date(order.createdAt);
        const remainingTime = remainingMinutes[order._id];
        const delivered = order.isDelivered;
        
        return (
          !order.cancelled && (
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
                {order.products.map((orderProduct) => {
                  const product = products.find(
                    (p) => p._id === orderProduct.productId
                  );
                  if (!product) return null;



                  return (
                    product && (
                      <div className='md:flex  justify-between items-end' key={orderProduct.productId}>
                        <div
                          key={orderProduct.productId}
                          className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-300"
                        >
                          <Image
                            src={product.image}
                            alt={product.title}
                            className=" rounded-lg object-cover"
                            width={300}
                            height={300}
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
                        {!delivered && (
                          <div >

                            <button onClick={() => { setOpenTrackOrder((prv) => !prv), setProduct(product) }} className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition">
                              Track Order
                            </button>
                          </div>
                        )}

                      </div>
                    )
                  );

                })}
              </div>
              <div className="flex  justify-end gap-4 mt-4">



                {openTrackOrder &&


  <TrackOrderComponent product={product || null} order={order} setOpenTrackOrder={setOpenTrackOrder} />


                }


                {remainingTime > 0 && (
                  <div className="flex flex-col items-center ">
                    <span className="text-sm text-red-500">
                      {Math.floor(remainingTime)} minutes left to cancel
                    </span>
                    <button onClick={isCancellingOrder} className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition">
                      Cancel Order
                    </button>
                    <div className={`${isCancelling ? "" : "hidden"} fixed  top-0 left-0 w-full h-full bg-white bg-opacity-80 flex  flex-col gap-3 justify-center items-center z-50`}>
                      <div onClick={() => { setIsCancelling(false) }} className='absolute top-0 right-0 p-4'>
                        <Image
                          className='cursor-pointer w-10 h-10 hover:w-9 hover:h-9 transition-all duration-100 rounded-full'
                          width={10}
                          height={10}
                          src="/cross.jpg" alt="cross-img" />
                      </div>
                      <span className='text-red-500'>Are you sure you want to cancel your order {" "} !</span>
                      <div className='flex gap-4'>
                        <button id={order._id || "no id"}
                          onClick={handleCancelOrder}
                          className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition">
                          {loading ? "loading..." : "Yes"}
                        </button>
                        <button
                          onClick={() => { setIsCancelling(false) }}
                          className='px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-500 transition'>
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default PendingOrderComponent;