"use client"
import { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"
import { UserInterface } from "../utils/user.interface"

export const useAuth = () => {
  const [user, setUser] = useState<UserInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/get-logined-user`, {
          withCredentials: true,
        })
        setUser(res.data.data)
      } catch (err: unknown) {
                 if (err instanceof AxiosError) {
     
          
                   setError(err?.response?.data?.message  || "Failed to fetch user")
        }
      
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}
export default useAuth