"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { UserInterface } from "@/app/utils/user.interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL

const ManageBuyersComponent = () => {
  const [buyers, setBuyers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/admin/buyers`, {
        withCredentials: true,
      });
      setBuyers(data.data || []);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {

        setError(err.response?.data.error)
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id: string) => {
    try {
      await axios.put(
        `${API_URL}/admin/block-buyer/${id}`,
        {},
        { withCredentials: true }
      );
      setBuyers((prev) =>
        prev.map((b) =>
          b?._id === id ? { ...b, status: "blocked" } : b
        )
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {

        setError(err.response?.data.error)
      };
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/admin/delete-buyer/${id}`, {
        withCredentials: true,
      });
      setBuyers((prev) => prev.filter((b) => b?._id !== id));
    } catch (err:unknown) {
          if(err instanceof AxiosError){
    
            setError(err.response?.data.error)
          }
    }
  };

  const handleApproveStatus = async (id: string) => {
    try {
      await axios.put(
        `${API_URL}/admin/approve-buyer/${id}`,
        {},
        { withCredentials: true }
      );
      setBuyers((prev) =>
        prev.map((b) =>
          b?._id === id ? { ...b, status: "approved" } : b
        )
      );
    } catch (err:unknown) {
          if(err instanceof AxiosError){
    
            setError(err.response?.data.error)
          }
    }
  }
  useEffect(() => {
    fetchBuyers();
  }, []);

  if (loading) return <p className="text-gray-400">Loading buyers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    // <div className="p-4 sm:p-6 bg-gray-900 text-white min-h-screen shadow-lg">
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-b from-blue-400 to-blue-700">

      <h1 className="text-xl font-semibold mb-4">Manage Buyers</h1>

      {buyers.length === 0 ? (
        <p className="text-gray-400">No buyers found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="hidden sm:table w-full border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer?._id} className="border-t border-gray-700">
                  <td className="p-2">{buyer?.username || 'N/A'}</td>
                  <td className="p-2 break-words">{buyer?.email || 'N/A'}</td>
                  <td className="p-2 capitalize">{buyer?.status || 'N/A'}</td>
                  <td className="p-2 flex flex-wrap gap-2">
                    {buyer?._id && (
                      <>
                        <button
                          onClick={() => handleApproveStatus(buyer._id!)}
                          className={`px-3 py-1 rounded text-sm ${buyer?.status === "approved"
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-400"
                            }`}
                          disabled={buyer?.status === "approved"}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleBlock(buyer._id!)}
                          className={`px-3 py-1 rounded text-sm ${buyer?.status === "blocked"
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-yellow-500 hover:bg-yellow-600"
                            }`}
                          disabled={buyer?.status === "blocked"}
                        >
                          Block
                        </button>
                        <button
                          onClick={() => handleDelete(buyer._id!)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile view */}
          <div className="sm:hidden flex flex-col gap-4">
            {buyers.map((buyer) => (
              <div
                key={buyer?._id}
                className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-md"
              >
                <p className="text-base font-semibold">{buyer?.username}</p>
                <p className="text-sm text-gray-400 break-words">{buyer?.email}</p>
                <p className="text-sm mt-1 capitalize text-gray-300">
                  Status: {buyer?.status}
                </p>
                <div className="flex flex-wrap  gap-2 mt-3">
                  <button
                    onClick={() => handleBlock(buyer?._id!)}
                    className={`flex-1 px-3 py-1 rounded text-sm ${buyer?.status === "approved"
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-400"
                      }`}
                    disabled={buyer?.status === "blocked"}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleBlock(buyer?._id!)}
                    className={`flex-1 px-3 py-1 rounded text-sm ${buyer?.status === "blocked"
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    disabled={buyer?.status === "blocked"}
                  >
                    Block
                  </button>
                  <button
                    onClick={() => handleDelete(buyer?._id!)}
                    className="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

  );
};

export default ManageBuyersComponent;
