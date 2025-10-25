"use client";
import React from "react";

const TermsAndConditions = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="  rounded-2xl max-w-4xl w-full p-10 ">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          Terms and Conditions
        </h1>

        <p className="text-gray-700 mb-6">
          Welcome to Saadi Collections. By using our website and purchasing our products, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before placing any order.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Business Information</h2>
            <p className="text-gray-700 leading-relaxed">
              Saadi Collections is a registered business operating from Sialkot, Pakistan. All transactions, deliveries, and communications will be handled through this location.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Product Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We make every effort to display accurate product descriptions, prices, and images. However, slight variations may occur due to lighting or screen settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Orders and Payments</h2>
            <p className="text-gray-700 leading-relaxed">
              Orders are confirmed once full or partial payment is received. We reserve the right to cancel any order in case of payment issues or stock unavailability.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Shipping and Delivery</h2>
            <p className="text-gray-700 leading-relaxed">
              Delivery timelines are mentioned on each product page. Delays caused by couriers or external factors are not our responsibility, though we assist in resolving such issues promptly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Returns and Refunds</h2>
            <p className="text-gray-700 leading-relaxed">
              Refunds and exchanges are handled according to our Refund Policy. Customers must contact us within 7 days of receiving their order for any claims.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Privacy and Data</h2>
            <p className="text-gray-700 leading-relaxed">
              We protect your personal data according to our Privacy Policy. Your information will only be used to process orders and improve customer experience.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Saadi Collections is not liable for indirect or incidental damages arising from product use, delays, or unavailability. Our total liability is limited to the amount paid for the product.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms are governed by the laws of Pakistan. Any disputes will be resolved under the jurisdiction of courts in Sialkot.
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center mt-10">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
};

export default TermsAndConditions;
