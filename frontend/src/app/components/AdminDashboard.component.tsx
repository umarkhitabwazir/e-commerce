import Link from "next/link";
import React from "react";

const AdminDashboardComponent = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/create-product"
          className="block px-4 py-6 bg-blue-500 text-white font-semibold text-center rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
        >
          Add Product
        </Link>
        <Link
          href="/my-products"
          className="block px-4 py-6 bg-green-500 text-white font-semibold text-center rounded-md hover:bg-green-600 transition duration-200 shadow-md"
        >
          My Products
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardComponent;
