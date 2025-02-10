"use client";
import React, { Suspense } from 'react'
import Products from './components/Products.component'
import adminAuth from './utils/adminAuth'
import AdminHomePageComponent from './components/AdminHomePage.component';
type user = {
  username: string
  email: string
  fullName: string
  role: string
  password: string
  address: string
  phone: number

}

const HomePage = ({ user }: {
  user: user

}
) => {
  const role = ["admin", "superadmin"]
  let roleAuth
  if (user) {
    roleAuth = role.includes(user.role)
  }


  return (
    <div className='bg-bgGray '>
      {
        roleAuth ? <AdminHomePageComponent /> :
          <Products />
      }

    </div>
  )
}

const WrappedHomePage = adminAuth(HomePage);

const Page = () => (
  <Suspense fallback={<div
  className='fixed  top-0 left-0 w-full h-full bg-white bg-opacity-80  flex-col justify-center items-center z-50'
  >Loading...</div>}>
    <WrappedHomePage />
  </Suspense>
);

export default Page
