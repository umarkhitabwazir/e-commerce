"use client";
import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';
import { UserInterface } from '../utils/user.interface';
import { usePathname, useRouter } from 'next/navigation';

interface adminAuthProps {
    user: UserInterface
}
const superAdminAuth = <P extends adminAuthProps>(AdminComponent: React.ComponentType<P>) => {
    const AdminAuthComponent = (props: Omit<P, "user">) => {
        const [user, setUser] = useState<adminAuthProps["user"] | null>(null);
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const trackPath = usePathname();
        const secureRoute = ["/admin"];
        const roleAuth = secureRoute.some(route => trackPath.startsWith(route));
        const Roles=process.env.NEXT_PUBLIC_ROLES?.split(',') || []

        // const role=pr
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

                        
                        if (userRole!==Roles[0]) {
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

export default superAdminAuth
