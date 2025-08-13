"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { motion } from "framer-motion";

const brands = [
  { name: "Kawasaki", logo: "/images/home/images.png" },
  { name: "Arctic Cat", logo: "/images/home/lexus.png" },
  { name: "Polaris", logo: "/images/home/mercedes-benz.svg" },
  { name: "Can-Am", logo: "/images/home/dodge.png" },
  { name: "Yamaha", logo: "/images/home/bmw.svg" },
  { name: "John Deere", logo: "/images/home/Audi.svg" },
  { name: "Kubota", logo: "/images/home/porsche.png" },
  { name: "Bombardier", logo: "/images/home/jaguar.svg" },
  { name: "Bobcat", logo: "/images/home/honda.svg" },
  { name: "Land Pride", logo: "/images/home/ferrari-logo.svg" },
  { name: "CF Moto", logo: "/images/home/images.png" },
]

export default function PremiumBrands() {
  const scrollContainerRef = useRef(null)

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const currentScroll = scrollContainerRef.current.scrollLeft
      const targetScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Section Header */}
        <motion.div className="hidden md:flex items-center justify-between mb-8"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-red-500 mr-3 text-3xl">»»</span>
            PREMIUM ATV BRANDS
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
            PREMIUM ATV BRANDS
          </h2>
        </motion.div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50 -ml-6 border border-gray-200 rounded-full p-2 flex items-center justify-center"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50 -mr-6 border border-gray-200 rounded-full p-2 flex items-center justify-center"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Scrollable Brand Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {brands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer min-w-[220px] h-[140px] flex items-center justify-center"
              >
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt={`${brand.name} logo`}
                  className={`object-contain filter grayscale hover:grayscale-0 transition-all duration-200 w-32 h-20 ${brand.name === "Dodge" ? "w-40 h-24" : ""}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
