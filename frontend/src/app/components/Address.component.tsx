import axios from 'axios';
import React, { useState } from 'react'

type Address = {
  fullName: string,
  Province: string,
  City: string,
  phone: number,
  Building: string,
  HouseNo: string,
  Floor: string,
  Street: string
}
const AddressComponent = ({ address, savedAddress }: { address: Address, savedAddress: boolean }) => {
   const [editAddress, setEditAddress] = useState(false);
  const [formData, setFormData] = useState<Address | null>(null);

  const handleSaveAddress =async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries()) as unknown as Address;
      setFormData(data);
      setEditAddress(false);
  await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/edit-address`,data,{withCredentials:true})
      
   };

  return (
    <div
      className={`${
        savedAddress ? "" : "hidden"
      } bg-transparent mt-10 p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto transition-all duration-300`}
    >
      <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
        Delivery Address
      </h1>

      {!editAddress && (
        <div className="space-y-4 text-white">
          {[
            { label: "Name", value: formData?.fullName || address.fullName },
            { label: "Phone", value: formData?.phone || address.phone },
            { label: "Province", value: formData?.Province || address.Province },
            { label: "City", value: formData?.City || address.City },
            { label: "Street", value: formData?.Street || address.Street || "None" },
            { label: "Building", value: formData?.Building || address.Building || "None" },
            { label: "House No", value: formData?.HouseNo || address.HouseNo },
            { label: "Floor", value: formData?.Floor || address.Floor || "None" },
          ].map((field, index) => (
            <div key={index} className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-gray-300 tracking-wide">
                {field.label}:
              </span>
              <span className="text-base text-white text-right font-medium max-w-[60%]">
                {field.value}
              </span>
            </div>
          ))}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setEditAddress(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded w-60"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {editAddress && (
        <form className="space-y-4 text-white" onSubmit={handleSaveAddress}>
          {[
            { name: "fullName", label: "Name", value: address.fullName },
            { name: "phone", label: "Phone", value: address.phone },
            { name: "Province", label: "Province", value: address.Province },
            { name: "City", label: "City", value: address.City },
            { name: "Street", label: "Street", value: address.Street },
            { name: "Building", label: "Building", value: address.Building },
            { name: "HouseNo", label: "House No", value: address.HouseNo },
            { name: "Floor", label: "Floor", value: address.Floor },
          ].map((field, index) => (
            <div key={index} className="flex justify-between items-baseline">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-gray-300 tracking-wide"
              >
                {field.label}:
              </label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                defaultValue={field.value}
                className="text-base text-black font-medium w-3/5 p-2 rounded outline-none"
              />
            </div>
          ))}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded w-60"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressComponent;