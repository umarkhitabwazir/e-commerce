import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import axios from "axios";

interface WithAuthProps {
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

const withAuth = <P extends WithAuthProps>(WrappedComponent: React.ComponentType<P>) => {
    const AuthenticatedComponent = (props: Omit<P, "user">) => {

        const router = useRouter();
        const [user, setUser] = useState<any | null>(null);
        const API_URL = process.env.NEXT_PUBLIC_API_URL



        const trackPath = usePathname()
        const secureRoute = ["/create-product","/my-products"]
        const roleAuth = secureRoute.includes(trackPath)
console.log("roleAuth",roleAuth)
        const searchParams = useSearchParams()
        const quantity = searchParams.get('q')
        const product = searchParams.get('product')
        const isQuantity = quantity ? quantity : ""
        const productPrice = searchParams.get('p')
        const isProduct = product ? product : ""
        const isProductPrice = productPrice ? productPrice : ""
        // console.log("product",product)
        useEffect(() => {
            const checkAuth = async () => {
                try {

                    const response = await axios.get(`${API_URL}/get-logined-user`, {
                        withCredentials: true,
                    });

                    if (!response.data) {
                        throw new Error("User not logged in");
                    }
                    if (roleAuth) {
const userRole=response.data.data.role
const role=["superadmin","admin"]
if (!role.includes(userRole)) {
 return  router.push("/")
}
                    }

                    setUser(response.data.data);
                } catch (error) {
                    console.log("error", error)
                    router.push(`/login?track=${trackPath || "/"}&q=${isQuantity}&product=${isProduct}&p=${isProductPrice} `);
                }
            };

            checkAuth();
        }, [API_URL, router, trackPath]);

        // Show a loading spinner or fallback UI while user data is loading
        if (!user) return <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex flex-col justify-center items-center z-50">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 border-b-blue-500 rounded-full animate-spin"></div>
            <p className="text-black text-lg mt-4 border-t-black ">loading...</p>
        </div>

        // Pass the user as a prop to the wrapped component
        return <WrappedComponent {...(props as P)} user={user} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
