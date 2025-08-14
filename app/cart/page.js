"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/lib/CartContext"

export default function CartPage() {
  const { cart, setCart } = useCart();
  const router = useRouter();

  const handleQtyChange = (id, quantity) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)))
  }

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  // Remove subtotal, tax, shipping, total

  const handlePlaceOrder = () => {
    // Redirect to checkout page
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {cart.length === 0 ? (
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some items to get started</p>
                <Link
                  href="/shop"
                  className="inline-block bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quote Cart</h1>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-full sm:w-24 h-48 sm:h-24 relative bg-gray-100 rounded-xl overflow-hidden">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                                <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                                  {item.category}
                                </span>
                                {/* Remove price display */}
                              </div>

                              {/* Mobile Actions */}
                              <div className="flex items-center justify-between sm:justify-end gap-4 sm:flex-col sm:items-end sm:gap-3">
                                {/* Quantity Controls */}
                                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                                  <button
                                    className="h-10 w-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                                    className="w-16 h-10 text-center border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                                  />
                                  <button
                                    className="h-10 w-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                    onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>

                                <button
                                  className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                                  onClick={() => handleRemove(item.id)}
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="hidden sm:inline">Remove</span>
                                </button>
                              </div>
                            </div>

                            {/* Remove item total display */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>

                  {/* Remove subtotal, tax, shipping, total */}
                  <div className="space-y-4">
                    <div className="text-gray-600 text-sm">Review your selected items and click below to place your order.</div>
                  </div>

                  <button
                    className="w-full mt-6 bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>

                  <div className="mt-4 text-center">
                    <Link href="/shop" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      Secure order placement
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
