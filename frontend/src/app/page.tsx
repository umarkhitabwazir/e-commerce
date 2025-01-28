"use client";
import React from 'react'
import Products from './components/Products.component'
import adminAuth from './utils/adminAuth'
import AdminDashboardComponent from './components/AdminDashboard.component';
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

const homePage = ({ user }: {
  user: user

}
) => {
  let role = ["admin", "superadmin"]
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

export default adminAuth(homePage)
