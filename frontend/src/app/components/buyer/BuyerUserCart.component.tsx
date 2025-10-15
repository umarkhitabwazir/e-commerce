'use client'
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CartDataInterface, CartItemInterface } from "../../utils/cartInterface";
import { useRouter } from "next/navigation";

const GetUserCartComponent = () => {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [userCart, setUserCart] = useState<CartDataInterface[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedItemsIds, setSelectedItemsIds] = useState<string[]>([]);
  const [productIdsAndQtyArr, setProductIdsAndQtyArr] = useState<
    { productId: string; quantity: number }[]
  >([]);

  const router = useRouter();

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItemsIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const proceedHandler = () => {
    if (totalPrice > 0 && productIdsAndQtyArr.length > 0) {

      router.push(
        `/buyer/payment-cashier?query=${btoa(JSON.stringify({ totalPrice, productIdsAndQtyArr }))} `
      );


    }
  };

  // fetch cart data once
  const getUserCart = async () => {
    const res = await axios.get(`${API}/get-cart-data`, {
      withCredentials: true,
    });
    return setUserCart(res.data.data);
  };

  useEffect(() => {
    getUserCart();
  }, []);

  useEffect(() => {
    if (!userCart || userCart.length === 0) {
      setProductIdsAndQtyArr([]);
      setTotalPrice(0);
      return;
    }
    const removeDeletedProducts = userCart.filter((cart: { deleted: boolean }) => !cart.deleted)
    const productIdsAndQty = removeDeletedProducts.flatMap((cart: CartDataInterface) =>
      cart.cartItems.map((p: CartItemInterface) => ({
        productId: p.product._id,
        quantity: p.quantity,
      }))
    );

    const filteredProducts = productIdsAndQty.filter((p) =>
      selectedItemsIds.includes(p.productId)
    );
    setProductIdsAndQtyArr(filteredProducts);

    const total = removeDeletedProducts
      .flatMap((cart: CartDataInterface) =>
        cart.cartItems.filter((item: CartItemInterface) =>
          selectedItemsIds.includes(item.product._id)
        )
      )
      .reduce((sum: number, item: CartItemInterface) => sum + item.price, 0);

    setTotalPrice(total);
  }, [userCart, selectedItemsIds]);


  const removeCartHandler = async (cartId: string) => {
    try {
      await axios.delete(`${API}/delete-cart/${cartId}`, { withCredentials: true })
      await getUserCart()

    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.log('cart error', err.message)
        return
      }
    }
  }

  return (
    <>
      {userCart.length === 0 ? (
        <div className="flex flex-wrap flex-col items-center justify-center p-8 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">
            Your cart is empty
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Looks like you haven’t added any items yet.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="animate-fadeIn ">
          {userCart.map((cart: CartDataInterface) => (
            <div key={cart._id}
              className={`
                ${cart.deleted
                  ? "bg-red-100 border border-red-400"
                  : 'bg-purple-50'}   rounded-xl p-4 mb-4`}>

              {
                cart.deleted
                  ?
                  (
                    <div className="flex items-center justify-between h-20 px-4 ">
                      <p className="text-sm font-medium text-red-700">
                        This item is no longer available in your cart.
                      </p>
                      <button
                        onClick={() => removeCartHandler(cart._id)}
                        className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors">
                        Remove
                      </button>
                    </div>

                  )
                  :
                  cart.cartItems.map((cartItem: CartItemInterface) => (
                    <div
                      key={cartItem._id}
                      className="flex justify-between  flex-wrap items-center gap-3 border-b border-gray-200 "
                    >
                      <input
                        checked={selectedItemsIds.length !== 0 && selectedItemsIds.includes(cartItem.product._id)}
                        onChange={() =>
                          handleCheckboxChange(cartItem.product._id)
                        }
                        className="w-5 h-5 mr-4 cursor-pointer"
                        type="checkbox"
                      />
                      <Image
                      className="md:w-auto w-full h-auto rounded-lg"
                        src={cartItem.product.image}
                        width={60}
                        height={60}
                        alt="product-img"
                      />
                      <div className="ml-4 flex flex-1 flex-col">
                        <p className="font-medium text-gray-800">
                          {cartItem.product.title}
                        </p>
                        <p className="text-gray-600 text-sm">
                          qty: {cartItem.quantity}
                        </p>
                        <p className="text-gray-600 text-sm">
                          price: ${cartItem.product.price}
                        </p>
                      </div>
                      
                      <div >
                        <button
                          onClick={() => removeCartHandler(cart._id)}
                          className="text-sm font-semibold w-full text-red-600 hover:text-red-800 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
              }
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between flex-col items-center">
            <p className="font-medium text-gray-800">
              Total:{" "}
              <span className="font-bold text-lg text-purple-700">
                ${totalPrice}
              </span>
            </p>
            <button
              onClick={proceedHandler}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GetUserCartComponent;
