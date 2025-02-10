import Image from 'next/image'
import React from 'react'

const NoInternetComponent = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex flex-col justify-center items-center z-50">
            <div>
                <Image className="text-black rounded-md" src="/nointernet.jpeg" width={70} height={70} alt="no-internet" />
            </div>
            <p className="text-black text-lg mt-4 border-t-black ">network problem,Unable to reach the server.</p>
        </div>
  )
}

export default NoInternetComponent
