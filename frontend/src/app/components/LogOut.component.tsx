"use client"
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import withAuth from '../utils/withAuth'

const LogOutComponent = () => {
    const pathName = usePathname()
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    useEffect(() => {
        if (pathName === "/log-out") {
            const logOut = async () => {
                setLoading(true)
                try {
                    

                        let res=await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true })
                    console.log('res.data',res)

                    setLoading(false)
                    router.push(`${LOCAL_HOST}/`)

                } catch (error) {
                    console.log('logOutError', error)
                }
            }
            logOut()
        }
    }, [API_URL, pathName, LOCAL_HOST, router])

    return (
        loading && <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex flex-col justify-center items-center z-50">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-black text-lg mt-4 border-t-black ">loading...</p>
        </div>
    )
}

export default withAuth(LogOutComponent)
