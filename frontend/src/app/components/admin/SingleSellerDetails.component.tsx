"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { ProductInterface } from "@/app/utils/productsInterface";
import superAdminAuth from "@/app/auths/superAdminAuth";


interface Seller {
  username: string;
  email: string;
  storeName: string;
  isVerified: boolean;
}

const SingleSellerDetailsComponent=()=> {
  const { id } = useParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [revenue, setRevenue] = useState<number>(0);
  const [investment, setInvestment] = useState<number>(0)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/seller/revenue/${id}`, { withCredentials: true });
        const data = res.data.data;
        setSeller(data.seller);
        setProducts(data.products);
        setRevenue(data.totalRevenue);
        setInvestment(data.investment)
      } catch (error) {
        console.error("Error fetching seller details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading seller details...</p>;

  return (
  
<div className="p-4 min-h-screen text-black bg-gradient-to-b from-blue-400 to-blue-700 sm:p-6 ">

      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Seller Overview</h1>

      {seller && (
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-800">{seller.username}</h2>
          <p className="text-sm text-gray-500">{seller.email}</p>
          <p className="text-sm text-gray-600 mt-2">Store: {seller.storeName || "N/A"}</p>
          <p className="text-sm mt-1">
            Verified: <span className={seller.isVerified ? "text-green-600" : "text-red-600"}>
              {seller.isVerified ? "Yes" : "No"}
            </span>
          </p>
          <p className="text-sm mt-3 font-semibold text-blue-700 tracking-wide">
            Total Revenue: <span className="text-gray-800">PKR {revenue ? revenue.toFixed(2) : "0.00"}</span>
          </p>
          <p className="text-sm mt-3 font-semibold text-blue-700 tracking-wide">
            Total Investment: <span className="text-gray-800">PKR {investment ? investment.toFixed(2) : "0.00"}</span>
          </p>

        </div>
      )}

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-500 text-sm">No products found for this seller</p>
        ) : (
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-left">Image</th>
                <th className="p-2 border text-left">Title</th>
                <th className="p-2 border text-left">Price</th>
                <th className="p-2 border text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className=" border-b">
                  <td className="p-2 border cursor-pointer"> 
                        <a href={product.image} target="_blank" rel="noopener noreferrer">
                                           <Image
                                             src={product.image}
                                             alt={product.image}
                                             width={70}
                                             height={70}
                                             className="object-cover rounded hover:opacity-80 transition"
                                           />
                                         </a>
                     </td>
                  <td className="p-2 border">{product.title}</td>
                  <td className="p-2 border">PKR {product.price}</td>
                  <td className="p-2 border">{product.countInStock}</td>
                </tr>

              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default superAdminAuth(SingleSellerDetailsComponent)
