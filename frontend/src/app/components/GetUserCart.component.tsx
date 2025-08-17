import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { CartDataInterface, CartItemInterface } from '../utils/cartInterface'
import { useRouter } from 'next/navigation'


const GetUserCartComponent = () => {
    const API = process.env.NEXT_PUBLIC_API_URL

    const [userCart, setUserCart] = useState<CartDataInterface[]>([])
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [selectedItemsIds, setSelectedItemsIds] = useState<string[]>([]);
    const [productIdsAndQtyArr, setPoductIdsAndQtyArr] = useState<[{productId:string,quantity:number} ] | []>([]);
    const router = useRouter()


    const handleCheckboxChange = (itemId: string) => {
        setSelectedItemsIds((prev )=>

            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );

    }


    const proceedHandler = async () => {
        if (totalPrice > 0 && productIdsAndQtyArr.length !== 0) {

            router.push(`/payment-cashier?p=${totalPrice}&ids=${encodeURIComponent(
    JSON.stringify(productIdsAndQtyArr)
  )}`)
        }
    }
    const getUserCart = async () => {
        try {

            const res = await axios.get(`${API}/get-cart-data`, { withCredentials: true })
            const cartData = res.data.data
            const productIdsAndQty = cartData.flatMap((cart:CartDataInterface) =>
    cart.cartItems.map((p: CartItemInterface) => ({
      productId: p.product._id,
      quantity: p.quantity,
    }))
  );
           
            let filterCheckOutProductsId
            if (productIdsAndQty) {

                filterCheckOutProductsId = productIdsAndQty.filter((p: {productId:string}) => selectedItemsIds.includes(p.productId))
            }
            setPoductIdsAndQtyArr(filterCheckOutProductsId!)
            const totalPrice = cartData
                .flatMap((cart: CartDataInterface) =>
                    cart.cartItems.filter((item: CartItemInterface) =>
                        selectedItemsIds.includes(item.product._id)
                    ))
                .reduce((sum: number, item: CartItemInterface) => sum + item.price, 0);
           
            setTotalPrice(totalPrice)
            setUserCart(res.data.data)
        } catch (_error) {
            console.log('get cart error', _error)
        }
    }
    useEffect(() => {
        getUserCart()
    }, [API, selectedItemsIds])
    return (
        <>
        {
            userCart.length===0 &&
             (
  <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 text-gray-400 mb-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"
      />
    </svg>
    <h3 className="text-lg font-semibold text-gray-700">Your cart is empty</h3>
    <p className="text-sm text-gray-500 mt-2">
      Looks like you haven&rsquo;t added any items yet.
    </p>
    <button
      onClick={() => router.push("/")}
      className="mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
    >
      Start Shopping
    </button>
  </div>
)

        }
            <div className="animate-fadeIn">
                
                {
                    userCart &&
                    userCart.map((cart: CartDataInterface) => (

                        <div key={cart._id} className="bg-purple-50 rounded-xl p-4">

                            {
                                cart.cartItems.map((cartItem: CartItemInterface) => (
                                    <React.Fragment key={cartItem._id}>

                                        <div>
                                            <input
                                                id={cart._id}
                                                checked={selectedItemsIds.includes(cartItem.product._id)}
                                                onChange={() => handleCheckboxChange(cartItem.product._id)}
                                                className='w-10 h-10'
                                                type="checkbox" />
                                        </div>
                                        <div className="flex items-center">
                                            <Image src={cartItem.product.image} width={60} height={60} alt="product-img" />
                                            <div className="ml-4">
                                                <p className="font-medium text-gray-800">{cartItem.product.title}</p>
                                                <p className="text-gray-600 text-sm">{cartItem.product.description}</p>
                                                <p className="text-gray-600 text-sm">qty: {' '}{cartItem.quantity}</p>
                                                <p className="text-gray-600 text-sm">price: {' '}{cartItem.product.price}</p>
                                            </div>
                                            <div className="ml-auto flex items-center">
                                                <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-700">-</span>
                                                </button>
                                                <span className="mx-3 font-medium text-black">{cartItem.quantity}</span>
                                                <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-700">+</span>
                                                </button>
                                            </div>
                                            <span className="ml-6 font-bold text-gray-900">${cartItem.price}</span>
                                        </div>
                                    </React.Fragment>
                                ))
                            }


                        </div>
                    ))
                }
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <p className="font-medium text-gray-800">Total: <span className="font-bold text-lg text-purple-700">${totalPrice}</span></p>
                    <button onClick={proceedHandler} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                        PROCEED TO CHECKOUT
                    </button>
                </div>
            </div>
        </>
    )
}

export default GetUserCartComponent
