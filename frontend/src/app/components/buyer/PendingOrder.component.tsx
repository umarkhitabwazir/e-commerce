import { useState, useRef } from 'react';
import Image from 'next/image';
import TrackOrderComponent from './TrackOrder.component';
import { ProductInterface } from '../../utils/productsInterface';
import { OrderInterface } from '../../utils/orderInterface';
import axios, { AxiosError } from 'axios';

const PendingOrderComponent = ({
  fetchOrders,
  pendingOders,
  products,
}: {
  fetchOrders:()=>void ,
  pendingOders: OrderInterface[];
  products: ProductInterface[];
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const [openTrackOrderMap, setOpenTrackOrderMap] = useState<Record<string, boolean>>({});
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [productMap, setProductMap] = useState<Record<string, ProductInterface | null>>({});
  const [isCancellingMap, setIsCancellingMap] = useState<Record<string, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [detailToggleBtn, SetDetailToggleBtn] = useState<boolean>(false)

  const handleShowDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancelOrder = async (orderId: string) => {

    setLoadingMap((prev) => ({ ...prev, [orderId]: true }));
    try {
      await axios.post(`${API_URL}/cancel-order/${orderId}`, {}, { withCredentials: true });
      setLoadingMap((prev) => ({ ...prev, [orderId]: false }));
      setIsCancellingMap((prev) => ({ ...prev, [orderId]: false }))
      fetchOrders()

      return pendingOders
    } catch (error: unknown) {
      setLoadingMap((prev) => ({ ...prev, [orderId]: false }));

      if (error instanceof AxiosError) {
return;
      }
    }
  };
  return (
    <>
      {
        pendingOders.length === 0 &&
        <div className="flex flex-col items-center justify-center p-8  rounded-2xl ">

          <p className="text-sm text-gray-500 mt-2">Looks like you haven&rsquo;t placed an order yet. Start shopping to see your orders here!</p>
        </div>
      }
      <div className="space-y-6">
        {pendingOders.map((order) => {
          const orderDate = new Date(order.createdAt);
          const delivered = order.isDelivered;
          const now = new Date();
          const timeDiff = (now.getTime() - orderDate.getTime()) / 1000 / 60;
          const remainingTime = Math.max(15 - timeDiff, 0);

          const openTrackOrder = openTrackOrderMap[order._id] || false;


          const product = productMap[order._id] || null;

          const isCancelling = isCancellingMap[order._id] || false;
          const loading = loadingMap[order._id] || false;

          return (
            <div key={order._id} className="border w-auto p-3   rounded-md bg-white shadow">
              <div className="flex flex-wrap justify-between items-center">
                <h2 className="font-bold text-gray-700">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>

                <p className="text-gray-600 text-sm">order{' '}on{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`inline-block w-3 h-3 rounded-full ${order.confirmed ? 'bg-green-500' : 'bg-red-500'}  mr-2`}></span>
                  <span className={`text-sm ${order.confirmed ? 'text-green-700' : 'text-red-500'} `}>
                    {order.confirmed ? 'confirm' : 'pending'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleShowDetails(order._id)
                    if (selectedOrderId === order._id) {
                      SetDetailToggleBtn((prev) => !prev)
                    }
                  }}
                  className="bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-600"
                >
                  {selectedOrderId === order._id && detailToggleBtn ?
                    'Close Details' :
                    'View Details'}
                </button>
              </div>

              {detailToggleBtn && selectedOrderId === order._id && (
                <div ref={detailRef} className="mt-6 p-6  rounded-xl  ">
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h2>
                    <span className="text-gray-400 text-sm">
                      {new Intl.DateTimeFormat('en-GB').format(orderDate)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    Delivery Status:{' '}
                    <span className={`font-medium ${delivered ? 'text-green-500' : 'text-red-500'}`}>
                      {delivered ? 'Delivered' : 'Pending'}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600 mb-2">
                    Payment Status:{' '}
                    <span className={`font-medium ${order.isPaid ? 'text-green-500' : 'text-red-500'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    Total Price:{' '}
                    <span className="font-medium text-gray-800">
                      PKR{' '}{order.totalPrice.toFixed(2)}
                    </span>{' '}
                    (Tax: PKR{' '}{order.taxPrice.toFixed(2)}, Shipping: ${order.shippingPrice.toFixed(2)})
                  </p>

                  <div className=" flex gap-2 items-center justify-center flex-wrap">
                    {order.products.map((orderProduct) => {
                      const product = products.find((p) => p._id === orderProduct.productId._id);
                      if (!product) return null;

                      return (
                        <div
                          key={orderProduct.productId._id}
                          className=""
                        >
                          <div className="flex flex-wrap items-center gap-4 p-4 justify-center      transition">
                            <Image
                              src={product.image}
                              alt={product.title}
                              className="rounded-lg object-cover w-full h-auto"
                              width={120}
                              height={120}
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {product.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Price: PKR{' '}{product.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {orderProduct.quantity}
                              </p>
                            </div>
                          </div>

                        </div>

                      );
                    })}

                  </div>

                  <div className={` flex ${remainingTime > 0 ? 'justify-between' : 'justify-end'}  items-center gap-4 mt-4`}>
                    {!delivered && (
                      <button
                        onClick={() => {
                          setOpenTrackOrderMap((prev) => ({
                            ...prev,
                            [order._id]: !openTrackOrder,
                          }));
                          setProductMap((prev) => ({ ...prev, [order._id]: product }));
                        }}
                        className="px-4 py-2  bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition mt-4 md:mt-0"
                      >
                        Track Order
                      </button>
                    )}
                    {openTrackOrder && (
                      <TrackOrderComponent
                        product={order.products}
                        order={order}
                        setOpenTrackOrder={() =>
                          setOpenTrackOrderMap((prev) => ({
                            ...prev,
                            [order._id]: !prev[order._id],
                          }))
                        }
                      />
                    )}

                    {remainingTime > 0 && (
                      <div className="flex flex-col items-center">
                        <span className="text-sm text-red-500">
                          {Math.floor(remainingTime)} minutes left to cancel
                        </span>
                        <button
                          onClick={() =>
                            setIsCancellingMap((prev) => ({ ...prev, [order._id]: true }))
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition"
                        >
                          Cancel Order
                        </button>

                        {isCancelling && (
                          <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex flex-col gap-3 justify-center items-center z-50">
                            <div
                              onClick={() =>
                                setIsCancellingMap((prev) => ({ ...prev, [order._id]: false }))
                              }
                              className="absolute top-0 right-0 p-4"
                            >
                              <Image
                                className="cursor-pointer w-10 h-10 hover:w-9 hover:h-9 transition-all duration-100 rounded-full"
                                width={10}
                                height={10}
                                src="/cross.jpg"
                                alt="close"
                              />
                            </div>
                            <span className="text-red-500">
                              Are you sure you want to cancel your order?
                            </span>
                            <div className="flex gap-4">
                              <button
                                id={order._id}
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition"
                              >
                                {loading ? 'Loading...' : 'Yes'}
                              </button>
                              <button
                                onClick={() =>
                                  setIsCancellingMap((prev) => ({ ...prev, [order._id]: false }))
                                }
                                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-500 transition"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PendingOrderComponent;
