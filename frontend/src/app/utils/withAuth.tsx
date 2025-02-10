"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import axios from "axios";
import Loading from "../components/Loading.component";
import NoInternetComponent from "../components/NoInternet.component";

interface WithAuthProps {
    user: {
        username: string;
        email: string;
        fullName: string;
        role: string;
        password: string;
        address: string;
        phone: number;
    };
}

const withAuth = <P extends WithAuthProps>(
    WrappedComponent: React.ComponentType<P>
) => {
    const AuthenticatedComponent = (props: Omit<P, "user">) => {
        const router = useRouter();
        const [user, setUser] = useState<any | null>(null);
        const [loading, setLoading] = useState(true);
        const [networkError, setNetworkError] = useState(false);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const authRoutes = ["/login", "/register"];
        const trackPath = usePathname();
        const isAuthRoutes = authRoutes.includes(trackPath);
        
        const secureRoute = ["/create-product", "/my-products"];
        const roleAuth = secureRoute.includes(trackPath);
        const searchParams = useSearchParams();
        const quantity = searchParams.get("q");
        const product = searchParams.get("product");
        const productPrice = searchParams.get("p");

        const isQuantity = quantity || "";
        const isProduct = product || "";
        const isProductPrice = productPrice || "";

        useEffect(() => {
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
                        const allowedRoles = ["superadmin", "admin"];
                        if (!allowedRoles.includes(userRole)) {
                            router.push("/");
                            return;
                        }
                    }

                    setUser(response.data.data);
                } catch (error: any) {
                    console.log('nextwork error',error)
                    if (error.code === "ERR_NETWORK") {
                        setNetworkError(true);
                        console.log('error',error)
                        return; // Do not push to login yet, show Loading
                    }

                    const redirectPath = isAuthRoutes ? "/" : trackPath;
                  if (!authRoutes) {
                    router.push(
                        `/login?track=${
                            redirectPath || "/"
                        }&q=${isQuantity}&product=${isProduct}&p=${isProductPrice}`
                    );
                  }
                } finally {
                    setLoading(false);
                }
            };

            checkAuth();
        }, [API_URL, router, trackPath]);

        
        if (networkError) {
            return <NoInternetComponent/>
        }

      
        if (loading) {
            return <Loading />
        }


        if (!user) {
            return null;
        }

        return <WrappedComponent {...(props as P)} user={user} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
