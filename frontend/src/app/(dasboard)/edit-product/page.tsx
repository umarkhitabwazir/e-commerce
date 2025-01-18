"use client"
import EditProductComponent from '@/app/components/EditProduct.component'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const page = () => {
    let searchParams=useSearchParams()
    let productId=searchParams.get("product")
    console.log(productId)
  return (
    <div>
      <EditProductComponent productId={productId}/>
    </div>
  )
}

export default page
