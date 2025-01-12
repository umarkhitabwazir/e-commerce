"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AddressSchema, AddressFormData } from "@/app/utils/formSchemas";

const BuyingComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(AddressSchema),
  });

  const onSubmit = async (data: AddressFormData) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onError = (errors: any) => {
    console.error("Validation errors:", errors);
  };

  return (
    <div className="p-10 min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="bg-white shadow-lg rounded-lg p-8 w-full h-auto max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Delivery Address</h1>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            {...register("fullName")}
            className={`block w-full border rounded-lg px-3 py-2 text-black ${errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            {...register("phone")}
            className={`block w-full border rounded-lg px-3 py-2 text-black ${errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {/* Province */}
        <div className="mb-4">
          <section className="text-black">
            <label htmlFor="Province" className="block text-sm font-medium text-gray-700">
              Province
            </label>
            <select
              id="Province"
              {...register("Province")}
              className="block w-full border rounded-lg px-3 py-2 bg-white cursor-pointer"
            >
              <option className="text-black font-mono cursor-pointer" value="">---Select a Province---</option>
              <option className="text-black font-mono cursor-pointer" value="Punjab">Punjab</option>
              <option className="text-black font-mono cursor-pointer" value="Sindh">Sindh</option>
              <option className="text-black font-mono cursor-pointer" value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
              <option className="text-black font-mono cursor-pointer" value="Balochistan">Balochistan</option>
              <option className="text-black font-mono cursor-pointer" value="Islamabad Capital Territory">Islamabad Capital Territory</option>
              <option className="text-black font-mono cursor-pointer" value="Gilgit-Baltistan">Gilgit-Baltistan</option>
              <option className="text-black font-mono cursor-pointer" value="Azad Jammu and Kashmir">Azad Jammu and Kashmir</option>
            </select>
            {errors.Province && (
              <p className="text-red-500 text-sm mt-1">{errors.Province.message}</p>
            )}
          </section>

        </div>

        {/* City */}
        <div className="mb-4">
          <section>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="City">
            City
          </label>
          <select
            className="text-black block w-full border rounded-lg px-3 py-2 cursor-pointer "
            id="City"
            {...register("City")}
          >
            <option className="text-black font-mono cursor-pointer" value="">---Select a city---</option>
            <option className="text-black font-mono cursor-pointer" value="Quetta">Quetta</option>
            <option className="text-black font-mono cursor-pointer" value="Gwadar">Gwadar</option>
            <option className="text-black font-mono cursor-pointer" value="Turbat">Turbat</option>
            <option className="text-black font-mono cursor-pointer" value="Kotli">Kotli</option>
            <option className="text-black font-mono cursor-pointer" value="Mirpur">Mirpur</option>
            <option className="text-black font-mono cursor-pointer" value="Muzaffarabad">Muzaffarabad</option>
            <option className="text-black font-mono cursor-pointer" value="Skardu">Skardu</option>
            <option className="text-black font-mono cursor-pointer" value="Gilgit">Gilgit</option>
            <option className="text-black font-mono cursor-pointer" value="Islamabad">Islamabad</option>
          </select>
          {errors.City && <p className="text-red-500 text-sm mt-1">{errors.City.message}</p>}
          </section>
        </div>

        {/* Building */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Building">
            Building
          </label>
          <input
            id="Building"
            {...register("Building")}
            className={`block w-full border rounded-lg px-3 py-2 text-black ${errors.Building ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter your building name"
          />
          {errors.Building && <p className="text-red-500 text-sm mt-1">{errors.Building.message}</p>}
        </div>

        {/* House No */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="HouseNo">
            House Number
          </label>
          <input
            id="HouseNo"
            {...register("HouseNo")}
            className={`block w-full border rounded-lg px-3 py-2 text-black ${errors.HouseNo ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter your house number"
          />
          {errors.HouseNo && <p className="text-red-500 text-sm mt-1">{errors.HouseNo.message}</p>}
        </div>

        {/* Floor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Floor">
            Floor
          </label>
          <input
            id="Floor"
            {...register("Floor")}
            className={`block w-full border text-black rounded-lg px-3 py-2 ${errors.Floor ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter your floor"
          />
          {errors.Floor && <p className="text-red-500 text-sm mt-1">{errors.Floor.message}</p>}
        </div>

        {/* Street */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Street">
            Street
          </label>
          <input
            id="Street"
            {...register("Street")}
            className={`block w-full border text-black rounded-lg px-3 py-2 ${errors.Street ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter your street name"
          />
          {errors.Street && <p className="text-red-500 text-sm mt-1">{errors.Street.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BuyingComponent;
