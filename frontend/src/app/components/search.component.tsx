'use client'
import React, { useCallback, useEffect, useState } from 'react'
import {ProductInterface } from '../utils/productsInterface'
import { useRouter, useSearchParams } from 'next/navigation';

const SearchComponent = ({
    product,
    isProductSearched,
    setIsProductSearched
}: { 
    product: ProductInterface[] | null, 
    isProductSearched: boolean,
    setIsProductSearched: React.Dispatch<React.SetStateAction<boolean>> 
}) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    
    const fetchData =useCallback( async () => {
 
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
    
    
      },[])
      useEffect(() => {
        fetchData();
      }, [ fetchData]);

    return (
        <div className={ `${isProductSearched?"hidden":loading?"hidden":""} text-black z-50 bg-gray-300 rounded-md absolute w-full h-64 flex flex-col justify-center 
            items-center overflow-y-auto`}>
            
            {product?.length === 0 && <h1>No product found</h1>}

            {product?.map((product: ProductInterface) => (
                <div key={product._id} className='w-1/2 h-1/2 flex flex-col justify-center items-center'>
                    <h1 
                        onClick={() => {
                            updatedSearchParams.set('search', product.title);
                            router.push(`?${updatedSearchParams.toString()}`);
                            setIsProductSearched(true);
                        }} 
                        className='cursor-pointer hover:text-blue-500'
                    >
                        {product.title}
                    </h1>
                </div>
            ))}
        </div>
    );
}

export default SearchComponent;
