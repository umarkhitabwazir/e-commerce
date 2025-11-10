"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { SellerRequestInterface } from "@/app/utils/sellerReuestInterface"
import superAdminAuth from "@/app/auths/superAdminAuth"

const ApproveStoresComponent = () => {
  const [stores, setStores] = useState<SellerRequestInterface[]>([])
  const [loading, setLoading] = useState(true)
   const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState<string | null>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/seller-requests`,{withCredentials:true})
      setStores(res.data.data)
    } catch (err) {
      setError("Failed to fetch store requests.")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveStatus = async (id: string,status:string) => {
    try {
      await axios.put(`${API_URL}/admin/approve-seller-requests/${id}`,{},{withCredentials:true})
      setStores(prev =>
        prev.map(store =>
          store._id === id ? { ...store, status } : store
        )
      )
    } catch (err) {
      console.error("Status update failed", err)
    }
  }
  const handleRejectStatus = async (id: string,status:string) => {
    try {
      await axios.put(`${API_URL}/admin/reject-seller-requests/${id}`,{},{withCredentials:true})
      setStores(prev =>
        prev.map(store =>
          store._id === id ? { ...store, status } : store
        )
      )
    } catch (err) {
      console.error("Status update failed", err)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

    const toggleDescription = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) return <div
  className="flex items-center justify-center mt-16"
  >

    <p className="text-gray-500">Loading store requests...</p>
  </div>
  if (error) return <p className="text-red-600">{error}</p>

  return (
<div className="p-4 min-h-screen bg-gradient-to-b from-blue-400 to-blue-700 sm:p-6 ">

  <h2 className="text-xl font-semibold text-white mb-2">Approve Stores</h2>
  <p className="text-gray-50 mb-6 text-sm">
    Review new store registration requests. Approve verified sellers or reject incomplete or suspicious
    applications. Future versions will include advanced filters, search, and auto-verification tools.
  </p>

  {stores.length === 0 ? (
    <p className="text-gray-100 text-sm">No store requests found</p>
  ) : (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="hidden sm:table min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-500 text-white text-sm">
            <th className="border p-2 text-left">Store Name</th>
            <th className="border p-2 text-left">Owner Name</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Phone</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store._id} className="border-b text-white  text-sm">
              <td className="border p-2">{store.storeName}</td>
              <td className="border p-2">{store.ownerName}</td>
              <td className="border p-2">{store.email}</td>
              <td className="border p-2">{store.phone}</td>
              <td className="border p-2 align-top w-64 break-words">
                <div className="flex flex-col">
                  {expanded[store._id] ? (
                    store.description
                      ?.match(/.{1,80}/g)
                      ?.map((chunk, index) => (
                        <p key={index} className="text-white text-sm mb-1 break-words">
                          {chunk.trim()}
                        </p>
                      ))
                  ) : (
                    <p className="text-white text-sm break-words">
                      {store.description?.slice(0, 80)}
                      {store.description?.length > 80 ? "..." : ""}
                    </p>
                  )}

                  {store.description?.length > 80 && (
                    <button
                      onClick={() => toggleDescription(store._id)}
                      className="text-blue-500 hover:underline text-xs mt-2 self-start"
                    >
                      {expanded[store._id] ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              </td>

              <td
                className={`border p-2 font-medium ${
                  store.status === "approved"
                    ? "text-green-600"
                    : store.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {store.status}
              </td>

              <td className="border p-2 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleApproveStatus(store._id, "approved")}
                    className={` px-3 py-1 rounded text-xs
                    ${store.status === "approved"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-400"}
                      `}
                      disabled={store?.status === "approved"}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectStatus(store._id, "rejected")}
                    // className="bg-red-500  text-white px-3 py-1 rounded text-xs"
                     className={` px-3 py-1 rounded text-xs
                    ${store.status === "rejected"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"}
                      `}
                      disabled={store?.status === "rejected"}
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-4">
        {stores.map(store => (
          <div
            key={store._id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
          >
            <p className="font-semibold text-gray-800 text-base mb-1">
              {store.storeName}
            </p>
            <p className="text-sm text-gray-600 mb-1">Owner: {store.ownerName}</p>
            <p className="text-sm text-gray-600 break-words mb-2">
              {store.email}
            </p>
            <p className="text-sm text-gray-600 break-words mb-2">
              {store.phone}
            </p>

            <div className="text-gray-700  overflow-auto text-sm mb-2">
              {expanded[store._id] ? (
                store.description
                  ?.match(/.{1,30}/g)
                  ?.map((chunk, index) => (
                    <p key={index} className="mb-1">
                      {chunk.trim()}
                    </p>
                  ))
              ) : (
                <p className="overflow-x-auto ">
                  {store.description?.slice(0, 80)}
                  {store.description?.length > 80 ? "..." : ""}
                </p>
              )}

              {store.description?.length > 80 && (
                <button
                  onClick={() => toggleDescription(store._id)}
                  className="text-blue-500 hover:underline text-xs mt-1"
                >
                  {expanded[store._id] ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            <p
              className={`text-sm font-medium mb-3 ${
                store.status === "approved"
                  ? "text-green-600"
                  : store.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              Status: {store.status}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleApproveStatus(store._id, "approved")}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
              >
                Approve
              </button>
              <button
                onClick={() => handleRejectStatus(store._id, "rejected")}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

  )
}

export default superAdminAuth( ApproveStoresComponent)
