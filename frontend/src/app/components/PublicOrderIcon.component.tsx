import { useRouter } from 'next/navigation'
import React from 'react'

const PublicOrderIconComponent = () => {
    const router = useRouter()

  return (
 <div className="relative">
  <button
    title="Orders"
    onClick={() => router.push("/login?track=/buyer/orders")}
    className="relative p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors group focus:outline-none focus:ring-2 focus:ring-cyan-500"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-200 group-hover:text-white transition-colors"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>    
 
  </button>
</div>
  )
}

export default PublicOrderIconComponent
