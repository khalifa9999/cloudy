"use client"
import React, { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { Search, Filter, ShoppingCart, Star, Heart, Eye, Menu, X, MessageCircle } from "lucide-react"
import Link from "next/link"
import { List as ListIcon, Grid as GridIcon, ChevronLeft, ChevronRight } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';

// --- CATEGORY DATA STRUCTURE ---
const nestedCategories = [
  // Engine & Performance
  { key: "Engine Parts", name: "Engine Parts", children: [], manufacturers: [] },
  { key: "Fuel Systems", name: "Fuel Systems", children: [], manufacturers: [] },
  { key: "Exhaust Systems", name: "Exhaust Systems", children: [], manufacturers: [] },
  { key: "Cooling Systems", name: "Cooling Systems", children: [], manufacturers: [] },
  { key: "Air Intake & Filters", name: "Air Intake & Filters", children: [], manufacturers: [] },
  { key: "Ignition Systems", name: "Ignition Systems", children: [], manufacturers: [] },
  { key: "Engine Accessories", name: "Engine Accessories", children: [], manufacturers: [] },
  
  // Drivetrain & Transmission
  { key: "Transmission", name: "Transmission", children: [], manufacturers: [] },
  { key: "Clutch Systems", name: "Clutch Systems", children: [], manufacturers: [] },
  { key: "Drive Belts", name: "Drive Belts", children: [], manufacturers: [] },
  { key: "CVT Systems", name: "CVT Systems", children: [], manufacturers: [] },
  { key: "Gearboxes", name: "Gearboxes", children: [], manufacturers: [] },
  { key: "Differential", name: "Differential", children: [], manufacturers: [] },
  { key: "Axles & Shafts", name: "Axles & Shafts", children: [], manufacturers: [] },
  
  // Suspension & Steering
  { key: "Suspension Systems", name: "Suspension Systems", children: [], manufacturers: [] },
  { key: "Shocks & Struts", name: "Shocks & Struts", children: [], manufacturers: [] },
  { key: "Control Arms", name: "Control Arms", children: [], manufacturers: [] },
  { key: "Steering Systems", name: "Steering Systems", children: [], manufacturers: [] },
  { key: "Tie Rods", name: "Tie Rods", children: [], manufacturers: [] },
  { key: "Ball Joints", name: "Ball Joints", children: [], manufacturers: [] },
  { key: "Bushings", name: "Bushings", children: [], manufacturers: [] },
  
  // Brakes & Safety
  { key: "Brake Systems", name: "Brake Systems", children: [], manufacturers: [] },
  { key: "Brake Pads", name: "Brake Pads", children: [], manufacturers: [] },
  { key: "Brake Rotors", name: "Brake Rotors", children: [], manufacturers: [] },
  { key: "Brake Lines", name: "Brake Lines", children: [], manufacturers: [] },
  { key: "Master Cylinders", name: "Master Cylinders", children: [], manufacturers: [] },
  { key: "Brake Calipers", name: "Brake Calipers", children: [], manufacturers: [] },
  { key: "Safety Equipment", name: "Safety Equipment", children: [], manufacturers: [] },
  
  // Electrical & Lighting
  { key: "Electrical Systems", name: "Electrical Systems", children: [], manufacturers: [] },
  { key: "Batteries", name: "Batteries", children: [], manufacturers: [] },
  { key: "Starters & Alternators", name: "Starters & Alternators", children: [], manufacturers: [] },
  { key: "Lighting Systems", name: "Lighting Systems", children: [], manufacturers: [] },
  { key: "Wiring & Harnesses", name: "Wiring & Harnesses", children: [], manufacturers: [] },
  { key: "Switches & Controls", name: "Switches & Controls", children: [], manufacturers: [] },
  { key: "Gauges & Instruments", name: "Gauges & Instruments", children: [], manufacturers: [] },
  
  // Body & Exterior
  { key: "Body Panels", name: "Body Panels", children: [], manufacturers: [] },
  { key: "Bumpers & Guards", name: "Bumpers & Guards", children: [], manufacturers: [] },
  { key: "Fenders", name: "Fenders", children: [], manufacturers: [] },
  { key: "Hoods & Covers", name: "Hoods & Covers", children: [], manufacturers: [] },
  { key: "Doors & Windows", name: "Doors & Windows", children: [], manufacturers: [] },
  { key: "Mirrors", name: "Mirrors", children: [], manufacturers: [] },
  { key: "Graphics & Decals", name: "Graphics & Decals", children: [], manufacturers: [] },
  
  // Interior & Comfort
  { key: "Seats & Cushions", name: "Seats & Cushions", children: [], manufacturers: [] },
  { key: "Dashboards", name: "Dashboards", children: [], manufacturers: [] },
  { key: "Floor Mats", name: "Floor Mats", children: [], manufacturers: [] },
  { key: "Storage Solutions", name: "Storage Solutions", children: [], manufacturers: [] },
  { key: "Comfort Accessories", name: "Comfort Accessories", children: [], manufacturers: [] },
  { key: "Upholstery", name: "Upholstery", children: [], manufacturers: [] },
  
  // Wheels & Tires
  { key: "Wheels & Rims", name: "Wheels & Rims", children: [], manufacturers: [] },
  { key: "Tires", name: "Tires", children: [], manufacturers: [] },
  { key: "Tire Accessories", name: "Tire Accessories", children: [], manufacturers: [] },
  { key: "Wheel Bearings", name: "Wheel Bearings", children: [], manufacturers: [] },
  { key: "Lug Nuts", name: "Lug Nuts", children: [], manufacturers: [] },
  { key: "Wheel Spacers", name: "Wheel Spacers", children: [], manufacturers: [] },
  
  // Accessories & Modifications
  { key: "Performance Upgrades", name: "Performance Upgrades", children: [], manufacturers: [] },
  { key: "Protection Equipment", name: "Protection Equipment", children: [], manufacturers: [] },
  { key: "Storage & Cargo", name: "Storage & Cargo", children: [], manufacturers: [] },
  { key: "Comfort & Convenience", name: "Comfort & Convenience", children: [], manufacturers: [] },
  { key: "Audio & Entertainment", name: "Audio & Entertainment", children: [], manufacturers: [] },
  { key: "Tools & Maintenance", name: "Tools & Maintenance", children: [], manufacturers: [] },
  
  // Maintenance & Service
  { key: "Oil & Fluids", name: "Oil & Fluids", children: [], manufacturers: [] },
  { key: "Filters", name: "Filters", children: [], manufacturers: [] },
  { key: "Belts & Hoses", name: "Belts & Hoses", children: [], manufacturers: [] },
  { key: "Gaskets & Seals", name: "Gaskets & Seals", children: [], manufacturers: [] },
  { key: "Fasteners", name: "Fasteners", children: [], manufacturers: [] },
  { key: "Lubricants", name: "Lubricants", children: [], manufacturers: [] },
  
  // Used Parts
  { key: "Used Engine Parts", name: "Used Engine Parts", children: [], manufacturers: [] },
  { key: "Used Body Parts", name: "Used Body Parts", children: [], manufacturers: [] },
  { key: "Used Electrical", name: "Used Electrical", children: [], manufacturers: [] },
  { key: "Used Suspension", name: "Used Suspension", children: [], manufacturers: [] },
  { key: "Used Brakes", name: "Used Brakes", children: [], manufacturers: [] },
  { key: "Used Accessories", name: "Used Accessories", children: [], manufacturers: [] }
];

// --- PRODUCT IMAGE COMPONENT ---
function ProductImage({ product, viewMode, currentImageIndex, setCurrentImageIndex }) {
  const images = product.images || [product.image]
  const currentIndex = currentImageIndex[product.id] || 0
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [product.id]: (currentIndex + 1) % images.length
    }))
  }

  const prevImage = () => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [product.id]: currentIndex === 0 ? images.length - 1 : currentIndex - 1
    }))
  }

  const goToImage = (index) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [product.id]: index
    }))
  }

  return (
    <div className={
      viewMode === 'grid'
        ? "flex justify-center items-center mb-3 h-48 relative"
        : "flex-shrink-0 w-32 h-32 flex justify-center items-center relative"
    }>
      <img 
        src={images[currentIndex] || "https://picdn.trodo.com/media/m2_catalog_cache/540x540%2FTecDoc%2F301%2F128%2F04%2F159418.jpg?1"} 
        alt={product.name} 
        className={
          viewMode === 'grid'
            ? "h-40 max-w-full object-contain"
            : "h-28 max-w-full object-contain"
        }
      />
      
      {/* Navigation arrows for multiple images */}
      {hasMultipleImages && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          {/* Image dots indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Image counter */}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}

// --- FACEBOOK MESSENGER INTEGRATION FUNCTION ---
function getFacebookMessengerLink(product, quantity = 1) {
  // Facebook Messenger link format: https://m.me/PAGE_USERNAME
  // Replace 'YOUR_FACEBOOK_PAGE_USERNAME' with your actual Facebook page username
  const pageUsername = "YOUR_FACEBOOK_PAGE_USERNAME" // Update this with your Facebook page username
  
  return `https://m.me/${pageUsername}`
}

function getQuoteMessage(product, quantity = 1) {
  return `Hi! I'm interested in getting a quote for:

Product: ${product.name}
Brand: ${product.brand}
Category: ${product.category}
Quantity: ${quantity}

Could you please provide me with pricing and availability?`
}

// --- SIDEBAR COMPONENT ---
function CategorySidebar({ categories, selectedCategory, setSelectedCategory, selectedMake, setSelectedMake, selectedYear, setSelectedYear, selectedModel, setSelectedModel, yearOptions = [], availableBrands = [] }) {
  const [path, setPath] = useState([]) // array of keys
  const [search, setSearch] = useState("")

  // Find the current category node based on path
  function getCurrentNode() {
    let node = { children: categories }
    for (const key of path) {
      node = node.children.find((c) => c.key === key)
    }
    return node
  }
  const currentNode = getCurrentNode()
  const currentTitle = path.length === 0 ? "Categories" : currentNode.name
  const showBack = path.length > 0

  // Filter children by search
  const filtered = currentNode.children.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  )

  // Detect if at a leaf node (subcategory with no children)
  const atLeaf = currentNode && (!currentNode.children || currentNode.children.length === 0) && currentNode.manufacturers
  const manufacturers = atLeaf ? currentNode.manufacturers : []

  // Use available brands from database, fallback to Power Sports Nation brands if none available
  const defaultBrands = [
    "Kawasaki", "Arctic Cat", "Polaris", "Can-Am", "Honda", 
    "Suzuki", "Yamaha", "John Deere", "Kubota", "Bombardier", 
    "Bobcat", "Land Pride", "CF Moto", "Miscellaneous"
  ]
  
  // Combine available brands with default brands, remove duplicates
  const allBrands = [...new Set([...availableBrands, ...defaultBrands])].sort()

  return (
    <aside
      className="w-80 lg:w-64 h-screen overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col lg:pt-8 lg:mt-8 lg:ml-4"
      style={{ minWidth: 260 }}
    >
      <div className="flex items-center gap-2 mb-4">
        {showBack && (
          <button
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 focus:outline-none"
            onClick={() => setPath((p) => p.slice(0, -1))}
            aria-label="Back"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span className="text-lg font-bold">←</span>
          </button>
        )}
        <span className="text-xl font-bold text-slate-900 ml-1">{currentTitle}</span>
      </div>
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-5 h-5" />
        </span>
        <input
          className="pl-10 pr-3 py-2 border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-200 text-slate-900 bg-white placeholder:text-slate-400"
          placeholder="Search for a category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Categories Section */}
      <div className="mb-2">
        <div className="text-slate-500 text-xs font-semibold uppercase mb-2">Categories</div>
        <nav className="mb-2">
          {filtered.map((cat) => (
            <label
              key={cat.key}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-slate-800 font-medium transition-colors hover:bg-slate-100 focus:bg-slate-100 cursor-pointer gap-2"
              style={{ marginBottom: 0 }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategory === cat.key}
                  onChange={() => setSelectedCategory(selectedCategory === cat.key ? "all" : cat.key)}
                  className="accent-red-600 w-4 h-4"
                  aria-label={`Select ${cat.name}`}
                />
                <span>{cat.name}</span>
              </div>
              {cat.children && cat.children.length > 0 && (
                <span className="text-slate-400 font-bold">›</span>
              )}
            </label>
          ))}
          {filtered.length === 0 && (
            <div className="text-slate-400 text-center py-8">No categories found</div>
          )}
        </nav>
      </div>
      {/* Divider */}
      <div className="border-t border-slate-200 my-4" />
      {/* Year Section */}
      <div className="mb-2">
        <div className="text-slate-500 text-xs font-semibold uppercase mb-2">Year</div>
        <ul className="space-y-1">
          {yearOptions.map((year) => (
            <li key={year} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 cursor-pointer text-slate-800 text-sm">
              <input
                type="checkbox"
                checked={selectedYear === year}
                onChange={() => setSelectedYear(selectedYear === year ? "" : year)}
                className="accent-red-600 w-4 h-4"
                aria-label={`Select ${year}`}
              />
              <span>{year}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Model Section */}
      <div className="mb-2">
        <div className="text-slate-500 text-xs font-semibold uppercase mb-2">Model</div>
        <div className="px-3 py-2">
          <input
            type="text"
            placeholder="Enter model name..."
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>
      </div>

      {/* Vehicle Make Section */}
      <div className="mb-2">
        <div className="text-slate-500 text-xs font-semibold uppercase mb-2">UTV/ATV Brand</div>
        <ul className="space-y-1">
          {allBrands.map((brand) => (
            <li key={brand} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 cursor-pointer text-slate-800 text-sm">
              <input
                type="checkbox"
                checked={selectedMake === brand}
                onChange={() => setSelectedMake(selectedMake === brand ? "" : brand)}
                className="accent-red-600 w-4 h-4"
                aria-label={`Select ${brand}`}
              />
              <span>{brand}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Manufacturer Section */}
      {atLeaf && (
        <div className="mt-2">
          <div className="text-slate-500 text-xs font-semibold uppercase mb-2">Manufacturer</div>
          <ul className="space-y-1">
            {manufacturers.map((mfr) => (
              <li key={mfr} className="px-3 py-2 rounded hover:bg-slate-100 cursor-pointer text-slate-800 text-sm">
                {mfr}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

function ShopContent() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sort, setSort] = useState("newest")
  const [pageSize, setPageSize] = useState(100) // Temporarily increased to see more products
  const [viewMode, setViewMode] = useState("grid")
  const [page, setPage] = useState(1)
  const [expandedProductId, setExpandedProductId] = useState(null)
  const [selectedMake, setSelectedMake] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  
  // New state for database integration
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalProducts, setTotalProducts] = useState(0)
  const [lastDoc, setLastDoc] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  
  // Dynamic data from database
  const [availableBrands, setAvailableBrands] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])
  
  // Year options
  const yearOptions = [
    '2010-2015', '2016-2020', '2021-2023', '2024+',
    '2010', '2011', '2012', '2013', '2014', '2015',
    '2016', '2017', '2018', '2019', '2020', '2021',
    '2022', '2023', '2024'
  ]
  
  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  
  // Quantity state for each product
  const [productQuantities, setProductQuantities] = useState({})
  
  // Facebook Messenger modal state
  const [messengerModalOpen, setMessengerModalOpen] = useState(false)
  const [selectedProductForQuote, setSelectedProductForQuote] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Add animation CSS for modal
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn { 
        from { opacity: 0; transform: translateY(40px) scale(0.98); } 
        to { opacity: 1; transform: none; } 
      } 
      .animate-fadeIn { 
        animation: fadeIn 0.3s cubic-bezier(.4,0,.2,1) both; 
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const searchParams = useSearchParams();
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam && searchQuery !== searchParam) {
      setSearchQuery(searchParam);
    }
    // eslint-disable-next-line
  }, []);

  // Merge predefined categories with dynamic categories from database
  const mergedCategories = React.useMemo(() => {
    const allCategoryKeys = new Set(nestedCategories.map(cat => cat.key))
    const dynamicCategories = availableCategories
      .filter(cat => !allCategoryKeys.has(cat))
      .map(cat => ({ key: cat, name: cat, children: [], manufacturers: [] }))
    
    return [...nestedCategories, ...dynamicCategories]
  }, [availableCategories])
  const fetchAvailableOptions = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'utvAtvParts'))
      const brands = new Set()
      const categories = new Set()
      
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        if (data.brand && data.brand.trim()) {
          brands.add(data.brand.trim())
        }
        if (data.category && data.category.trim()) {
          categories.add(data.category.trim())
        }
      })
      
      setAvailableBrands(Array.from(brands).sort())
      setAvailableCategories(Array.from(categories).sort())
      
      console.log('Available brands from database:', Array.from(brands))
      console.log('Available categories from database:', Array.from(categories))
    } catch (error) {
      console.error('Error fetching available options:', error)
    }
  }

  // Fetch available options on component mount
  useEffect(() => {
    fetchAvailableOptions()
  }, [])

  // Fetch products from Firestore
  const fetchProducts = async (category = "all", search = "", sortBy = "newest", pageNum = 1, pageSizeNum = 24) => {
    try {
      setLoading(true)
      setError(null)
      
      let q = collection(db, 'utvAtvParts')
      
      // Apply category filter
      if (category !== "all") {
        console.log('Applying category filter for:', category)
        console.log('Category type:', typeof category)
        console.log('Category length:', category.length)
        q = query(q, where("category", "==", category))
        console.log('Query category filter applied:', category)
      } else {
        console.log('No category filter applied - showing all products')
      }
      
      console.log('Query object:', q)
      
      // Apply search filter if provided
      if (search.trim()) {
        // Note: Firestore doesn't support full-text search, so we'll filter client-side
        // For production, consider using Algolia or similar service
      }
      
      // Get total count first (without pagination or sorting to avoid index issues)
      let countQuery = collection(db, 'utvAtvParts')
      if (category !== "all") {
        countQuery = query(countQuery, where("category", "==", category))
      }
      
      try {
        const countSnapshot = await getDocs(countQuery)
        const totalCount = countSnapshot.docs.length
        console.log('Total products in category:', totalCount)
        
        // Apply pagination without sorting to avoid composite index issues
        q = query(q, limit(pageSizeNum))
        
        const querySnapshot = await getDocs(q)
        console.log('Query snapshot size:', querySnapshot.docs.length)
        console.log('Page size requested:', pageSizeNum)
        console.log('Current page:', pageNum)
        console.log('Raw documents:', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        
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
              rating: data.rating || 0,
              reviews: data.reviews || 0,
              description: data.function || data.description || "No description available.",
              brand: data.brand || "Unknown",
              material: data.material || "Unknown",
              compatibility: data.compatibility || "Universal",
              // Add additional fields from database
              model: data.model || "",
              weight: data.weight || "",
              images: data.images || [],
              // New ATV-specific fields
              condition: data.condition || "New",
              partNumber: data.partNumber || "",
              warranty: data.warranty || "",
              stockQuantity: data.stockQuantity || "",
              specifications: data.specifications || ""
            }
          })
          .filter(product => Array.isArray(product.images) && product.images.length > 0)
        
        // Apply client-side sorting to avoid Firestore index issues
        let sortedProducts = [...productsData]
        switch (sortBy) {
          case "rating":
            sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
            break
          case "newest":
          default:
            sortedProducts.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
            break
        }
        
        console.log('Processed products:', sortedProducts)
        setProducts(sortedProducts)
        setTotalProducts(totalCount) // Use the actual total count
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1])
        setHasMore(querySnapshot.docs.length === pageSizeNum)
        
        console.log('Products set:', sortedProducts.length)
        console.log('Total products set to:', totalCount)
        
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError)
        
        // If the collection doesn't exist or there's a permissions issue, show empty state
        if (firestoreError.code === 'permission-denied' || firestoreError.code === 'not-found') {
          console.log('Collection may not exist or permissions issue. Showing empty state.')
          setProducts([])
          setTotalProducts(0)
          setHasMore(false)
          setError('No products found. Please add some products to get started.')
        } else {
          throw firestoreError // Re-throw other errors
        }
      }
      
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again.')
      setProducts([])
      setTotalProducts(0)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // Load products on component mount and when filters change
  useEffect(() => {
    console.log('useEffect triggered - selectedCategory:', selectedCategory)
    console.log('useEffect triggered - searchQuery:', searchQuery)
    console.log('useEffect triggered - sort:', sort)
    console.log('useEffect triggered - page:', page)
    console.log('useEffect triggered - pageSize:', pageSize)
    fetchProducts(selectedCategory, searchQuery, sort, page, pageSize)
  }, [selectedCategory, searchQuery, sort, page, pageSize])

  // Debug: Test fetch all products
  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log('Testing fetch all products...')
        const testSnapshot = await getDocs(collection(db, 'utvAtvParts'))
        console.log('Total products in database:', testSnapshot.docs.length)
        if (testSnapshot.docs.length > 0) {
          console.log('Sample product:', testSnapshot.docs[0].data())
          
          // Check what categories exist in the database
          const categories = [...new Set(testSnapshot.docs.map(doc => doc.data().category).filter(Boolean))]
          console.log('Available categories in database:', categories)
          console.log('Expected categories in shop page:', nestedCategories.map(c => c.key))
          
          // Check for exact matches
          const expectedCategories = nestedCategories.map(c => c.key)
          const matchingCategories = categories.filter(cat => expectedCategories.includes(cat))
          console.log('Matching categories:', matchingCategories)
          console.log('Non-matching categories:', categories.filter(cat => !expectedCategories.includes(cat)))
          
          // Check first few products for category field
          const firstFewProducts = testSnapshot.docs.slice(0, 5).map(doc => ({
            id: doc.id,
            name: doc.data().name,
            category: doc.data().category,
            brand: doc.data().brand
          }))
          console.log('First few products with categories:', firstFewProducts)
          
          // Test category filter directly for each category
          for (const categoryKey of nestedCategories.map(c => c.key)) {
            console.log(`Testing category filter for "${categoryKey}"...`)
            const categoryQuery = query(collection(db, 'utvAtvParts'), where("category", "==", categoryKey))
            const categorySnapshot = await getDocs(categoryQuery)
            console.log(`${categoryKey} query result:`, categorySnapshot.docs.length, 'products')
            if (categorySnapshot.docs.length > 0) {
              console.log(`Sample ${categoryKey} product:`, categorySnapshot.docs[0].data())
            }
          }
        }
      } catch (err) {
        console.error('Test fetch error:', err)
      }
    }
    testFetch()
  }, [])

  // Filter products client-side for search (since Firestore doesn't support full-text search)
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery.trim() === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Brand filtering
    const matchesBrand = selectedMake === "" || 
      (product.brand && product.brand.toLowerCase() === selectedMake.toLowerCase())
    
    // Year filtering
    const matchesYear = selectedYear === "" || 
      (product.year && product.year.toLowerCase() === selectedYear.toLowerCase())
    
    // Model filtering
    const matchesModel = selectedModel === "" || 
      (product.model && product.model.toLowerCase().includes(selectedModel.toLowerCase()))
    
    return matchesSearch && matchesBrand && matchesYear && matchesModel
  })

  const startIdx = (page - 1) * pageSize + 1
  const endIdx = Math.min(page * pageSize, totalProducts)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-4 md:py-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/7540625/pexels-photo-7540625.jpeg" alt="Hero background" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            UTV & ATV Parts Pro
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center max-w-md mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <button className="px-6 md:px-8 py-2 md:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </section>

      <div className="flex min-h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div
          className={`
          fixed lg:sticky
          top-[56px] lg:top-0 left-0 z-50 lg:z-0
          h-[calc(100vh-56px)] lg:h-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:block
        `}
        >
          <CategorySidebar
            categories={mergedCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedMake={selectedMake}
            setSelectedMake={setSelectedMake}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            yearOptions={yearOptions}
            availableBrands={availableBrands}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Results Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              {/* Mobile Sidebar Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                aria-label="Open sidebar menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold text-slate-900">
                {selectedCategory === "all" ? "All UTV & ATV Parts" : mergedCategories.find((c) => c.key === selectedCategory)?.name}
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              {loading ? "Loading..." : `${filteredProducts.length} ${filteredProducts.length === 1 ? "UTV/ATV part" : "UTV/ATV parts"} found`}
            </p>
          </div>

          {/* Product Grid Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <select
                className="border border-slate-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
              {/* Page Size Dropdown */}
              <select
                className="border border-slate-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
              >
                {[12, 24, 48, 96, 100, 200, 500].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
                <option value={9999}>Show All</option>
              </select>
              {/* View Mode Toggle */}
              <div className="flex items-center border border-slate-200 rounded overflow-hidden ml-2">
                <button
                  className={`px-2 py-1 ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <ListIcon className="w-5 h-5" />
                </button>
                <button
                  className={`px-2 py-1 ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <GridIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">
                {startIdx} - {endIdx} of {totalProducts}
              </span>
              <button
                className="border border-slate-200 rounded p-1 disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="border border-slate-200 rounded p-1 disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={!hasMore}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">Error loading products</h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={() => fetchProducts(selectedCategory, searchQuery, sort, page, pageSize)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={
                    viewMode === 'grid'
                      ? "bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col h-full transition-all duration-300"
                      : "bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-row gap-4 transition-all duration-300"
                  }
                >
                  {/* Product Image */}
                  <ProductImage 
                    product={product}
                    viewMode={viewMode}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                  />

                  {/* Content Section */}
                  <div className={viewMode === 'grid' ? "" : "flex-1 flex flex-col"}>
                    {/* Top: Brand logo and icon */}
                    <div className="flex items-center justify-between mb-2">
                    </div>

                    {/* Title */}
                    <div className="mb-2">
                      <a href="#" className="block font-semibold text-base text-red-700 hover:underline leading-tight">
                        {product.name}
                      </a>
                    </div>

                    {/* Details */}
                    <div className={
                      viewMode === 'grid'
                        ? "text-sm text-slate-700 mb-2 space-y-0.5"
                        : "text-sm text-slate-700 mb-2 space-y-0.5 flex-1"
                    }>
                      <div>Brand: <span className="font-semibold text-red-700">{product.brand || 'N/A'}</span></div>
                      <div>Category: <span className="font-semibold">{product.category || 'N/A'}</span></div>
                      <div>Year: <span className="font-semibold">{product.year || 'N/A'}</span></div>
                      <div>Condition: <span className="font-semibold">{product.condition || 'New'}</span></div>
                      {product.model && <div>Model: <span className="font-semibold">{product.model}</span></div>}
                      {product.material && <div>Material: <span className="font-semibold">{product.material}</span></div>}

                      {expandedProductId === product.id && (
                        <div className="text-slate-700 text-xs mt-1 mb-1 space-y-1">
                          {product.function && <div><span className="font-semibold">Function:</span> {product.function}</div>}
                          {product.compatibility && <div><span className="font-semibold">Compatibility:</span> {product.compatibility}</div>}
                          {product.partNumber && <div><span className="font-semibold">Part #:</span> {product.partNumber}</div>}
                          {product.weight && <div><span className="font-semibold">Weight:</span> {product.weight}</div>}
                          {product.stockQuantity && <div><span className="font-semibold">Stock:</span> {product.stockQuantity}</div>}
                          {product.warranty && <div><span className="font-semibold">Warranty:</span> {product.warranty}</div>}

                          {product.location && <div><span className="font-semibold">Location:</span> {product.location}</div>}
                        </div>
                      )}
                      <button
                        className="text-red-600 text-xs hover:underline focus:outline-none"
                        onClick={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                        aria-expanded={expandedProductId === product.id}
                      >
                        {expandedProductId === product.id ? "Hide details" : "Show all"}
                      </button>
                    </div>

                    {/* Quantity and Get Quote */}
                    <div className={
                      viewMode === 'grid'
                        ? "flex items-center gap-2 mb-2"
                        : "flex items-center gap-2 mb-2 mt-auto"
                    }>
                      <select 
                        className="border border-slate-200 rounded px-2 py-1 text-sm" 
                        value={productQuantities[product.id] || 1}
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value)
                          setProductQuantities(prev => ({
                            ...prev,
                            [product.id]: quantity
                          }))
                        }}
                      >
                        {[1,2,3,4,5].map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                      <button 
                        onClick={() => {
                          const productToAdd = {
                            id: product.id,
                            name: product.name,
                            image: product.images?.[0] || product.image,
                            brand: product.brand,
                            category: product.category
                          };
                          addToCart(productToAdd);
                          // Show toast notification instead of alert
                          showToast(`${product.name} added to cart!`);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2"
                        title="Add to cart"
                      > 
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">No UTV/ATV parts found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setSearchQuery("")
                  setSelectedMake("")
                  setSelectedYear("")
                  setSelectedModel("")
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
      
      {/* Facebook Messenger Quote Modal */}
      {messengerModalOpen && selectedProductForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Get Quote via Facebook Messenger</h3>
                <p className="text-sm text-gray-600">Copy the message below and send it to us</p>
              </div>
              <button 
                onClick={() => setMessengerModalOpen(false)}
                className="ml-auto text-gray-400 hover:text-gray-600 transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Message Content */}
            <div className="px-6 py-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {getQuoteMessage(selectedProductForQuote.product, selectedProductForQuote.quantity)}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getQuoteMessage(selectedProductForQuote.product, selectedProductForQuote.quantity))
                      .then(() => {
                        // Show success feedback
                        const button = document.querySelector('#copyButton')
                        if (button) {
                          const originalText = button.textContent
                          button.textContent = 'Copied!'
                          button.className = 'flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors'
                          setTimeout(() => {
                            button.textContent = originalText
                            button.className = 'flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors'
                          }, 2000)
                        }
                      })
                      .catch(err => {
                        console.error('Failed to copy text: ', err)
                        alert('Failed to copy message. Please copy it manually.')
                      })
                  }}
                  id="copyButton"
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Copy Message
                </button>
                
                <a
                  href={getFacebookMessengerLink(selectedProductForQuote.product, selectedProductForQuote.quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Open Messenger
                </a>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  1. Copy the message above<br/>
                  2. Click "Open Messenger"<br/>
                  3. Paste and send the message
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
      
      <Footer />
    </div>
  )
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
