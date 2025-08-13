"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowRight, ArrowLeft, Star, Award, Shield } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion";

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0)

  const heroSlides = [
    {
      title: "UTV & ATV PERFORMANCE",
      subtitle: "PREMIUM ENGINE PARTS & ACCESSORIES",
      image: "/images/hero-p.jpg",
      badge: "Premium Parts",
      mobileTitle: "UTV & ATV PARTS",
      mobileSubtitle: "PROFESSIONAL GRADE COMPONENTS",
    },
    {
      title: "SUSPENSION EXCELLENCE",
      subtitle: "HIGH-END SUSPENSION SYSTEMS",
      image: "/images/hero2-p.jpg",
      badge: "Best Sellers",
      mobileTitle: "SUSPENSION",
      mobileSubtitle: "SAFETY & PERFORMANCE COMBINED",
    },
    // {
    //   title: "BRAKE SYSTEMS",
    //   subtitle: "PRECISION BRAKE COMPONENTS",
    //   image: "https://images.pexels.com/photos/7568433/pexels-photo-7568433.jpeg",
    //   badge: "Professional",
    //   mobileTitle: "BRAKE SYSTEMS",
    //   mobileSubtitle: "TRANSFORM YOUR RIDE QUALITY",
    // },
  ]

  const mobileCategories = [
    { name: "Engine Parts", items: "500 items", image: "/images/bumpers.png" },
    { name: "Suspension", items: "300 items", image: "/images/car-door.png" },
    { name: "Brakes", items: "400 items", image: "/images/seats.png" },
    { name: "Electrical", items: "600 items", image: "/images/86_F.png" },
  ]

  const desktopCategories = [
    { name: "Engine Parts", items: "500 items", image: "/images/bumpers.png" },
    { name: "Suspension", items: "300 items", image: "/images/car-door.png" },
    { name: "Brakes", items: "400 items", image: "/images/seats.png" },
    { name: "Electrical", items: "600 items", image: "/images/86_F.png" },
  ]

  const categoriesPerPage = 6
  const totalCategoryPages = Math.ceil(desktopCategories.length / categoriesPerPage)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const currentSlideData = heroSlides[currentSlide]

  const nextCategoryPage = () => {
    setCurrentCategoryPage((prev) => (prev + 1) % totalCategoryPages)
  }

  const prevCategoryPage = () => {
    setCurrentCategoryPage((prev) => (prev - 1 + totalCategoryPages) % totalCategoryPages)
  }

  const getCurrentCategories = () => {
    const startIndex = currentCategoryPage * categoriesPerPage
    return desktopCategories.slice(startIndex, startIndex + categoriesPerPage)
  }



  return (
    <>
      {/* Desktop Hero - Optimized Mobile Design */}
      <section className="hidden lg:block relative bg-white pt-2">
        <div className="relative h-96 overflow-hidden mx-8">
          {/* Desktop Background */}
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </div>
          ))}

          {/* Desktop Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-12">
            <div className="text-white max-w-2xl">
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, scale: 0.8 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6 }}
              >
                <span className="bg-red-500 text-white px-6 py-3 rounded-full text-base font-bold uppercase tracking-wide shadow-lg">
                  {currentSlideData.badge}
                </span>
              </motion.div>
              <motion.h1 
                className="text-4xl xl:text-5xl font-black mb-3 tracking-wide leading-tight"
                initial={{ opacity: 0, x: -80 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.7, type: 'spring' }}
              >
                {currentSlideData.title}
              </motion.h1>
              <motion.h2 
                className="text-xl xl:text-2xl font-semibold text-slate-200 mb-8"
                initial={{ opacity: 0, x: 80 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.7, type: 'spring', delay: 0.1 }}
              >
                {currentSlideData.subtitle}
              </motion.h2>
              {/* Desktop CTA */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link href="/shop" className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 inline-flex items-center shadow-2xl hover:shadow-red-500/25 hover:scale-105 transform">
                  Shop Now
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Desktop Navigation Dots */}
          <div className="absolute bottom-8 right-8 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          {/* Desktop Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Popular parts Section */}
        
      </section>

      {/* Mobile Hero - Original Design */}
      <section className="lg:hidden relative bg-white pt-2">
        <div className="relative h-64 overflow-hidden mx-4">
          {/* Mobile Background */}
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </div>
          ))}

          {/* Mobile Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="text-white">
              <motion.div 
                className="mb-3"
                initial={{ opacity: 0, scale: 0.8 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6 }}
              >
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {currentSlideData.badge}
                </span>
              </motion.div>
              <motion.h1 
                className="text-2xl font-black mb-1 tracking-wide"
                initial={{ opacity: 0, x: -80 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.7, type: 'spring' }}
              >
                {currentSlideData.mobileTitle}
              </motion.h1>
              <motion.h2 
                className="text-lg font-semibold text-slate-200 mb-4"
                initial={{ opacity: 0, x: 80 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.7, type: 'spring', delay: 0.1 }}
              >
                {currentSlideData.mobileSubtitle}
              </motion.h2>
              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link href="/shop" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors inline-flex items-center">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>

          {/* Mobile Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </>
  )
}