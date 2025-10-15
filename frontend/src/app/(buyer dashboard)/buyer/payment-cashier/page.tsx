'use client'
import React from 'react'
import PaymentComponent from '@/app/components/buyer/Payment.component'
import GoBackComponent from '@/app/components/GoBack.component'

const page = () => {
  
  return (
    <div className='flex flex-wrap   w-full min-h-screen '>
      <div>
        
      <GoBackComponent />
      </div>
      <div>

      <PaymentComponent />
      </div>

    </div>
  )
}

export default page
