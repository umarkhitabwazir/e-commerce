"use client";

import React, { useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddressComponent from "./Address.component";
import { AddressSchema, AddressFormData } from "@/app/utils/formSchemas";
import axios, { AxiosError } from "axios";
import withAuth from "../utils/withAuth";
import SingleProductComponent from "./SingleProduct.component";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
const Address = {
  fullName: "",
  Province: "",
  City: "",
  phone: 0,
  Building: "",
  HouseNo: "",
  Floor: "",
  Street: ""
}
const ShippingComponent = () => {

  const orderSummaryStructure = {
    items: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
  const [address, setAddress] = useState(Address)
  const [savedAddress, setSavedAddress] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [orderSummary, setOrderSummary] = useState(orderSummaryStructure)
  const searchParams = useSearchParams()
  const productId = searchParams.get("product")
  const quantity = searchParams.get("q")
  const productPrice = searchParams.get("p")
  const [formToggle, setFormToggle] = useState(false)
  const router = useRouter()
  console.log("orderSummary", orderSummary)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(AddressSchema),
  });

  const fetchData = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
    } catch (error) {
      console.log("promise error", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const getAddress = async () => {
      try {
        const res = await axios.get(`${API_URL}/find-address`, { withCredentials: true })
        if (res.data.success) {
          setSavedAddress(true)
          await fetchData()

          setAddress(res.data.data)

        }


      } catch (error: unknown) {
        if (error instanceof AxiosError) {

          if (!error.response?.data.success) {
            setSavedAddress(false)

          }
        }

      }
    }
    getAddress()
    const formdata = {
      "products": [{
        "productId": productId,
        "quantity": quantity
      },
      ],


    }
    const previewOrder = async () => {
      try {
        const res = await axios.post(`${API_URL}/preview-order`, formdata)
        console.log('OrderSummary',res.data.data)
        setOrderSummary(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    previewOrder()

  }, [API_URL, setAddress, setSavedAddress,productId,quantity])

  const onSubmit = async (data: AddressFormData) => {
    try {
      console.log(data);
      const res = await axios.post(`${API_URL}/address`, data, { withCredentials: true })
      console.log("addressRes", res)

      window.location.reload();


    } catch (error:unknown) {
      if (error instanceof AxiosError) {
        
        return;
      }
    }
  };

  const onError = (errors: FieldErrors<AddressFormData>) => {
    console.log("Validation errors:", errors);
  };
  const handleFormToggle = () => {
    setFormToggle((prev) => !prev)
  }


  const handleProceedPay = async () => {
    if (!savedAddress) {
      alert("Please add your Delivery  address")
      setFormToggle(true)
      return

    }
    router.push(`${LOCAL_HOST}/payment-cashier?product=${productId}&q=${quantity}&p=${productPrice}`)
  }
  return (
    <>
      <div className=" bg-gray-50 h-full absolute ">


        {
          loading && <div className="fixed top-0 left-0 w-full h-full bg-gray-200 bg-opacity-80 flex flex-col justify-center items-center z-50">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-black text-lg mt-4 border-t-black ">loading...</p>
          </div>}




        <button
          onClick={handleFormToggle}
          className={`${savedAddress ? "hidden" : "bg-blue-700  text-white z-1 px-6 py-3 mt-10 relative left-3 rounded-lg flex justify-center items-center hover:bg-blue-800 active:scale-95 transition-all duration-200"} `}
        >
          Add Delivery Address
        </button>
        <div className="flex justify-evenly  flex-wrap">


          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className={`${formToggle ? "block" : savedAddress ? "hidden" : "hidden"} bg-white absolute top-0 z-50 shadow-md rounded-lg p-6 m-4 w-full max-w-screen-md`}
          >
            <Image onClick={handleFormToggle} className="absolute top-2 right-2 cursor-pointer hover:h-7 hover:w-7" src="/cross.jpg" alt="img" width={30} height={30} />
            <h1 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
              Add Delivery Address
            </h1>

            <div className="grid grid-cols-1 gap-2 mb-2">
              {/* Full Name */}
              <div>
                <label
                  className="block text-xs font-medium text-gray-700 mb-1"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  {...register("fullName")}
                  className={`w-full border rounded-md px-2 py-1 text-sm text-gray-700 ${errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  className="block text-xs font-medium text-gray-700 mb-1"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  {...register("phone")}
                  className={`w-full border rounded-md px-2 py-1 text-sm text-gray-700 ${errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Province and City */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="Province"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  ---Province---
                </label>
                <select
                  id="Province"
                  {...register("Province")}
                  className="w-full border rounded-md px-2 py-1 text-sm text-gray-700"
                >
                  <option value="">Province</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                </select>
                {errors.Province && (
                  <p className="text-red-500 text-xs mt-1">{errors.Province.message}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-xs font-medium text-gray-700 mb-1"
                  htmlFor="City"
                >
                  ---City---
                </label>
                <select
                  id="City"
                  {...register("City")}
                  className="w-full border rounded-md px-2 py-1 text-sm text-gray-700"
                >
                  <option value="">City</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Gwadar">Gwadar</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
                {errors.City && (
                  <p className="text-red-500 text-xs mt-1">{errors.City.message}</p>
                )}
              </div>
            </div>

            {/* Building, House No */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-xs font-medium text-gray-700 mb-1"
                  htmlFor="Building"
                >
                  Building
                </label>
                <input
                  id="Building"
                  {...register("Building")}
                  className={`w-full border rounded-md px-2 py-1 text-sm text-gray-700 ${errors.Building ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Building"
                />
                {errors.Building && (
                  <p className="text-red-500 text-xs mt-1">{errors.Building.message}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-xs font-medium text-gray-700 mb-1"
                  htmlFor="HouseNo"
                >
                  House No
                </label>
                <input
                  id="HouseNo"
                  {...register("HouseNo")}
                  className={`w-full border rounded-md px-2 py-1 text-sm text-gray-700 ${errors.HouseNo ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="House No"
                />
                {errors.HouseNo && (
                  <p className="text-red-500 text-xs mt-1">{errors.HouseNo.message}</p>
                )}
              </div>
            </div>

            {/* Floor and Street */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-xs font-medium text-gray-700 mb-1"
                  htmlFor="Floor"
                >
                  Floor
                </label>
                <input
                  id="Floor"
                  {...register("Floor")}
                  className={`w-full border rounded-md px-2 py-1 text-sm text-gray-700 ${errors.Floor ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Floor"
                />
                {errors.Floor && (
                  <p className="text-red-500 text-xs mt-1">{errors.Floor.message}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-xs font-medium text-gray-700 mb-1"
                  htmlFor="Street"
                >
                  Street
                </label>
                <input
                  id="Street"
                  {...register("Street")}
                  className={`w-full border rounded-md px-2 py-1 text-sm text-gray-700 ${errors.Street ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Street"
                />
                {errors.Street && (
                  <p className="text-red-500 text-xs mt-1">{errors.Street.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md py-2"
            >
              {loading ? "submitting..." : "Submit"}
            </button>
          </form>

          <div>

            <SingleProductComponent productId={productId} />

          </div>

          <div className="w-full max-w-md text-gray-800 bg-white rounded-lg shadow-md p-6 mt-10">
            <h1 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
              Order Summary
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              order cancelling is not allowed after 30 minutes of placing order
            </p>
            <div className="space-y-3">
              <h2 className="flex justify-between text-sm font-medium">
                <span>Items Total ({orderSummary.items}):</span>
                <span>${productPrice}</span>
              </h2>
              <h2 className="flex justify-between text-sm font-medium">
                <span>Delivery Fee:</span>
                <span>${orderSummary.shippingPrice}</span>
              </h2>
              <h2 className="flex justify-between text-sm font-medium">
                <span>Tax Price:</span>
                <span>${orderSummary.taxPrice}</span>
              </h2>
              <h2 className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total:</span>
                <span>${orderSummary.totalPrice}</span>
              </h2>
            </div>
            <button onClick={handleProceedPay} className="mt-6 w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-all">
              Proceed to Pay
            </button>
          </div>
          <AddressComponent savedAddress={savedAddress} address={address} />

        </div>
      </div>

    </>

  );

};

export default withAuth(ShippingComponent);
