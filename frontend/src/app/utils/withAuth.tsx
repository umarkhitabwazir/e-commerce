"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import NoInternetComponent from "../components/NoInternet.component";
import { UserInterface } from "./user.interface";
interface WithAuthProps {
    user: UserInterface
}

const withAuth = <P extends WithAuthProps>(
    WrappedComponent: React.ComponentType<P>
) => {
    const AuthenticatedComponent = (props: Omit<P, "user">) => {
        const router = useRouter();
        const [user, setUser] = useState<WithAuthProps | null>(null);
        const [networkError, setNetworkError] = useState(false);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const authRoutes = useMemo( ()=>["/login", "/register","/log-out"],[])
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
                } catch (error: unknown) {
                  if (error instanceof AxiosError) {
                      if (error.code === "ERR_NETWORK") {
                          setNetworkError(true);
                        
                          return; 
                      }
                      console.log('error?.response?',error?.response?.status===401 && !isAuthRoutes)
                      const redirectPath = isAuthRoutes ? "/" : trackPath;
                      if (error?.response?.status===401 && !isAuthRoutes) {
                        router.push(
                            `/login?track=${
                                redirectPath || "/"
                            }&q=${isQuantity}&product=${isProduct}&p=${isProductPrice}`
                        );
                      }
                  }

              
                } finally {
                }
            };

            checkAuth();
        }, [API_URL, router, trackPath,authRoutes, isAuthRoutes, isProduct, isProductPrice, isQuantity, roleAuth]);

        
        if (networkError) {
            return <NoInternetComponent/>
        }

      
     


        if (!user) {
            return null;
        }

        return <WrappedComponent {...(props as P)} user={user} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
