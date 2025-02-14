import React from 'react'

type Address={
  fullName: string,
  Province: string,
  City: string,
  phone: number,
  Building: string,
  HouseNo: string,
  Floor: string,
  Street: string
}
const AddressComponent = ({address,savedAddress}:{address:Address ,savedAddress:boolean}) => {
  return (
   <>
   <div className={`${savedAddress ? "" : "hidden"} bg-white mt-10 p-6 rounded-lg shadow-lg max-w-lg mx-auto transition-all duration-300`}>
  <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
    Delivery Address
  </h1>
  
  <div className="space-y-4 text-gray-700">
    {[
      { label: "Name", value: address.fullName },
      { label: "Phone", value: address.phone },
      { label: "Province", value: address.Province },
      { label: "City", value: address.City },
      { label: "Street", value: address.Street || "None" },
      { label: "Building", value: address.Building || "None" },
      { label: "House No", value: address.HouseNo },
      { label: "Floor", value: address.Floor || "None" },
    ].map((field, index) => (
      <div key={index} className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-gray-500 tracking-wide">
          {field.label}:
        </span>
        <span className="text-base text-gray-800 text-right font-medium max-w-[60%]">
          {field.value}
        </span>
      </div>
    ))}
    
    <div className="pt-4 mt-6 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        <span className="block font-medium mb-1">Full Location:</span>
        <span className="text-gray-600">
          {[
            address.Street,
            address.Floor,
            address.HouseNo,
            address.Building,
            address.City,
            address.Province
          ].filter(Boolean).join(", ") || "No location specified"}
        </span>
      </p>
    </div>
  </div>
</div>
   </>
  )
}

export default AddressComponent
