'use client';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';
import { FaBox, FaCheck, FaPhone, FaTruck, FaUser } from 'react-icons/fa';
import { OrderInterface, OrderProduct } from '../utils/orderInterface';



const TrackOrderComponent = ({ product, order, setOpenTrackOrder }: { product: OrderProduct[] | null, order: OrderInterface, setOpenTrackOrder: Dispatch<SetStateAction<boolean>> }) => {

    return (

        <div className={`  fixed inset-0  z-50 flex items-center justify-center bg-black/30`}>

            <div className="relative  w-[95%] md:w-[90%] max-h-[95vh] overflow-y-auto   bg-white rounded-xl shadow-lg p-6">

                <button className={` absolute top-3 right-3`} onClick={() => setOpenTrackOrder(false)}>
                    <Image
                        className=" rounded-full cursor-pointer"
                        src='/cross.jpg'
                        alt="Close"
                        width={20}
                        height={20}
                    />
                </button>






                <div className="max-w-7xl  mx-auto mt-10 mb-10">
                    <article className="bg-white shadow-md rounded-lg">
                        <header className="bg-blue-500 text-white px-6 py-4 text-xl font-semibold rounded-t-lg">
                            My Orders / Tracking
                        </header>
                        <div className="p-6 space-y-6">
                            <h6 className="text-lg text-gray-500 font-semibold">Order ID: {order._id}</h6>

                            <article className="bg-gray-100 text-gray-500 p-4 rounded-md">
                                <div className="grid md:grid-cols-4 gap-3 p-4 text-sm">
                                    <div>
                                        <strong>Estimated Delivery time:</strong>
                                        <br />
                                        15-20 days
                                    </div>
                                    <div>
                                        <strong>Shipping By:</strong>
                                        <br />
                                        BLUEDART | <FaPhone className="inline" /> +1598675986
                                    </div>
                                    <div>
                                        <strong>Status:</strong>
                                        <br />
                                       {order.isDelivered ?"Order Deviver": order.confirmed?"Order confirmed" : "Pending"}
                                    </div>
                                    <div>
                                        <strong>Tracking #:</strong>
                                        <br />
                                       {order._id}
                                    </div>
                                </div>
                            </article>

                            {/* Tracking Steps */}
                            <div className="flex items-center justify-between gap-4 text-sm overflow-x-auto">
                                <div className={`${order.confirmed ? "text-green-600" : "text-yellow-300"} flex flex-col items-center `}>
                                    <FaCheck className="text-2xl mb-1" />
                                    <span>{order.confirmed ? "Order confirmed " : "Order Pending..."}</span>
                                </div>
                            
                                <div className={`${order.pickedByCounter ? "text-green-600" : "text-gray-400"}  flex flex-col items-center `}>
                                    <FaUser className="text-2xl mb-1" />
                                    <span>picked By Counter</span>
                                </div>
          

                                <div className={`${order.orderShipped ? "text-green-600" : "text-gray-400"} flex flex-col items-center `}>
                                    <FaTruck className="text-2xl mb-1" />
                                    <span>On the way</span>
                                </div>
                                <div className={`${order.readyForPickup ? "text-green-600" : "text-gray-400"} flex flex-col items-center `}>
                                    <FaBox className="text-2xl mb-1" />
                                    <span>Ready for pickup</span>
                                </div>
                            </div>

                            <hr />

                            {/* Product List */}
                            <ul className="grid md:grid-cols-3 gap-6">
                                {product &&
                                product.map((product:OrderProduct)=>(
                                      <li key={product.productId._id} className="flex text-gray-500 items-start gap-4">
                                        <Image
                                            src={product.productId.image}
                                            alt="Product"
                                            width={80}
                                            height={80}
                                            className="border rounded-md object-contain"
                                        />
                                        <div className="flex flex-col justify-center">
                                            <p className="font-medium">Title:{product.productId.title}</p>
                                            <span className="text-gray-500">Price:{product.productId.price}</span>
                                            <span className="text-gray-500">Quantity:{product.quantity}</span>
                                        
                                        </div>
                                    </li>
                                ))
                                  
                                }
                            </ul>

                            <hr />


                        </div>
                    </article>
                </div>

            </div>
        </div>

    );
};

export default TrackOrderComponent;
