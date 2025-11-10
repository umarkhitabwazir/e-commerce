"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Seller {
  _id: string;
  username: string;
  email: string;
  storeName?: string;
  status: string;
}

export default function ManageSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router=useRouter()


  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/sellers`,{withCredentials:true});
      setSellers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch sellers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    
      await axios.patch(`${API_URL}/admin/sellers/${id}`, { status },{withCredentials:true});
      setSellers((prev) =>
        prev.map((seller) =>
          seller._id === id ? { ...seller, status } : seller
        )
      );
  
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
<div className="p-6 min-h-screen bg-gradient-to-b from-blue-400 to-blue-700">

      <h2 className="text-lg font-semibold text-white mb-4">
        Manage Sellers
      </h2>

      {loading ? (
        <p className="text-gray-300">Loading sellers...</p>
      ) : sellers.length === 0 ? (
        <p className="text-gray-300">No sellers found.</p>
      ) : (
        <div className="overflow-x-auto ">
          <table className="w-full text-sm text-left text-white">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr
                  key={seller._id}
                  className="border-b transition"
                >
                  <td className="px-4 py-3">{seller.username}</td>
                  <td className="px-4 py-3">{seller.email}</td>
                  <td className="px-4 py-3">
                    {seller.storeName || "N/A"}
                  </td>
                  <td className="px-4 py-3 capitalize">{seller.status}</td>
                  <td className="px-4 py-3 text-right space-y-3 md:space-y-0 space-x-2">
                    <button
                      onClick={() => handleStatusChange(seller._id, "approved")}
                      className={`px-3 py-1 rounded text-sm ${
                        seller?.status === "approved"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-400"
                      }`}
                      disabled={seller?.status === "approved"}
                   >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(seller._id, "suspended")}
                        className={`px-3 py-1 rounded text-sm ${
                        seller?.status === "suspended"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-600"
                      }`}
                      disabled={seller?.status === "suspended"}
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => handleStatusChange(seller._id, "blocked")}
                 
                    className={`px-3 py-1 rounded text-sm ${
                        seller?.status === "blocked"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      disabled={seller?.status === "blocked"}
                  >
                      Block
                    </button>
                    <button
                      onClick={() => router.push(`/admin/manage-sellers/${seller._id}`)}
                      className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      view
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
