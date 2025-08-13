"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { 
  Truck, 
  Users, 
  Award, 
  Target, 
  Eye, 
  Heart,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Package,
  Wrench,
  DollarSign,
  ShoppingCart,
  Building2
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AboutPage() {
  // Scrap yard stats
  const stats = [
    { number: 15, label: "Years in the Game", icon: Award, suffix: "+" },
    { number: 10000, label: "ATV Parts in Stock", icon: Package, suffix: "+" },
    { number: 5000, label: "Happy Customers", icon: Users, suffix: "+" },
    { number: 99, label: "Satisfaction Rate", icon: CheckCircle, suffix: "%" }
  ]

  // Core values
  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "No hidden fees, no surprises. Just honest deals on genuine ATV parts.",
      color: "bg-red-500"
    },
    {
      icon: Wrench,
      title: "ATV Expertise",
      description: "Real ATV people, real advice. We know our parts because we use them.",
      color: "bg-gray-800"
    },
    {
      icon: DollarSign,
      title: "Best Value",
      description: "Top deals on quality used and new ATV parts. Save big, ride happy.",
      color: "bg-green-600"
    },
    {
      icon: Truck,
      title: "Fast Pickup & Delivery",
      description: "Get your ATV parts quick—nationwide shipping or local pickup available.",
      color: "bg-red-700"
    }
  ]

  // Team (optional, can be replaced with testimonials or customer rides)
  const team = [
    {
      name: "Dan (The Boss)",
      position: "Founder & Chief ATV Specialist",
      image: "/images/logo-A.jpg",
      description: "Built this ATV parts business from the ground up. Loves a good ATV and a great deal."
    },
    {
      name: "Maya",
      position: "ATV Parts Specialist",
      image: "https://images.pexels.com/photos/7565163/pexels-photo-7565163.jpeg",
      description: "Knows every ATV bolt and bracket. Ask her about rare ATV finds."
    },
    {
      name: "Tony",
      position: "Yard Manager",
      image: "https://images.pexels.com/photos/4315573/pexels-photo-4315573.jpeg",
      description: "Keeps the ATV parts yard running smooth and the deals rolling."
    },
    {
      name: "Sam",
      position: "Customer Support",
      image: "https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg",
      description: "Here to help you score the right ATV part, every time."
    }
  ]

  // Achievements (milestones)
  const milestones = [
    { year: "2009", title: "ATV Parts Pro Opens", description: "Started with a single lot and a passion for ATVs." },
    { year: "2013", title: "10,000th ATV Part Sold", description: "Celebrated with a customer BBQ and ATV ride contest." },
    { year: "2017", title: "Expanded Nationwide Shipping", description: "Now serving ATV enthusiasts coast to coast." },
    { year: "2021", title: "Awarded 'Best Local ATV Parts'", description: "Voted #1 by our community and customers." },
    { year: "2024", title: "Launched Online Store", description: "Bringing ATV parts to your garage, 24/7." }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-900 to-gray-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
             style={{backgroundImage: "url('https://images.pexels.com/photos/5506059/pexels-photo-5506059.jpeg')"}}></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Building2 className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 tracking-wider uppercase">About ATV Parts Pro</h1>
          </div>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            The best deals on genuine ATV parts, trusted by ATV lovers, mechanics, and DIYers for over 15 years.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:mx-16 2xl:mx-32 py-16">
        {/* Our Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-red-500 text-sm font-bold uppercase tracking-wider">
              <div className="w-8 h-0.5 bg-red-500"></div>
              <span>Our Story</span>
              <Truck className="w-4 h-4" />
              <div className="w-8 h-0.5 bg-red-500"></div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              From Rust to Riches: <span className="text-red-500">ATV Parts Pro</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              What started as a single lot and a dream is now your go-to spot for quality used and new ATV parts. We're all about honest deals, real expertise, and helping you keep your ATV on the trail (or track) for less.
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              Whether you're wrenching on a project ATV, fixing your daily rider, or just hunting for a bargain, ATV Parts Pro is here for you. We buy, sell, and ship ATV parts nationwide—fast.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <a href="/shop" className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center space-x-2 group">
                <span>Shop Deals</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="https://images.pexels.com/photos/20041498/pexels-photo-20041498.jpeg"
                  alt="Engine parts"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="https://images.pexels.com/photos/5542145/pexels-photo-5542145.jpeg"
                  alt="Suspension parts"
                  width={300}
                  height={150}
                  className="w-full h-36 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/images/c1.png"
                  alt="Brake system"
                  width={300}
                  height={150}
                  className="w-full h-36 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/images/c2.jpg"
                  alt="Filters"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-red-500 text-white p-4 rounded-full shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-xs">Years</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-red-900 to-gray-900 rounded-2xl p-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Dan's?</h2>
            <p className="text-gray-200 max-w-2xl mx-auto">
              Real numbers, real trust. Here's why ATV people choose us again and again.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-gray-200">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 text-red-500 text-sm font-bold uppercase tracking-wider mb-4">
              <div className="w-8 h-0.5 bg-red-500"></div>
              <span>What Makes Us Different</span>
              <Heart className="w-4 h-4" />
              <div className="w-8 h-0.5 bg-red-500"></div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Scrap Yard Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We’re not just a yard—we’re a community. Here’s what drives us.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`${value.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center space-x-4 text-red-500 text-sm font-bold uppercase tracking-wider mb-4">
              <div className="w-8 h-0.5 bg-red-500"></div>
              <span>Our Journey</span>
              <Clock className="w-4 h-4" />
              <div className="w-8 h-0.5 bg-red-500"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Milestones</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Key moments that made Dan’s Scrap Yard the legend it is today.
            </p>
          </div>
          <div className="relative">
            {/* Timeline line - Desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-200"></div>
            {/* Timeline line - Mobile */}
            <div className="md:hidden absolute left-6 top-0 w-0.5 h-full bg-red-300"></div>
            <div className="space-y-6 sm:space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-start md:items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Mobile Layout */}
                  <div className="md:hidden flex items-start w-full">
                    {/* Timeline dot and connector */}
                    <div className="flex flex-col items-center mr-4 flex-shrink-0">
                      <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md mb-1 relative z-10"></div>
                      <div className="w-8 h-0.5 bg-red-300"></div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-4 rounded-xl border border-red-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center mb-3">
                          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {milestone.year}
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{milestone.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                  {/* Desktop Layout */}
                  <div className={`hidden md:block w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-red-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                      <div className="text-2xl font-bold text-red-500 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  {/* Timeline dot - Desktop */}
                  <div className="hidden md:block relative z-10 w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="hidden md:block w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}