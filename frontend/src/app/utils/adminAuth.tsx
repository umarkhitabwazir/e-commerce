"use client";
import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';
import { UserInterface } from './user.interface';
interface adminAuthProps {
    user:UserInterface
}
const adminAuth = <P extends adminAuthProps>(AdminComponent: React.ComponentType<P>) => {
    const AdminAuthComponent = (props: Omit<P, "user">) => {
        const [user, setUser] = useState<adminAuthProps["user"] | null>(null);
        const API_URL = process.env.NEXT_PUBLIC_API_URL


        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axios.get(`${API_URL}/get-logined-user`, {
                        withCredentials: true,
                    });
                    const newUser = response.data?.data ;
                    if (!newUser) {
                        setUser(null)
                    }

                    
                        setUser(newUser)
                    
                } catch (error: unknown) {
                    if (error instanceof AxiosError) {

                       return null
                    }
                }
            };
            checkAuth();

        }, [ API_URL]);

      
        return <AdminComponent {...props as P} user={user} />;
    }
    return AdminAuthComponent
}

export default adminAuth
