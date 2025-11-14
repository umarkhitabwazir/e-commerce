'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { ProductInterface } from '../../utils/productsInterface'
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

    const fetchData = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Calculate visibility
    const isVisible = !isProductSearched && !loading;

    return (
        <div className={`${!isVisible ? 'hidden' : 'block'} absolute w-full z-40 mt-1`}>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 max-h-64 overflow-y-auto">
                {product?.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500 text-center">
                        No products found
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {product?.map((product: ProductInterface) => (
                            <li
                                key={product._id}
                                className="px-4 py-3 transition-colors duration-150 hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                    updatedSearchParams.set('search', product.title);
                                    router.push(`?${updatedSearchParams.toString()}`);
                                    setIsProductSearched(true);
                                }}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-gray-800 font-medium truncate">
                                            {product.title}
                                        </p>
                                        {product.brand && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                brand{' '}:{' '}{product.brand}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default SearchComponent;