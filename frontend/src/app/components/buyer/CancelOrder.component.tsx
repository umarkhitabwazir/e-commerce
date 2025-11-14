'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ProductInterface } from '../../utils/productsInterface'
import { OrderInterface } from '../../utils/orderInterface'
import UserPaymentForm from './UserPaymentForm.component'

const CancelOrderComponent = ({
  cancelOrders,
  products,
}: {
  cancelOrders: OrderInterface[]
  products: ProductInterface[]
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  if (cancelOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl">
        <p className="text-sm text-gray-500 mt-2">
          You haven’t canceled any orders yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {cancelOrders.map((order) => {
        const showDetails = selectedOrderId === order._id

        return (
          <div key={order._id} className="border p-4 rounded-md bg-white shadow">
            <div className="flex flex-col flex-wrap justify-between items-center">
              <div className='flex flex-wrap justify-between items-center w-full'>
                <h2 className="font-semibold text-gray-700">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>

                <p className="text-sm text-gray-600">
                  Canceled on {' '}
                  {new Date(order.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`inline-block w-3 h-3 rounded-full ${order.cancelled ? 'bg-green-500' : 'bg-red-500'}  mr-2`}></span>
                  <span className={`text-sm ${order.cancelled ? 'text-green-700' : 'text-red-500'} `}>
                    {order.cancelled ? 'Cancelled' : 'pending'}
                  </span>
                </div>
              </div>



              <button
                onClick={() =>
                  setSelectedOrderId((prev) =>
                    prev === order._id ? null : order._id
                  )
                }
                className="bg-blue-500 text-white w-full px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {showDetails ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {showDetails && (
              <div className="mt-6 flex flex-wrap justify-between border-t pt-4">
                <div>
     {order.transactionId && <p className="text-sm text-gray-600 mb-1">
                  Refund Status:{' '}
                  <span
                    className={`font-medium ${order.refund ? 'text-green-500' : 'text-red-500'
                      }`}
                  >
                    {order.refund ? 'Refunded' : 'Pending'}
                  </span>
                </p>}

                <p className="text-sm text-gray-600 mb-1">
                  Transaction ID:{' '}
                  <span className="text-green-500 font-medium">
                    {order.transactionId || 'N/A'}
                  </span>
                </p>

                <p className="text-sm text-gray-600 mb-3">
                  Total Amount:{' '}
                  <span className="font-medium text-gray-800">
                    PKR {order.totalPrice.toFixed(2)}
                  </span>{' '}
                  (Tax: PKR {order.taxPrice.toFixed(2)}, Shipping: PKR{' '}
                  {order.shippingPrice.toFixed(2)})
                </p>
                <div className="flex flex-wrap gap-4 justify-start">
                  {order.products.map((orderProduct) => {
                    const product = products.find(
                      (p) => p._id === orderProduct.productId._id
                    )
                    if (!product) return null

                    return (
                      <div
                        key={orderProduct.productId._id}
                        className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50"
                      >
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <p className="text-gray-800 font-semibold">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            Price: PKR {product.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {orderProduct.quantity}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                </div>
           
{
  order.transactionId && order.cancelled  && !order.refund &&
                <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Refund will be issued to:
                    </p>
                  <UserPaymentForm />

                </div>
}
              </div>
            )}

          </div>
        )
      })}
    </div>
  )
}

export default CancelOrderComponent
