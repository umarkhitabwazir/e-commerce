"use client";
import React from "react";
import EditProductComponent from "@/app/components/EditProduct.component";
import { useSearchParams } from "next/navigation";

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
