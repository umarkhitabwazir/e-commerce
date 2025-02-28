import React, { useState } from 'react'
import { ProductTypes } from '../utils/productsTypes'
import { useRouter, useSearchParams } from 'next/navigation';

const SearchComponent = ({
    product,
    isProductSearched,
    setIsProductSearched
}: { 
    product: ProductTypes[] | null, 
    isProductSearched: boolean,
    setIsProductSearched: React.Dispatch<React.SetStateAction<boolean>> 
}) => {
    console.log('isProductSearched', isProductSearched);
    const router = useRouter();
    const searchParams = useSearchParams();
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    

    return (
        <div className={ `${isProductSearched?"hidden":""} text-black z-50 bg-gray-300 rounded-md absolute w-full h-64 flex flex-col justify-center 
            items-center overflow-y-auto`}>
            
            {product?.length === 0 && <h1>No product found</h1>}

            {product?.map((product: ProductTypes) => (
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
