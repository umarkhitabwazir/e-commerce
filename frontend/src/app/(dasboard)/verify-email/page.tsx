"use client"
import React from 'react'
import VerifyEmail from '@/app/components/EmailVerify.component'
import { useSearchParams } from 'next/navigation'
const EmailVerify = () => {
    let searchParams=useSearchParams()
    let email=searchParams.get("email")
  return (
    <div className='bg-gray-400'>
      <VerifyEmail email={email}/>
    </div>
  )
}

export default EmailVerify
