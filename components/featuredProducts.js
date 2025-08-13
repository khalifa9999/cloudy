"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, ShoppingCart, Eye } from "lucide-react"

export default function FeaturedProducts() {
  const router = useRouter();

  const products = [
    {
      id: 1,
      name: "Nisi Ut Aliqu",
      image: "/placeholder.svg?height=200&width=200&text=Headlights",
      rating: 5,
      price: "60.00",
      originalPrice: "70.00",
      discount: null,
      priceRange: true,
    },
    {
      id: 2,
      name: "Totam Rem Aperiam",
      image: "/placeholder.svg?height=200&width=200&text=Red+Bumper",
      rating: 0,
      price: "79.00",
      originalPrice: null,
      discount: null,
      priceRange: false,
    },
    {
      id: 3,
      name: "Ut Enim Ad Mini",
      image: "/placeholder.svg?height=200&width=200&text=Brake+Disc",
      rating: 5,
      price: "66.00",
      originalPrice: "80.00",
      discount: 18,
      priceRange: false,
    },
    {
      id: 4,
      name: "Eaque Ipsa Quae",
      image: "/placeholder.svg?height=200&width=200&text=Mountain+Bike",
      rating: 0,
      price: "50.00",
      originalPrice: "88.00",
      discount: 43,
      priceRange: false,
    },
    {
      id: 5,
      name: "Beatae Vitae Dicta",
      image: "/placeholder.svg?height=200&width=200&text=Helmet",
      rating: 0,
      price: "150.00",
      originalPrice: null,
      discount: null,
      priceRange: false,
    },
    {
      id: 6,
      name: "Ut Labore Et Do",
      image: "/placeholder.svg?height=200&width=200&text=Exhaust",
      rating: 5,
      price: "50.00",
      originalPrice: "70.00",
      discount: null,
      priceRange: true,
    },
    {
      id: 7,
      name: "Ex Ea Com Modi",
      image: "/placeholder.svg?height=200&width=200&text=Alternator",
      rating: 0,
      price: "60.00",
      originalPrice: "70.00",
      discount: 14,
      priceRange: false,
    },
    {
      id: 8,
      name: "Beatae Vitae Dicta",
      image: "/placeholder.svg?height=200&width=200&text=Oil+Filter",
      rating: 5,
      price: "66.00",
      originalPrice: "72.00",
      discount: 8,
      priceRange: false,
    },
    {
      id: 9,
      name: "Ipsa Quae Ab",
      image: "/placeholder.svg?height=200&width=200&text=Brake+System",
      rating: 0,
      price: "50.00",
      originalPrice: "75.00",
      discount: null,
      priceRange: true,
    },
    {
      id: 10,
      name: "Quia Voluptas Sit",
      image: "/placeholder.svg?height=200&width=200&text=Motorcycle",
      rating: 0,
      price: "150.00",
      originalPrice: "200.00",
      discount: 25,
      priceRange: false,
    }
  ]

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4 lg:mb-0">
            <span className="text-red-500 mr-3 text-3xl">»»</span>
            FEATURE PRODUCTS
          </h2>

        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow group"
            >
              {/* Product Image */}
              <div className="relative aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden group/card">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-2 group-hover/card:scale-105 transition-transform"
                />
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                    -{product.discount}%
                  </div>
                )}

                {/* Desktop Hover Overlay - Buttons at bottom */}
                <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 p-2 hidden md:block">
                  <div className="flex space-x-2 backdrop-blur-sm bg-white/20 rounded-lg p-2">
                    <button 
                      onClick={() => router.push('/checkout')}
                      className="flex-1 bg-white/90 backdrop-blur-sm text-gray-800 py-2 px-2 rounded text-xs font-medium hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center space-x-1 shadow-lg"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      <span>Get Quote</span>
                    </button>
                    <button className="flex-1 bg-white/90 backdrop-blur-sm text-gray-800 py-2 px-2 rounded text-xs font-medium hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center space-x-1 shadow-lg">
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                  </div>
                </div>

                {/* Mobile - Always visible buttons at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-2 md:hidden">
                  <div className="flex space-x-2 backdrop-blur-sm bg-white/20 rounded-lg p-2">
                    <button 
                      onClick={() => router.push('/checkout')}
                      className="flex-1 bg-white/90 backdrop-blur-sm text-gray-800 py-2 px-2 rounded text-xs font-medium active:bg-red-500 active:text-white transition-colors flex items-center justify-center space-x-1 shadow-lg"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      <span>Cart</span>
                    </button>
                    <button className="flex-1 bg-white/90 backdrop-blur-sm text-gray-800 py-2 px-2 rounded text-xs font-medium active:bg-red-500 active:text-white transition-colors flex items-center justify-center space-x-1 shadow-lg">
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                {/* Product Name */}
                <h3 className="text-sm font-medium text-gray-800 hover:text-red-500 transition-colors cursor-pointer">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  {product.priceRange ? (
                    <span className="text-red-500 font-bold text-sm">
                      ${product.price} - ${product.originalPrice}
                    </span>
                  ) : (
                    <>
                      <span className="text-red-500 font-bold text-sm">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-xs">${product.originalPrice}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}