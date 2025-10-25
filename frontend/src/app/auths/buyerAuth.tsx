"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import NoInternetComponent from "../components/NoInternet.component";
import { UserInterface } from "../utils/user.interface";
interface WithAuthProps {
    user: UserInterface
}

const buyerAuth = <P extends WithAuthProps>(
    WrappedComponent: React.ComponentType<P>
) => {
    const AuthenticatedComponent = (props: Omit<P, "user">) => {
        const router = useRouter();
        const [user, setUser] = useState<WithAuthProps | null>(null);
        const [networkError, setNetworkError] = useState(false);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const Roles=process.env.NEXT_PUBLIC_ROLES?.split(',') || []
        const pathName = usePathname();
        const authRoutes = useMemo(() => ["/login", "/sign-up", "/log-out"], [])
        const trackPath = usePathname();
        const isAuthRoutes = authRoutes.includes(trackPath);
        const secureRoute = ["/buyer"];
        const roleAuth = secureRoute.some(route => trackPath.startsWith(route));


        const searchParams = useSearchParams();
        const updatedSearchParams = new URLSearchParams(searchParams.toString())
        const publicRoutes = ["/privacy-policy", "/reset-password", "/verify-email", "/terms-and-conditions", "/ownership-statement", "/refund-return-policy", "/shipping-policy", "/", "/contact"].includes(pathName);

        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/get-logined-user`,
                    { withCredentials: true }
                );
                if (!response.data) {
                    throw new Error("User not logged in");
                }

                if (roleAuth) {
                    const userRole = response.data.data.role;
                    if (userRole === Roles[2]) {
                      alert("Access denied. Sellers cannot access buyer routes. Redirecting back.");

                        router.push(`/`);
                        return;
                    }

                    if (!publicRoutes && userRole !== Roles[1]) {
                        router.push(`${isAuthRoutes ? "/" : "/login"}?track=${trackPath}&${updatedSearchParams}`);
                        return;
                    }
                }

                setUser(response.data.data);
            } catch (error: unknown) {

                if (error instanceof AxiosError) {
                    if (error.code === "ERR_NETWORK") {
                        setNetworkError(true);

                        return null;
                    }
                    if (!publicRoutes && error?.response?.status === 401 && !isAuthRoutes) {
                        router.push(`/login?track=${trackPath}&${updatedSearchParams}`)
                    }
                    if (error?.response?.status === 403) {
                        router.push(`/verify-email?track=${trackPath}&${updatedSearchParams}`)
                    }
                }


            } finally {
            }
        };
        useEffect(() => {

            checkAuth();
        }, []);


        if (networkError) {
            return <NoInternetComponent />
        }





        if (!user) {
            return <WrappedComponent {...props as P} user={null} />;
        }

        return <WrappedComponent {...(props as P)} user={user} />;
    };

    return AuthenticatedComponent;
};

export default buyerAuth;
