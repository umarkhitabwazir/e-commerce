"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddressComponent from "./Address.component";
import { AddressSchema, AddressFormData } from "@/app/utils/formSchemas";
import axios from "axios";
import withAuth from "../utils/withAuth";
import SingleProductComponent from "./SingleProduct.component";
import { useRouter, useSearchParams } from "next/navigation";
const BuyingComponent = () => {
  const addressStructure = {
    fullName: "",
    Province: "",
    City: "",
    phone: null,
    Building: "",
    HouseNo: "",
    Floor: "",
    Street: ""
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
  const [address, setAddress] = useState(addressStructure)
  const [savedAddress, setSavedAddress] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const productId = searchParams.get("product")

  const roter = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(AddressSchema),
  });

  let fetchData = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.log("promise error", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    let getAddress = async () => {
      try {
        let res = await axios.get(`${API_URL}/find-address`, { withCredentials: true })
        if (res.data.success) {
          fetchData()
         
          setAddress(res.data.data)
          setSavedAddress(true)

        }
        if (!res.data.success) {
          setAddress(res.data.data)
          setSavedAddress(false)
        }
      } catch (error) {
        console.log("error", error)
      }
    }
    getAddress()

    let getOrder=async()=>{
      try {
        let res=await axios.get(`${API_URL}/get-order/${productId}`,{withCredentials:true})
        console.log('res',res)
      } catch (error) {
        console.log("get order error",error)
      }
    }
    getOrder()
  }, [API_URL, setAddress, setSavedAddress])

  const onSubmit = async (data: AddressFormData) => {
    try {
      console.log(data);
      setLoading(false)

    } catch (error) {
      console.log(error);
    }
  };

  const onError = (errors: any) => {
    console.log("Validation errors:", errors);

  };

  return (
    <>
      <div className="p-10 flex flex-row  justify-center items-center flex-wrap">


        {
          loading ? <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex flex-col justify-center items-center z-50">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-black text-lg mt-4 border-t-black ">loading...</p>
          </div> : savedAddress ?

            <AddressComponent address={address} />

            :
            <div className=" min-h-screen flex justify-center  bg-gray-100">
              <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="bg-white  shadow-md rounded-lg p-10 w-full max-w-md"
              >
                <h1 className="text-xl font-bold mb-4 text-gray-800 text-center">
                  Delivery Address
                </h1>

                <div className="grid grid-cols-1 gap-4 mb-4">
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
                      Province
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
                      City
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
                  Submit
                </button>
              </form>
            </div>
        }


        <div className="w-fit text-black   bg-gray-100">
          <h1>Order Summary</h1>
          <h2>items</h2>
          <h2>Delivery Fee</h2>
          <h2>Total:</h2>
          <button>Proceed pay</button>
        </div>

      </div>
      <SingleProductComponent productId={productId} />
    </>

  );

};

export default withAuth(BuyingComponent);
