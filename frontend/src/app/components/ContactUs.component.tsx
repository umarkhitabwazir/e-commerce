"use client";

import React, { useState } from "react";
import axios from "axios";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const API=process.env.NEXT_PUBLIC_API_URL

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await axios.post(`${API}/contact-us`, formData);
 setStatus("Message sent successfully.");
setTimeout(() => {
  setStatus("");
}, 3000);

      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-lg rounded-xl p-8">
        {/* Contact Form */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have a question or need help? Send us a message and we’ll respond quickly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full border border-gray-300 text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-lg transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status && (
              <p className="text-center text-sm text-gray-600 mt-2">{status}</p>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h3>
          <p className="text-gray-600 mb-2">📍 Address:Sialkot,Pakistan</p>
          <p className="text-gray-600 mb-2">📞 Phone: +92 340 9751709</p>
          <p className="text-gray-600 mb-2">📧 Email: saadicollection18@gmail.com</p>

  
        </div>
      </div>
    </div>
  );
}
