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
        const searchParams=useSearchParams()
        const quantity=searchParams.get('q')
        const product=searchParams.get('product')
        const isQuantity=quantity? quantity : ""
        const isProduct=product? product : ""
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

                    setUser(response.data.data); // Set user data
                } catch (error) {

                    router.push(`/login?track=${trackPath || "/"}&q=${isQuantity}&product=${isProduct} `);
                }
            };

            checkAuth();
        }, [API_URL, router, trackPath]);

        // Show a loading spinner or fallback UI while user data is loading
        if (!user) return <div>Loading...</div>;

        // Pass the user as a prop to the wrapped component
        return <WrappedComponent {...(props as P)} user={user} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
