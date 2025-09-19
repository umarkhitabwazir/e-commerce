import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProductInterface } from "../utils/productsInterface";

const GetProductsByIdsComponent = ({ productIds }: { productIds: string[] | [] }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const router = useRouter();
  const decoded = searchParams.get('query') && JSON.parse(atob(searchParams.get('query') || ''))
  const idsAndQuantityArr = decoded && decoded.productIds
 || [];
  const queryProductIds = idsAndQuantityArr || [];
  const rating = Number(searchParams.get("rating")) || 0;
  const [product, setProduct] = useState<ProductInterface[]>([]);



  const getProductsByIds = async () => {
    
    try {
      const res = await axios.post(`${API_URL}/getProductsByIds`, {
        productIdsArr: queryProductIds && queryProductIds.length !== 0 ? queryProductIds : productIds,
      });

      setProduct(res.data.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          alert("Product not found, it may have been removed.");
          router.back();
          return;
        }
        console.log("Error fetching product:", error);
      }
    }
  };
  useEffect(() => {


    getProductsByIds();
  }, []);

  return (
    (
      product &&
      product.map((products: ProductInterface) => (
        <div key={products._id} className={`rounded-lg bg-transparent  p-6 w-full mt-9 grid grid-flow-row grid-cols-3 md:flex-row items-center gap-6`}>
          {/* Product Image */}
          <div className="flex-shrink-0">
            {products.image ? (
              <Image
                src={products.image}
                alt={products.title}
                onClick={() => window.open(products.image, "_self")}
                className={`rounded-lg object-cover  shadow-md cursor-pointer`}
                width={400}
                height={400}
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                No Image Available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex  flex-col space-y-4 w-full">
            <h1 className="text-2xl font-bold text-gray-900">{products.title || "Untitled Product"}</h1>
            <p className="text-sm text-gray-700">{products.description || "No description available."}</p>

            {/* Product Pricing & Brand */}
            <div className="text-gray-800">
              <h2 className="text-lg font-semibold">
                Price: <span className="text-green-600">${products.price?.toFixed(2) || 'No product price'}</span>
              </h2>
              <h2 className="text-lg font-semibold">
                Brand: <span className="text-gray-700">{products.brand || "Unknown"}</span>
              </h2>
            </div>

            {/* Product Ratings */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`text-2xl ${index < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                  {index < Math.round(rating) ? "★" : "☆"}
                </span>
              ))}
              <Link
                href="#review"
                scroll={true}
                className="text-gray-700 underline hover:text-black"
              >
                {rating === 0 ? "No" : rating} ratings
              </Link>
            </div>
          </div>
        </div>
      ))
    )
  );
};

export default GetProductsByIdsComponent;
