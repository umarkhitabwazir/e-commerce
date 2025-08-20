'use client'
import React from 'react'
import PaymentComponent from '@/app/components/Payment.component'
import GoBackComponent from '@/app/components/GoBack.component'

const page = () => {
  
  return (
    <div className='flex  '>
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
