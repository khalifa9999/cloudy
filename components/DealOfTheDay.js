"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, BarChart3, Star } from "lucide-react"
import { motion } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, limit } from "firebase/firestore"
import { useCart } from "@/lib/CartContext"

export default function DealOfTheDay() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({})
  const [expanded, setExpanded] = useState({})
  const [quantities, setQuantities] = useState({})
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Function to get consistent random products based on current date
  const getDailyDeals = (products, count = 2) => {
    if (!products || products.length === 0) return []
    
    // Use current date as seed for consistent daily randomization
    const today = new Date()
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    
    // Simple hash function for consistent randomization
    const hash = (str) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
      }
      return Math.abs(hash)
    }
    
    // Shuffle products using date seed
    const shuffled = [...products].sort((a, b) => {
      const hashA = hash(a.id + dateSeed.toString())
      const hashB = hash(b.id + dateSeed.toString())
      return hashA - hashB
    })
    
    // Take first 'count' products and add deal properties
    return shuffled.slice(0, count).map(product => ({
      ...product,
      discount: Math.floor(Math.random() * 40) + 10, // Random discount between 10-50%
      endTime: new Date(Date.now() + (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000), // Random end time 1-7 days from now
      details: {
        brand: product.brand || "Unknown",
        material: product.material || "Unknown",
        compatibility: product.compatibility || "Universal",
        model: product.model || "",
        weight: product.weight || ""
      }
    }))
  }

  // Fetch products from database
  const fetchDeals = async () => {
    try {
      setLoading(true)
      
      // Get all products from the database
      const productsRef = collection(db, 'utvAtvParts')
      const q = query(productsRef, limit(100)) // Limit to avoid performance issues
      const querySnapshot = await getDocs(q)
      
      const productsData = querySnapshot.docs
        .map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            // Map database fields to frontend expected fields
            name: data.name || "Unnamed Product",
            category: data.category || "Uncategorized",
            image: data.images?.[0] || data.image || "/images/atv-parts.png",
            // Note: Database doesn't have price fields, so we'll use placeholders
            price: data.price || 0,
            originalPrice: data.originalPrice || data.price || 0,
            rating: data.rating || 0,
            reviews: data.reviews || 0,
            description: data.function || data.description || "No description available.",
            brand: data.brand || "Unknown",
            material: data.material || "Unknown",
            compatibility: data.compatibility || "Universal",
            status: data.status || "Active",
            // Add additional fields from database
            model: data.model || "",
            weight: data.weight || "",
            images: data.images || []
          }
        })
        .filter(product => Array.isArray(product.images) && product.images.length > 0)
      
      // Get daily deals
      const dailyDeals = getDailyDeals(productsData, 2)
      setDeals(dailyDeals)
      
    } catch (error) {
      console.error('Error fetching deals:', error)
      // Fallback to static deals if database fetch fails
      setDeals([
        {
          id: 1,
          name: "Ceramic Brake Pads Set",
          originalPrice: 80.0,
          discount: 25,
          rating: 5,
          reviews: 127,
          mainImage: "/images/f-prod1.png",
          description: "Premium ceramic brake pads for superior stopping power and low dust. Fits most sedans and SUVs. Easy installation.",
          inStock: true,
          endTime: new Date(Date.now() + 273 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000 + 1 * 60 * 1000 + 8 * 1000),
          details: {
            fittingPosition: "Front, Rear",
            material: "Ceramic",
            brandClass: "Budget",
            manufacturer: "TOPRAN"
          }
        },
        {
          id: 2,
          name: "High-Performance Oil Filter",
          originalPrice: 88.0,
          discount: 43,
          rating: 4,
          reviews: 89,
          mainImage: "/images/f-prod2.png",
          description: "Engineered for extended performance and maximum filtration. Protects your engine from harmful particles and debris.",
          inStock: true,
          endTime: new Date(Date.now() + 357 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000 + 1 * 60 * 1000 + 8 * 1000),
          details: {
            fittingPosition: "Universal",
            material: "Synthetic Fiber",
            brandClass: "Premium",
            manufacturer: "BOSCH"
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Fetch deals on component mount
  useEffect(() => {
    fetchDeals()
  }, [])

  // Update countdown timers
  useEffect(() => {
    if (deals.length === 0) return
    
    const timer = setInterval(() => {
      const newTimeLeft = {}
      deals.forEach((deal) => {
        const now = new Date().getTime()
        const distance = deal.endTime.getTime() - now
        if (distance > 0) {
          newTimeLeft[deal.id] = {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          }
        } else {
          newTimeLeft[deal.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }
      })
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [deals])

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Handle add to cart
  const handleAddToCart = (deal) => {
    const quantity = quantities[deal.id] || 1;
    const productToAdd = {
      id: deal.id,
      name: deal.name,
      image: deal.image || deal.mainImage,
      brand: deal.details?.brand || 'Unknown',
      category: deal.category || 'Deals'
    };
    
    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }
    
    showToast(`${deal.name} added to cart!`, 'success');
  };

  // --- WHATSAPP INTEGRATION FUNCTION ---
  function getWhatsAppLink(deal, quantity = 1) {
    const phoneNumber = "17733651240" // 773-365-1240 in international format
    const message = `Hi! I'm interested in getting a quote for:\n\nProduct: ${deal.name}\nBrand: ${deal.details?.brand || ''}\nMaterial: ${deal.details?.material || ''}\nCompatibility: ${deal.details?.compatibility || ''}\nQuantity: ${quantity}\n\nCould you please provide me with pricing and availability?`
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  }

  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading deals of the day...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (deals.length === 0) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">DEALS OF THE DAY</h2>
            <p className="text-gray-600">No deals available at the moment. Check back tomorrow!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Desktop Section Header */}
        <motion.div className="hidden md:flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-red-500 mr-3 text-3xl">»»</span>
            DEALS OF THE DAY
          </h2>
        </motion.div>

        {/* Mobile Section Header */}
        <motion.div className="md:hidden flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            <span className="text-red-500 mr-2">»»</span>
            DEALS OF THE DAY
          </h2>
        </motion.div>

        {/* Desktop Layout - All Cards in Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="flex-1">
                    <div className="relative bg-gray-50 rounded-lg aspect-square">
                      <Image
                        src={deal.image || deal.mainImage || "/images/atv-parts.png"}
                        alt={deal.name}
                        fill
                        className="object-contain p-4"
                      />
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{deal.discount}%
                      </div>
                    </div>
                  </div>
                  {/* Product Info */}
                  <div className="flex-1 space-y-4">
                    {/* Product Details */}
                    <div>
                      <motion.h3 
                        className="text-lg font-semibold text-gray-800 mb-2"
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                      >
                        {deal.name}
                      </motion.h3>
                      {/* Details Section */}
                      <motion.div 
                        className="text-sm text-slate-700 mb-2 space-y-0.5"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                      >
                        <div>Brand: <span className="font-semibold text-red-700">{deal.details.brand}</span></div>
                        <div>Material: <span className="font-semibold">{deal.details.material}</span></div>
                        <div>Compatibility: <span className="font-semibold">{deal.details.compatibility}</span></div>
                        {deal.details.model && <div><span className="font-semibold">Model:</span> {deal.details.model}</div>}
                        {deal.details.weight && <div><span className="font-semibold">Weight:</span> {deal.details.weight}</div>}
                      </motion.div>
                      {/* Expandable Description */}
                      {expanded[deal.id] && (
                        <div className="text-slate-700 text-xs mt-1 mb-1">
                          <span className="font-semibold">Description:</span> {deal.description}
                        </div>
                      )}
                      <button
                        className="text-red-600 text-xs hover:underline focus:outline-none mb-2"
                        onClick={() => setExpanded((prev) => ({ ...prev, [deal.id]: !prev[deal.id] }))}
                        aria-expanded={!!expanded[deal.id]}
                      >
                        {expanded[deal.id] ? "Hide details" : "Show all"}
                      </button>

                      {/* Quantity and Add to Cart */}
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          className="border border-slate-200 rounded px-2 py-1 text-sm"
                          value={quantities[deal.id] || 1}
                          onChange={e => setQuantities(q => ({ ...q, [deal.id]: Number(e.target.value) }))}
                        >
                          {[1,2,3,4,5].map(q => <option key={q} value={q}>{q}</option>)}
                        </select>
                        <button
                          onClick={() => handleAddToCart(deal)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout - Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {deals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex-shrink-0 w-80">
                <div className="p-4">
                  {/* Mobile Product Image */}
                  <div className="relative bg-gray-50 rounded-lg aspect-square mb-4">
                    <Image
                      src={deal.image || deal.mainImage || "/images/atv-parts.png"}
                      alt={deal.name}
                      fill
                      className="object-contain p-4"
                    />
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{deal.discount}%
                    </div>
                  </div>
                  {/* Mobile Product Details */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 mb-2">{deal.name}</h3>
                      {/* Details Section */}
                      <div className="text-xs text-slate-700 mb-2 space-y-0.5">
                        <div>Brand: <span className="font-semibold text-red-700">{deal.details.brand}</span></div>
                        <div>Material: <span className="font-semibold">{deal.details.material}</span></div>
                        <div>Compatibility: <span className="font-semibold">{deal.details.compatibility}</span></div>
                        {deal.details.model && <div><span className="font-semibold">Model:</span> {deal.details.model}</div>}
                        {deal.details.weight && <div><span className="font-semibold">Weight:</span> {deal.details.weight}</div>}
                      </div>
                      {/* Expandable Description */}
                      {expanded[deal.id] && (
                        <div className="text-slate-700 text-xs mt-1 mb-1">
                          <span className="font-semibold">Description:</span> {deal.description}
                        </div>
                      )}
                      <button
                        className="text-red-600 text-xs hover:underline focus:outline-none mb-2"
                        onClick={() => setExpanded((prev) => ({ ...prev, [deal.id]: !prev[deal.id] }))}
                        aria-expanded={!!expanded[deal.id]}
                      >
                        {expanded[deal.id] ? "Hide details" : "Show all"}
                      </button>

                    </div>
                    {/* Quantity and Add to Cart */}
                    <div className="flex items-center gap-2">
                      <select
                        className="border border-slate-200 rounded px-2 py-1 text-xs"
                        value={quantities[deal.id] || 1}
                        onChange={e => setQuantities(q => ({ ...q, [deal.id]: Number(e.target.value) }))}
                      >
                        {[1,2,3,4,5].map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                      <button
                        onClick={() => handleAddToCart(deal)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="text-gray-800 font-medium">{toast.message}</p>
            <button 
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
