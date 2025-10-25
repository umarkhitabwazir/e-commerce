import { AddressFormData, AddressSchema } from '@/app/utils/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { provinces,citiesByProvince} from "../../constants/locationData"


type AddressInterface = {
  Province: string,
  City: string,
  Building: string,
  HouseNo: string,
  Floor: string,
  Street: string
}
const Address = {
  Province: "",
  City: "",
  Building: "",
  HouseNo: "",
  Floor: "",
  Street: ""
}
const AddressComponent = () => {
  const [editAddress, setEditAddress] = useState(false);
  const [formData, setFormData] = useState<AddressInterface | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [address, setAddress] = useState(Address)
  const [savedAddress, setSavedAddress] = useState<boolean>(false)
  const [formToggle, setFormToggle] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedProvince, setSelectedProvince] = useState("");
const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(AddressSchema),
  });


useEffect(() => {
  if (address?.Province) {
    setSelectedProvince(address.Province)
    const citiesByProvinceKey = address.Province as keyof typeof citiesByProvince

    setFilteredCities(citiesByProvince[citiesByProvinceKey ] || [])
  } else {
    setFilteredCities([])
  }
}, [editAddress, address])





  const getAddress = async () => {

    try {
      const res = await axios.get(`${API_URL}/find-address`, { withCredentials: true })
      if (res.data.success) {
        setSavedAddress(true)


        setAddress(res.data.data)

      }


    } catch (error: unknown) {
      if (error instanceof AxiosError) {

        if (!error.response?.data.success) {
          setSavedAddress(false)

        }
      }

    }
  };
  useEffect(() => {
    getAddress()
  }, []);

  const handleFormToggle = () => {
    setFormToggle((prev) => !prev)
  }

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries()) as unknown as AddressInterface;
    setFormData(data);
    setEditAddress(false);
    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/edit-address`, data, { withCredentials: true })
    await getAddress()
    setLoading(false)

  };
  const onSubmit = async (data: AddressFormData) => {
    setLoading(true)
    try {

      await axios.post(`${API_URL}/address`, data, { withCredentials: true })
      setFormToggle((prev) => !prev)
      setLoading(false)

      await getAddress()


    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setLoading(false)
        return;
      }
    }
  };


  return (
    <>


      <div
        className={`${savedAddress ? 'rounded-lg shadow-lg' : 'w-0'}bg-transparent mt-10 p-6  w-full max-w-lg mx-auto transition-all duration-300`}
      >
        {
          !savedAddress &&
          <div className=''>


            <button
              onClick={handleFormToggle}
              className={`${"bg-blue-700 w-full max-w-lg   text-white z-1 px-6 py-3  rounded-lg flex justify-center items-center hover:bg-blue-800 "} `}
            >
              Add Shipping Address
            </button>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`${formToggle ? "flex" : "hidden"} 
    fixed inset-0 z-50 bg-black/50 justify-center items-center`}
            >
              <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
                <div className="absolute top-3 right-3">
                  <Image
                    onClick={handleFormToggle}
                    className="cursor-pointer rounded-full"
                    src="/cross.jpg"
                    alt="close"
                    width={28}
                    height={28}
                  />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
                  Add Shipping Address

                </h1>

              
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
      onChange={(e) => {
        const province = e.target.value;
        const provinceKey = province as keyof typeof citiesByProvince;
        const cities = citiesByProvince[provinceKey] || [];
        setSelectedProvince(province);
        setFilteredCities(cities);
      }}
      className="w-full border rounded-md px-2 py-1 text-sm text-gray-700"
    >
      <option value="">Select Province</option>
      {provinces.map((province) => (
        <option key={province} value={province}>
          {province}
        </option>
      ))}
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
      disabled={!selectedProvince}
      className={`w-full border rounded-md px-2 py-1 text-sm text-gray-700 ${
        !selectedProvince ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    >
      <option value="">Select City</option>
      {filteredCities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
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
                      placeholder="e.g. G16/3 Street 48"

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
                  {loading ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        }


        {!editAddress && savedAddress && (
          <div className="space-y-4 text-white">
            <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
              Shipping Address
            </h1>
            {[
              { label: "Province", value: formData?.Province || address.Province },
              { label: "City", value: formData?.City || address.City },
              { label: "Street", value: formData?.Street || address.Street || "None" },
              { label: "Building", value: formData?.Building || address.Building || "None" },
              { label: "House No", value: formData?.HouseNo || address.HouseNo },
              { label: "Floor", value: formData?.Floor || address.Floor || "None" },
            ].map((field, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-gray-700 tracking-wide">
                  {field.label}:
                </span>
                <span className="text-base text-gray-600 text-right font-medium max-w-[60%]">
                  {field.value}
                </span>
              </div>
            ))}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setEditAddress(true)}
                className="bg-blue-700 w-full hover:bg-blue-800 text-white font-medium py-2 px-4 rounded "
              >
                Edit Address
              </button>
            </div>
          </div>
        )}

       {editAddress && (
  <form className="space-y-4 text-white" onSubmit={handleSaveAddress}>
    {/* Province */}
    <div className="flex justify-between items-baseline">
      <label
        htmlFor="Province"
        className="text-sm font-medium text-black tracking-wide"
      >
        Province:
      </label>
      <select
        id="Province"
        name="Province"
        value={selectedProvince}
        onChange={(e) => {
          const prov = e.target.value
          const citiesByProvinceKey = prov as keyof typeof citiesByProvince
          setSelectedProvince(prov)
          setFilteredCities(citiesByProvince[citiesByProvinceKey] || [])
          const cityEl = document.getElementById("City") as HTMLSelectElement
          if (cityEl) cityEl.value = ""
        }}
        className="text-base text-black font-medium w-3/5 p-2 rounded outline-none border border-gray-300"
      >
        <option value="">Select Province</option>
        {provinces.map((prov) => (
          <option key={prov} value={prov}>
            {prov}
          </option>
        ))}
      </select>
    </div>

    {/* City */}
    <div className="flex justify-between items-baseline">
      <label
        htmlFor="City"
        className="text-sm font-medium text-black tracking-wide"
      >
        City:
      </label>
      <select
        id="City"
        name="City"
        defaultValue={address.City || ""}
        className="text-base text-black font-medium w-3/5 p-2 rounded outline-none border border-gray-300"
        disabled={!selectedProvince}
      >
        <option value="">Select City</option>
        {filteredCities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>

    {/* Remaining Fields */}
    {[
      { name: "Street", label: "Street", value: address.Street },
      { name: "Building", label: "Building", value: address.Building },
      { name: "HouseNo", label: "House No", value: address.HouseNo },
      { name: "Floor", label: "Floor", value: address.Floor },
    ].map((field, index) => (
      <div key={index} className="flex justify-between items-baseline">
        <label
          htmlFor={field.name}
          className="text-sm font-medium text-black tracking-wide"
        >
          {field.label}:
        </label>
        <input
          id={field.name}
          name={field.name}
          placeholder={`Enter ${field.label}`}
          type="text"
          defaultValue={field.value}
          className="text-base text-black font-medium w-3/5 p-2 rounded outline-none border border-gray-300"
        />
      </div>
    ))}

    <div className="mt-6 flex justify-end">
      <button
        type="submit"
        className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded w-full"
      >
        Save Address
      </button>
    </div>
  </form>
)}

      </div>


    </>
  );
};

export default AddressComponent;