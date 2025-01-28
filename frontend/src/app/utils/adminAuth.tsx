"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
interface adminAuthProps {
    user: {
        username: string
        email: string
        fullName: string
        role: string
        password: string
        address: string
        phone: number

    }
}
const adminAuth = <P extends adminAuthProps>(AdminComponent: React.ComponentType<P>) => {
    const adminAuthComponent = (props: Omit<P, "user">) => {
        const router = useRouter();
        const [user, setUser] = useState<any | null>(null);
        const API_URL = process.env.NEXT_PUBLIC_API_URL

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axios.get(`${API_URL}/get-logined-user`, {
                        withCredentials: true,
                    });
                    console.log("adminAuthComponent", response.data.data)
                    if (!response.data) {
                        setUser(null)
                    }

                    if (response.data.data) {
                        setUser(response.data.data)
                        console.log("adminAuthComponent", response.data.data)
                    }
                } catch (error) {
console.log("adminAuthComponentError", error)
                    router.push("/");
                }
            };
            checkAuth();

        }, [ router, API_URL]);

        return <AdminComponent {...props as P} user={user} />;
    }
    return adminAuthComponent
}

export default adminAuth
