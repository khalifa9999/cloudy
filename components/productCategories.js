"use client"

import Image from "next/image"
import { motion } from "framer-motion";

export default function PopularBrands() {
  const popularBrands = [
    {
      id: 1,
      name: "Kawasaki",
      image: "/images/b1.svg",
      description: "Japanese multinational corporation"
    },
    {
      id: 2,
      name: "Arctic Cat",
      image: "/images/b2.jpg",
      description: "American snowmobile and ATV manufacturer"
    },
    {
      id: 3,
      name: "Polaris",
      image: "/images/b3.jpg",
      description: "American manufacturer of motorcycles and ATVs"
    },
    {
      id: 4,
      name: "Can-Am",
      image: "/images/b4.png",
      description: "Canadian manufacturer of motorcycles and ATVs"
    },
    {
      id: 5,
      name: "Yamaha",
      image: "/images/b5.svg",
      description: "Japanese multinational corporation"
    },
    {
      id: 6,
      name: "John Deere",
      image: "/images/b6.png",
      description: "American corporation manufacturing agricultural machinery"
    },
    // {
    //   id: 7,
    //   name: "Kubota",
    //   image: "/images/home/auto-logo.jpg",
    //   description: "Japanese multinational corporation"
    // },
    // {
    //   id: 8,
    //   name: "Bombardier",
    //   image: "/images/home/auto-logo.jpg",
    //   description: "Canadian multinational aerospace and transportation company"
    // },
    // {
    //   id: 9,
    //   name: "Bobcat",
    //   image: "/images/home/auto-logo.jpg",
    //   description: "American manufacturer of farm and construction equipment"
    // },
    // {
    //   id: 10,
    //   name: "Land Pride",
    //   image: "/images/home/auto-logo.jpg",
    //   description: "American manufacturer of agricultural implements"
    // },
    // {
    //   id: 11,
    //   name: "CF Moto",
    //   image: "/images/home/auto-logo.jpg",
    //   description: "Chinese manufacturer of motorcycles and ATVs"
    // },
    // {
    //   id: 12,
    //   name: "PSN",
    //   image: "/images/home/auto-logo.jpg",
    //   description: "Power sports and automotive solutions"
    // }
  ]

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Desktop Section Header */}
        <motion.div className="hidden md:flex items-center justify-between mb-8"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-red-500 mr-3 text-3xl">»»</span>
            POPULAR BRANDS
          </h2>
        </motion.div>

        {/* Mobile Section Header */}
        <motion.div className="md:hidden flex items-center justify-between mb-4"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            <span className="text-red-500 mr-2">»»</span>
            POPULAR BRANDS
          </h2>
        </motion.div>

        {/* Mobile Horizontal Scrollable Cards */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {popularBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 flex-shrink-0 w-48"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Brand Image */}
                <div className="aspect-square mb-3 flex items-center justify-center bg-gray-50 rounded-lg p-2 group-hover:bg-gray-100 transition-colors">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={140}
                    height={140}
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Brand Name */}
                <h3 className="text-center text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                  {brand.name}
                </h3>
                
                {/* Brand Description */}
                <p className="text-center text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                  {brand.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {popularBrands.map((brand, index) => (
            <motion.div
              key={brand.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Brand Image */}
              <div className="aspect-square mb-4 flex items-center justify-center bg-gray-50 rounded-lg p-2 group-hover:bg-gray-100 transition-colors">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={160}
                  height={160}
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              {/* Brand Name */}
              <h3 className="text-center text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                {brand.name}
              </h3>
              
              {/* Brand Description */}
              <p className="text-center text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                {brand.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
