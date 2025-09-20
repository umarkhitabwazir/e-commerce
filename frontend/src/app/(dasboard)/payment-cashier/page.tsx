'use client'
import React from 'react'
import PaymentComponent from '@/app/components/Payment.component'
import GoBackComponent from '@/app/components/GoBack.component'

const page = () => {
  
  return (
    <div className='flex flex-wrap justify-between bg-payment-cashier-bg bg-cover w-full min-h-screen '>
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
