"use client"
import React from 'react'
import OrderComponent from '@/app/components/order.component'
import GoBackComponent from '@/app/components/GoBack.component'

const order = () => {


  return (
    <div className='bg-product-bg bg-cover'>
      <GoBackComponent />

      <OrderComponent />



    </div>
  )
}

export default order


