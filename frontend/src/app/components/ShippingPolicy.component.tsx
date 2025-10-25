import React from "react";

const ShippingPolicy = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6 text-center">Shipping Policy</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <p>
          We aim to ensure a smooth and reliable delivery experience for all customers. This
          Shipping Policy explains how we process and deliver your orders.
        </p>

        <h2 className="text-xl font-medium">Order Processing</h2>
        <p>
          Orders are typically processed within 1 to 2 business days after payment confirmation.
          Orders placed on weekends or public holidays are processed on the next working day.
        </p>

        <h2 className="text-xl font-medium">Delivery Timelines</h2>
        <p>
          Estimated delivery time within Pakistan is 3 to 5 business days. Remote areas may take
          slightly longer. Delays due to couriers or unforeseen events are beyond our control, but
          we will assist in resolving any issues promptly.
        </p>

        <h2 className="text-xl font-medium">Shipping Charges</h2>
        <p>
          Shipping costs are displayed at checkout. Free delivery may apply on specific promotions
          or order thresholds.
        </p>

        <h2 className="text-xl font-medium">Order Tracking</h2>
        <p>
          Once shipped, customers receive a tracking ID via email or SMS to monitor the delivery
          status of their order.
        </p>

        <h2 className="text-xl font-medium">Order Cancellation</h2>
        <p>
          You can cancel your order within 15 minutes after placing it. After this period, the order
          will be processed, and cancellation may not be possible.
        </p>

        <h2 className="text-xl font-medium">International Shipping</h2>
        <p>
          Currently, we deliver only within Pakistan. International shipping will be announced when
          available.
        </p>

        <p className="mt-8">
          For any shipping-related questions, please contact our support team at{" "}
          <span className="font-medium">saadicollection18@gmail.com</span> or call{" "}
          <span className="font-medium">+92 340 9751709</span>.
        </p>
      </div>
    </section>
  );
};

export default ShippingPolicy;
