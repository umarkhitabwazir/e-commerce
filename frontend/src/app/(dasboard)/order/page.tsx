"use client"
import React from 'react'
import OrderComponent from '@/app/components/order.component'
import { useRouter } from 'next/navigation';
const order = () => {
  let router=useRouter()
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = getCookie('token'); // Check for token in cookies
    if (!token) {
      router.push('/login');
      return null;
    }
    return children;
  };
  console.log("ProtectedRoute",ProtectedRoute)
  
  return (
    <div>
      <OrderComponent/>
    </div>
  )
}

export default order
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

