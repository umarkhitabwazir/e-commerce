"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import PendingOrderComponent from "./PendingOrder.component";
import DeleveredOrderComponent from "./DeleveredOrder.component";
import ProductReviewComponent from "./ProductReviewForm.component";
import { useSearchParams } from "next/navigation";
import { ProductInterface } from "../../utils/productsInterface";
import { OrderInterface } from "../../utils/orderInterface";
import buyerAuth from "../../auths/buyerAuth";
import GetUserCartComponent from "./BuyerUserCart.component";
import FavouriteProductsComponent from "./FavorateProducts.component";



const BuyerOrderComponent = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const tabFromParams = searchParams.get('tab')
  const productId = searchParams.get("product");

  const [pendingOders, setPendingOrders] = useState<OrderInterface[]>([]);
  const [deleveredOders, setDeleveredOders] = useState<OrderInterface[]>([]);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: '0px',
    left: '0px',
    opacity: 0
  });


  const tabs = [
    { id: 'pending', label: 'Pending Orders' },
    { id: 'delivered', label: 'Order History' },
    { id: 'favorites', label: 'Favorite Products' },
    { id: 'cart', label: 'Cart Products' },
  ];

  useEffect(() => {
    if (tabFromParams) {
      setMenuOpen(false)
      setActiveTab(tabFromParams)
    }
  }, [tabFromParams])
  useEffect(() => {
    // Simulate indicator animation on tab change

    const activeTabElement = document.getElementById(`tab-${activeTab}`);
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        width: `${offsetWidth}px`,
        left: `${offsetLeft}px`,
        opacity: 1
      });
    }
  }, [activeTab]);
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/user-order`, {
        withCredentials: true,
      });
      const data = res.data.data
      const fetchedPendingOrders: OrderInterface[] = data.filter((order: OrderInterface) => !order.isDelivered);
      const fetchedDeleveredOrders: OrderInterface[] = data.filter((order: OrderInterface) => order.isDelivered);
      const fetchedPendingOrdersAcceptedcancelled = fetchedPendingOrders.filter((order: OrderInterface) => !order.cancelled);
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
        return;
      }

      const productRes = await axios.post(
        `${API_URL}/find-ordered-products`,
        { productIds },
        { withCredentials: true }
      );
      setProducts(productRes.data.data);
    } catch (error) {
      console.error("Error fetching orders or products:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

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
    };

    calculateRemainingMinutes();
  }, [pendingOders]);



  return (
    <div className="p-3 flex flex-wrap justify-between   min-h-screen">
      {/* mobile menu  */}
 <div className={`absolute left-0 p-2  md:hidden w-full   mb-8`}>
        {/* Menu Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`${menuOpen?"rounded-t-md":"rounded-md"} px-4 py-2   w-full bg-blue-600 text-white font-medium `}
        >
          Select Tab {menuOpen ? '▲' : '▼'}
        </button>
                <hr className="border-t-2 border-gray-400" />


        {/* Menu Items */}
        {menuOpen && (
          <div className=" flex z-50 bg-blue-600 p-3 rounded-b-md  flex-col justify-center flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors duration-200 ${activeTab === tab.id
                    ? "bg-gray-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Order Management*/}
      <div className="w-screen md:mt-0 mt-20 mx-auto md:p-6">
        <div className=" rounded-2xl  overflow-hidden">
          <div className="md:p-6 p-0 mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Management</h2>
            <p className="text-gray-600 mb-8">Track and manage your orders and favorites</p>

            {/* desktop tab */}
            <div className={`md:block hidden mb-8`}>
              <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={` px-4 py-3 text-sm sm:text-base font-medium transition-colors duration-300 relative z-10 
                      ${activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div
                className="absolute  h-1 bg-blue-500 transition-all duration-500 ease-out rounded-full"
                style={indicatorStyle}
              />
            </div>




            <div className={` min-h-[300px]  transition-all mt-20 md:top-0  duration-500`}>

              {activeTab === 'pending' && (
                <PendingOrderComponent
                  fetchOrders={fetchOrders}
                  pendingOders={pendingOders}
                  products={products} />

              )}

              {activeTab === 'delivered' && products && (
                <DeleveredOrderComponent
                  fetchOrders={fetchOrders}
                  deleveredOders={deleveredOders}
                  products={products} />

              )}

              {activeTab === 'favorites' && (
                <FavouriteProductsComponent />
              )}

              {
                activeTab === 'cart' && (
                  <GetUserCartComponent />
                )}
            </div>
          </div>
        </div>
      </div>



      <ProductReviewComponent productId={productId} />

    </div>
  );
};

export default buyerAuth(BuyerOrderComponent);