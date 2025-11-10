"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import superAdminAuth from "@/app/auths/superAdminAuth";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { OrderInterface } from "@/app/utils/orderInterface";

interface SuperAdminStats {
  totalSellers: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingStores: number;
}



const AdminDashboardComponent = function () {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [stats, setStats] = useState<SuperAdminStats>({
    totalSellers: 0,
    totalBuyers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingStores: 0,
  });

  const [recentOrders, setRecentOrders] = useState<OrderInterface[]>([]);

  const [revenue,setRevenue]=useState<[{month:string,revenue:number}]>()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes,monthlyrevenueRes] = await Promise.all([
          axios.get(`${API_URL}/admin/dasboard`, { withCredentials: true }),
          axios.get(`${API_URL}/admin/recent-orders?limit=5`, { withCredentials: true }),
          axios.get(`${API_URL}/admin/revenue/monthly`, { withCredentials: true }),
        ]);
        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data);
        setRevenue(monthlyrevenueRes.data.data)
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.log(error);
          if (error.status === 401) router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }


  return (
<div className="p-6 min-h-screen bg-gradient-to-b from-blue-400 to-blue-700">

      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Sellers" value={stats.totalSellers} />
        <StatCard title="Total Buyers" value={stats.totalBuyers} />
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Total Revenue (PKR)" value={stats.totalRevenue.toLocaleString()} />
        <StatCard title="Pending Store Requests" value={stats.pendingStores} />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className=" overflow-x-auto rounded-xl shadow p-4">
        <div className="flex justify-between flex-wrap items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent orders</h2>
        <button
          onClick={() => router.push("/admin/orders")}
          className="text-sm bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          View All Orders↗
        </button>
      </div>
      {recentOrders.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent orders found</p>
      ) : (
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-left border">Order ID</th>
              <th className="p-2 text-left border">Buyer</th>
              <th className="p-2 text-left border">Amount</th>
              <th className="p-2 text-left border">Date</th>
              <th className="p-2 text-left border">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="border-b text-black ">
                <td className="p-2">{order._id}</td>
                <td className="p-2">{order.userId?.username || "UnKnown"}</td>
                <td className="p-2">PKR {order.totalPrice}</td>
                <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                 <td className="border p-2 text-center">
                    <button
                      onClick={() => router.push(`/admin/orders/${order._id}`)}
                      className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      View
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div >
  );
};

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow hover:shadow-md">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default superAdminAuth(AdminDashboardComponent);
