"use client";
import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';
import { UserInterface } from '../utils/user.interface';
import { usePathname, useRouter } from 'next/navigation';
interface adminAuthProps {
    user: UserInterface
}
const sellerAuth = <P extends adminAuthProps>(AdminComponent: React.ComponentType<P>) => {
    const AdminAuthComponent = (props: Omit<P, "user">) => {
        const [user, setUser] = useState<adminAuthProps["user"] | null>(null);
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const trackPath = usePathname();
        const secureRoute = ["/seller"];
        const roleAuth = secureRoute.some(route => trackPath.startsWith(route));
        const router = useRouter()

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axios.get(`${API_URL}/get-logined-user`, {
                        withCredentials: true,
                    });
                    const user = response.data?.data;

                    if (!user) {
                        router.push("/login");
                    }
                    if (roleAuth) {
                        const userRole = response.data.data.role;
                        const allowedRoles = ["seller"];
                        if (!allowedRoles.includes(userRole)) {
                            router.push("/");
                            return;
                        }
                        setUser(user)
                    }


                } catch (error: unknown) {
                    if (error instanceof AxiosError) {

                        return null
                    }
                }
            };
            checkAuth();

        }, [API_URL]);


        return <AdminComponent {...props as P} user={user} />;
    }
    return AdminAuthComponent
}

export default sellerAuth
