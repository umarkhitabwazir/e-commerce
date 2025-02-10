"use client";
import EditProductComponent from "@/app/components/EditProduct.component";
import { useSearchParams } from "next/navigation";
import React from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  return (
    <div>
      <EditProductComponent productId={productId} />
    </div>
  );
};

export default Page;
