import React from 'react'

const addressComponent = ({address}:{address:any}) => {
  return (
   <>
   <div className="bg-white mt-10 p-5 rounded-lg shadow-md max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Delivery Address</h1>
            <div className="space-y-1  flex flex-row flex-wrap justify-between items-center">
              <div>

                <h1 className="font-semibold text-gray-800">Name:</h1>
                <h3 className="text-lg text-gray-700 font-medium "> {address.fullName}</h3>

              </div>
              <div>

                <h1 className="font-semibold text-gray-800">Phone:</h1>
                <h3 className="text-lg text-gray-700 font-medium"> {address.phone}</h3>

              </div>
              <div>

                <h1 className="font-semibold text-gray-800">Province:</h1>
                <h3 className="text-lg text-gray-700 font-medium">{address.Province}</h3>

              </div>
              <div>

                <h1 className="font-semibold text-gray-800">City:</h1>
                <h3 className="text-lg text-gray-700 font-medium"> {address.City}</h3>

              </div>
              <div>

                <h1 className="font-semibold text-gray-800">Street:</h1>
                <h3 className="text-lg text-gray-700 font-medium"> {address.Street}</h3>
              </div>
              <div>

                <h1 className="font-semibold text-gray-800">Building:</h1>
                <h3 className="text-lg text-gray-700 font-medium"> {address.Building}</h3>
              </div>
              <div>

                <h1 className="font-semibold text-gray-800">House No:</h1>
                <h3 className="text-lg text-gray-700 font-medium"> {address.HouseNo}</h3>
              </div>
              <div>

                <h1 className="font-semibold text-gray-800">Floor:</h1>
                <h3 className="text-lg text-gray-700 font-medium"> {address.Floor}</h3>
              </div>
              <h3 className="text-lg text-gray-700 font-medium">
              <span className="text-gray-500 mt-5 flex-nowrap">Location:</span>
              {`${address.Floor}, ${address.HouseNo}, ${address.Building}, ${address.City}, ${address.Province}`}
              </h3>

            </div>
          </div>
   </>
  )
}

export default addressComponent
