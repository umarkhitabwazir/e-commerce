import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProductInterface } from "../../utils/productsInterface";
import ProductReviewFormComponent from "./ProductReviewForm.component";
import ReviewComponent from "./Review.component";

const GetProductsByIdsComponent = ({ productIds }: { productIds: string[] | [] }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const router = useRouter();
  const decoded = searchParams.get('query') && JSON.parse(atob(searchParams.get('query') || ''))
  const idsAndQuantityArr = decoded && decoded.productIds || [];
  const queryProductIds = idsAndQuantityArr || [];
  const [product, setProduct] = useState<ProductInterface[]>([]);
  const [countReviews, setCountReviews] = useState<{ [key: string]: number }>({});
  const pathName = usePathname();
  const productReviewShowingRoutes = ["/buyer/order","/buyer/payment-cashier"].includes(pathName)




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
        <div
          key={products._id}>
          <div

            className="flex flex-wrap justify-center  md:flex-nowrap p-4 gap-1"
          >
            <div key={products._id}
              className="rounded-lg bg-transparent w-auto max-w-md  flex flex-wrap justify-center items-center md:justify-start md:flex-row md:items-start gap-6"
            >
              {/* Product Image */}
              <div className="flex flex-col  justify-center items-center flex-wrap gap-3  ">
                {products.image ? (
                  <Image
                    src={products.image}
                    alt={products.title}
                    onClick={() => window.open(products.image, "_self")}
                    className={`rounded-lg object-cover   shadow-md cursor-pointer`}
                    width={400}
                    height={400}
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                    No Image Available
                  </div>
                )}
                {/* Product Details */}
                <div className="flex flex-wrap  flex-col justify-between space-y-4 w-full">
                  <h1 className="text-2xl font-bold text-gray-900">{products.title || "Untitled Product"}</h1>
                  <p className="text-sm text-gray-700">{products.description || "No description available."}</p>

                  {/* Product Pricing & Brand */}
                  <div className="text-gray-800">
                    <h2 className="text-lg font-semibold">
                      Price: <span className="text-green-600">PKR{' '}{products.price?.toFixed(2) || 'No product price'}</span>
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
                        className={`text-2xl ${index < Math.round(countReviews[products._id] || 0) ? "text-yellow-400" : "text-gray-300"
                          }`}
                      >
                        {index < Math.round(countReviews[products._id] || 0) ? "★" : "☆"}
                      </span>
                    ))}
                    <Link
                      href="#review"
                      scroll={true}
                      className="text-gray-700 underline hover:text-black"
                    >
                      {countReviews[products._id] ? countReviews[products._id] : "No"} ratings
                    </Link>
                  </div>
                </div>
              </div>

            </div>
            {/* Reviews Section */}
            {productReviewShowingRoutes &&
              <div id="review" className="h-screen ">

                <ReviewComponent setCountReviews={setCountReviews} productId={products._id} />

                <br />
                <div>
                  <ProductReviewFormComponent productId={products._id} />

                </div>

              </div>
            }

          </div>

          <hr className="border-dashed h-2 border-gray-300 max-w-full my-4 " />


        </div>

      ))
    )
  );
};

export default GetProductsByIdsComponent;
