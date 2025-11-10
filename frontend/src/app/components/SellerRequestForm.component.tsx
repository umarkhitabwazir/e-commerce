'use client'
import { useState } from "react";
import axios, { AxiosError } from "axios";

export default function SellerRequestFormComponent() {
  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    phone:"",
    description: "",
  });
  const [error,setError]=useState('')
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('')
  try {
      await axios.post(`${API_URL}/seller-request`, formData);
      alert("Your request has been submitted! Our team will review it.");
  } catch (error:unknown) {
    if(error instanceof AxiosError){
setError(error.response?.data.error)
setTimeout(()=>(
  setError('')
),4000)
    }
  }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-8  bg-transparent  rounded-xl shadow-lg border border-gray-100"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Request to Open a Store
      </h2>
      {
        error &&
        <div className="flex justify-center items-center">

          <p className="text-red-500 font-light">error:{error}</p>
        </div>
      }

      <div className="w-auto max-w-lg mx-auto">


        <div className="mb-5">
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
            Store Name
          </label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2  focus:bg-transparent focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Enter store name"
            value={formData.storeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
            Owner Name
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            className="w-full px-4 py-3 text-gray-800 border focus:bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Enter owner name"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-3 text-gray-800 border focus:bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
            <p className="text-xs text-gray-500 mt-1">
    Note: The provided email will be used to create your account.
  </p>
        </div>
        <div className="mb-5">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Pone
          </label>
          <input
            type="phone"
            id="emaiphone"
            name="phone"
            className="w-full px-4 py-3 text-gray-800 border focus:bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
           placeholder="03XX XXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            required
          />
 
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Store Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Tell us about your products, target audience, and unique value proposition..."
            className="w-full px-4 py-3 text-gray-800 border focus:bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            rows={4}
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 rounded-lg shadow-md hover:opacity-90 transition duration-300 transform "
        >
          Submit Request
        </button>

      </div>
    </form>
  );
}


