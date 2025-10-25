"use client";
import React from "react";

const RefundReturnPolicy = () => {
  return (
    <section className="min-h-screen  flex items-center justify-center px-4 py-16">
      <div className=" rounded-2xl max-w-4xl w-full p-10 ">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          Refund and Return Policy
        </h1>

        <p className="text-gray-700 mb-6">
          We aim to provide you with high-quality products and a smooth shopping experience. 
          If you are not satisfied with your purchase, please review our refund and return policy below.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Eligibility for Returns</h2>
            <p className="text-gray-700 leading-relaxed">
              You may request a return within 7 days of receiving your order. Items must be unused, 
              in their original packaging, and in the same condition as received. 
              We do not accept returns for used, damaged, or customized products.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Non-Returnable Items</h2>
            <p className="text-gray-700 leading-relaxed">
              Certain items are non-returnable for hygiene or customization reasons, such as 
              undergarments, personalized items, or perishable goods.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Refund Process</h2>
            <p className="text-gray-700 leading-relaxed">
              Once we receive and inspect your returned item, we will notify you about the status of your refund. 
              Approved refunds are processed within 5 to 7 business days through the original payment method. 
              Bank or card processing times may vary.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Exchange Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              If you received a defective or incorrect product, please contact us within 48 hours of delivery. 
              We will arrange a replacement at no extra cost, depending on product availability.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Order Cancellations</h2>
            <p className="text-gray-700 leading-relaxed">
              You can cancel your order within 15 minutes after placing it. 
              To request cancellation, contact our support team immediately through email or phone. 
              Once your order is processed or shipped, it cannot be canceled but may qualify for return after delivery.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For refunds or returns, contact us using the details below:
            </p>
            <div className="text-gray-700 leading-relaxed mt-2">
              <p>Email: saadicollection18@gmail.com</p>
              <p>Phone: +92 340 9751709</p>
              <p>Address: Saadi Collections, chakwal, Pakistan</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center mt-10">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
};

export default RefundReturnPolicy;
