import React from 'react'

const Loading = () => {
  return (
    <div className="fixed hidden top-0 left-0 w-full h-full bg-white bg-opacity-80  flex-col justify-center items-center z-50">

      <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 border-b-blue-500 rounded-full animate-spin"></div>
      <p className="text-black text-lg mt-4 border-t-black ">loading...</p>



    </div>
  )
}

export default Loading
