"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import withAuth from "../utils/withAuth";
import Loading from "./Loading.component";
import PendingOrderComponent from "./PendingOrder.component";
import DeleveredOrderComponent from "./DeleveredOrder.component";

interface Order {
  _id: string;
  products: { productId: string; quantity: number }[];
  isDelivered: boolean;
  isPaid: boolean;
  totalPrice: number;
  taxPrice: number;
  shippingPrice: number;
  cancelled: boolean;
  createdAt: Date;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
}

const GetUserOrderComponent = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [pendingOders, setPendingOrders] = useState<Order[]>([]);
  const [deleveredOders, setDeleveredOders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [remainingMinutes, setRemainingMinutes] = useState<{ [key: string]: number }>({});
  console.log('remainingMinutes', remainingMinutes)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/user-order`, {
          withCredentials: true,
        });
        const fetchedPendingOrders: Order[] = res.data.data.filter((order: Order) => !order.isDelivered);
        const fetchedDeleveredOrders: Order[] = res.data.data.filter((order: Order) => order.isDelivered);
      
      const fetchedPendingOrdersAcceptedcancelled = fetchedPendingOrders.filter((order: Order) => !order.cancelled);
      setPendingOrders(fetchedPendingOrdersAcceptedcancelled);
        setDeleveredOders(fetchedDeleveredOrders);

        const productIds = [
          ...new Set(
            fetchedPendingOrders.flatMap((order) =>
              order.products.map((product) => product.productId)
            )
          ),
        ];
        if (productIds.length === 0) {
          setLoading(false);
          return;
        }

        const productRes = await axios.post(
          `${API_URL}/find-ordered-products`,
          { productIds },
          { withCredentials: true }
        );
        setProducts(productRes.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders or products:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_URL]);

  useEffect(() => {
    const calculateRemainingMinutes = () => {
      const minutesLeft: { [key: string]: number } = {};
      pendingOders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const currentDate = new Date();
        const timeDifference = (currentDate.getTime() - orderDate.getTime()) / (1000 * 60); // Time difference in minutes
        const remainingMinutes = 30 - timeDifference;
        minutesLeft[order._id] = remainingMinutes;
      });
      setRemainingMinutes(minutesLeft);
    };

    calculateRemainingMinutes();
  }, [pendingOders]);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center absolute h-screen bg-gray-50">
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <div className="p-8 bg-bgGray min-h-screen">

      {/* Pending Orders */}
      <div className="flex justify-center items-center">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Orders</h1>
      </div>
      {pendingOders.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-gray-200 rounded-lg shadow-sm">
          <p className="text-gray-600 text-lg">You have no pending orders.</p>
        </div>
      ) : (

        <PendingOrderComponent pendingOders={pendingOders} remainingMinutes={remainingMinutes} products={products} />
      )
      }

      {/* Delevered Orders */}



      {deleveredOders.length === 0 ? (
        <div></div>
      ) :
        <div>
          <hr className="bg-gray-500 w-full h-1 mt-8 mb-8" />
          <div className="flex justify-center items-center">

            <h1 className="text-3xl font-bold text-green-500 mb-6">Delevered Orders</h1>
          </div>
          <DeleveredOrderComponent deleveredOders={deleveredOders} products={products} />
        </div>
      }
    </div>
  );
};

export default withAuth(GetUserOrderComponent);