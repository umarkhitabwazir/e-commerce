import { Dispatch, SetStateAction, useState } from 'react';
import { FiX, FiMinus, FiPlus, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { ProductInterface } from '../utils/productsInterface';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CartPanel = ({
  product,
  setShowAddTocart
}: {
  product: ProductInterface,
  setShowAddTocart: Dispatch<SetStateAction<boolean>>
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router=useRouter()
  const API = process.env.NEXT_PUBLIC_API_URL

  const handleAddToCart = async () => {
    if (quantity < 1 || product.countInStock < 1) return;

    setIsAdding(true);
 
    try {
       await axios.post(
        `${API}/createCart`,
        {
          cartItem: [
            {
              product: product._id,
              quantity: quantity
            }
          ]
        },
        {
          withCredentials: true
        }
      )
router.push(`/your-orders?tab=cart`)
    } catch (_error: unknown) {

    }

    setTimeout(() => {
      setIsAdding(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }, 1000);
  };

  const increment = () => setQuantity(prev => Math.min(prev + 1, 3));
  const decrement = () => setQuantity(prev => Math.max(prev - 1, 1));
  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const closePanel = () => setShowAddTocart((prev) => !prev);

  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={closePanel}
      />

      {/* Cart Panel */}
      <div className="relative max-w-md w-full h-full bg-white shadow-xl z-50 flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Add to Cart</h2>
          <button
            onClick={closePanel}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <FiX size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Price Display */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-gray-500 line-through text-lg">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center">
              <span className={`text-sm font-medium ${isOutOfStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                {isOutOfStock
                  ? 'Out of Stock'
                  : product.countInStock > 5
                    ? 'In Stock'
                    : `Only ${product.countInStock} left`}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quantity
            </label>
            <div className="flex items-center max-w-[160px]">
              <button
                onClick={decrement}
                disabled={quantity <= 1}
                className={`p-3 rounded-l-lg border border-r-0 border-gray-300 ${quantity <= 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <FiMinus size={18} />
              </button>

              <input
                type="text"
                value={quantity}
                readOnly
                className="w-full py-3 text-center border-t border-b border-gray-300 text-gray-900 font-medium"
              />

              <button
                onClick={increment}
                disabled={quantity >= product.countInStock}
                className={`p-3 rounded-r-lg border border-l-0 border-gray-300 ${quantity >= product.countInStock
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <FiPlus size={18} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || isOutOfStock || isSuccess}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-medium transition-all duration-300 ${isOutOfStock
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : isSuccess
                  ? 'bg-emerald-500 text-white'
                  : isAdding
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {isAdding ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : isSuccess ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Added to Cart!
                </>
              ) : (
                <>
                  <FiShoppingCart size={20} />
                  Add to Cart
                </>
              )}
            </button>

            <button
              onClick={toggleFavorite}
              className={`p-4 flex items-center justify-center rounded-lg border ${isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <FiHeart
                size={20}
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Product Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              About this product
            </h3>
            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">Brand:</span>
              <span className="text-gray-600">{product.brand}</span>
            </div>
          </div>

          {/* Additional Features */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Benefits
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Free Shipping</h4>
                  <p className="text-sm text-gray-600">Delivered in 3-5 business days</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">30-Day Returns</h4>
                  <p className="text-sm text-gray-600">Money-back guarantee</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">24/7 Support</h4>
                  <p className="text-sm text-gray-600">Dedicated customer service</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={closePanel}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;