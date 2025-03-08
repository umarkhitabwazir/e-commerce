'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
type Category={
    _id: string,
     categoryName: string
}
const CategoryComponent = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [category, setCategory] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        let fetchCategory = async () => {
            try {
                const res = await axios.get(`${API_URL}/all-category-list`)
                const data = res.data.data
                setCategory(data)
            } catch (error: unknown) {
                setLoading(false)

            } finally {
                setLoading(false)
            }
        }
        fetchCategory()
    }, [API_URL, setCategory,setLoading])

    return (

        <div className='bg-gray-800 h-60 w-60 flex flex-col absolute justify-center overflow-y-auto'>

            {
                loading ?
                    <div className='flex justify-center items-center'>
                        <h2>loading...</h2>
                    </div>
                    :
                    category.length <= 0 ?
                        <h1 className='text-white'>category not founded</h1> :
                        <div className='flex flex-col justify-center relative bottom-4 items-center'>
                            {category.map((category:Category) => (
                                <div
                                    key={category._id}>

                                    <h3 className='cursor-pointer hover:text-gray-400'
                                    >{category.categoryName}</h3>
                                </div>
                            ))}
                        </div>
            }


        </div>
    )
}

export default CategoryComponent
