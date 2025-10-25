import React from "react";
import Link from "next/link";

const OwnershipStatement = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6 text-center">Ownership Statement</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <p>
          This website, <span className="font-medium">Saadi Collections</span>, is owned and operated
          by{" "}
          <Link
            href="https://umarkhitab.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Umar Khitab
          </Link>
          .
        </p>

        <p>
          Registered Business Address:
          <br />
          <span className="font-medium">chakwal, Punjab, Pakistan</span>
        </p>

        <p>
          Contact Information:
          <br />
          Email: <span className="font-medium">saadicollection18@gmail.com</span>
          <br />
          Phone: <span className="font-medium">+92 340 9751709</span>
        </p>

        <p>
          All content, images, and materials displayed on this website are the property of Saadi
          Collections unless otherwise stated. Unauthorized use, reproduction, or distribution of
          any content is strictly prohibited.
        </p>

        <p>
          Saadi Collections takes full responsibility for the accuracy of information, services, and
          products offered on this website.
        </p>

        <p className="mt-6">
          For any inquiries related to website ownership, please contact us through the provided
          details.
        </p>
      </div>
    </section>
  );
};

export default OwnershipStatement;
