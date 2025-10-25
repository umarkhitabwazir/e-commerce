import Link from "next/link";
import React from "react";

const PolicyLinksComponent = () => {
  return (
    <div className="flex flex-col space-y-2">
      <Link
        href="/privacy-policy"
        className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
      >
        Privacy Policy
      </Link>
      <Link
        href="/terms-and-conditions"
        className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
      >
        Terms & Conditions
      </Link>
      <Link
        href="/refund-return-policy"
        className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
      >
        Refund & Return Policy
      </Link>
      <Link
        href="/shipping-policy"
        className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
      >
        Shipping Policy
      </Link>
      <Link
        href="/ownership-statement"
        className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
      >
        Ownership Statement
      </Link>
    </div>
  );
};

export default PolicyLinksComponent;
