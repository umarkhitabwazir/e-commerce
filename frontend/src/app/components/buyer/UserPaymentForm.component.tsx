'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

export default function UserPaymentForm() {
  const [formData, setFormData] = useState({
    paymentPlatform: '',
    accountUsername: '',
    accountNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hasData, setHasData] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchPayment = async () => {
    try {
      const res = await axios.get(`${API}/payment/get`, { withCredentials: true });
const data=res.data.data
      if (data && data.paymentPlatform) {
        setFormData({
          paymentPlatform: data.paymentPlatform,
          accountUsername: data.accountUsername,
          accountNumber: data.accountNumber,
        });
        setHasData(true);
      }
    } catch {
      setHasData(false);
    }
  };
  useEffect(() => {
    fetchPayment();
  }, [API]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${API}/payment/save`, formData, { withCredentials: true });
      setHasData(true);
      setMessage(res.data.data.message || 'Payment data saved successfully');
      await fetchPayment()
      setTimeout(()=>(
setMessage('')
      ),3000)
   
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        
        setMessage(error.response?.data?.message || 'Failed to save payment data');
      }
    } finally {
      setLoading(false);
      setHasData(true);
    }
  };

  if (hasData) {
    return (
      <div className="max-w-sm mx-auto mt-10 bg-white text-black p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-center">Saved Payment Information</h2>
        <p><strong>Payment Platform:</strong> {formData.paymentPlatform}</p>
        <p><strong>Account Username:</strong> {formData.accountUsername}</p>
        <p><strong>Account Number:</strong> {formData.accountNumber}</p>
        <button
          onClick={() => setHasData((prev)=>!prev)}
          className="mt-4 w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
        >
          Edit Payment Info
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white text-black p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4 text-center">Payment Information</h2>
     <p className="text-sm text-gray-600 mt-3 text-center">
  These payment details will be used for refund processing.
</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Payment Platform</label>
          <select
            name="paymentPlatform"
            value={formData.paymentPlatform}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select Platform</option>
            <option value="Easypaisa">Easypaisa</option>
            <option value="JazzCash">JazzCash</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Account Username</label>
          <input
            type="text"
            name="accountUsername"
            value={formData.accountUsername}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter account holder name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter mobile number or account number"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Saving...' : 'Save Payment Info'}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>
      )}
    </div>
  );
}
