'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Add Heroicons for icons
import { UserIcon, ShoppingCartIcon, PhoneIcon, QuestionMarkCircleIcon, MagnifyingGlassIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../lib/AuthContext';
import { useCart } from '../lib/CartContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';


const brands = [
  { href: '/brands/kawasaki', label: 'Kawasaki' },
  { href: '/brands/arctic-cat', label: 'Arctic Cat' },
  { href: '/brands/polaris', label: 'Polaris' },
  { href: '/brands/can-am', label: 'Can-Am' },
  { href: '/brands/yamaha', label: 'Yamaha' },
  { href: '/brands/john-deere', label: 'John Deere' },
  { href: '/brands/kubota', label: 'Kubota' },
  { href: '/brands/bombardier', label: 'Bombardier' },
  { href: '/brands/bobcat', label: 'Bobcat' },
  { href: '/brands/land-pride', label: 'Land Pride' },
  { href: '/brands/cf-moto', label: 'CF Moto' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mobileDropdown, setMobileDropdown] = useState({}); // for mobile

  // Remove categoryDropdown state
  const [brandsDropdown, setBrandsDropdown] = useState(false);
  // Remove categoryTimeout ref
  const brandsTimeout = useRef();
  const pathname = usePathname();
  // --- STATE for search input ---
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef();
  const [mobileAccountDropdown, setMobileAccountDropdown] = useState(false);
  const mobileAccountRef = useRef();
  const { user, loading, signOut } = useAuth();
  const { getCartItemCount } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const router = useRouter();

  // Fetch all products on mount
  useEffect(() => {
    async function fetchAllProducts() {
      setSuggestionLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'utvAtvParts'));
        const products = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed Product',
            image: data.images?.[0] || data.image || '/images/atv1.jpg',
            price: data.price || 0,
            brand: data.brand || 'Unknown',
            description: data.function || data.description || '',
          };
        });
        setAllProducts(products);
        console.log('[Header] Products fetched:', products.length, products);
      } catch (e) {
        console.error('[Header] Error fetching products:', e);
      } finally {
        setSuggestionLoading(false);
      }
    }
    fetchAllProducts();
  }, []);
  // Filter suggestions as user types
  useEffect(() => {
    console.log('[Header] search value:', search);
    if (search.trim() === '') {
      setSuggestions([]);
      return;
    }
    const q = search.toLowerCase();
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ).slice(0, 8);
    setSuggestions(filtered);
    console.log('[Header] Suggestions:', filtered);
  }, [search, allProducts]);

  // Close mobile account dropdown on outside click
  useEffect(() => {
    if (!mobileAccountDropdown) return;
    function handleClick(e) {
      if (mobileAccountRef.current && !mobileAccountRef.current.contains(e.target)) {
        setMobileAccountDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileAccountDropdown]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    // Clean up on unmount
    return () => document.body.classList.remove('overflow-hidden');
  }, [mobileMenuOpen]);

  // Slim top bar
  const TopBar = () => (
    <div className="w-full bg-blue-900 text-white text-xs py-1 px-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <PhoneIcon className="w-4 h-4 inline-block mr-1" />
        <span>Call: <a href="tel:18001234567" className="underline">1-800-123-4567</a></span>
        <span className="hidden sm:inline-block">| support@autoshop.com</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/help" className="flex items-center gap-1 hover:underline"><QuestionMarkCircleIcon className="w-4 h-4" /> Help</Link>
      </div>
    </div>
  );





  // Brands dropdown
  const BrandsDropdown = () => (
    <div className="absolute left-0 top-full mt-2 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-30">
      {brands.map((brand) => (
        <Link key={brand.href} href={brand.href} className="block px-5 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base whitespace-nowrap transition-colors">
          {brand.label}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <TopBar />
      {/* Mobile Header Layout (md:hidden) */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-100 pb-2">
        {/* Logo at the top, centered */}
        <div className="flex justify-center items-center py-2">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image src="/images/logo-A.jpg" alt="UTV & ATV Parts Pro Logo" width={120} height={90} className="transition-transform group-hover:scale-110" />
          </Link>
        </div>
        {/* Row: Profile | Search | Hamburger */}
        <div className="flex items-center gap-2 px-2">
          {/* Profile Icon with Dropdown */}
          <div className="relative" ref={mobileAccountRef}>
            <button
              type="button"
              className="flex items-center justify-center text-gray-700 hover:text-blue-700 w-10 h-10 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={mobileAccountDropdown}
              onClick={() => setMobileAccountDropdown((v) => !v)}
            >
              <UserIcon className="w-6 h-6" />
            </button>
            {mobileAccountDropdown && (
              <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col py-2 animate-dropdown">
                {!loading && user ? (
                  <>
                    <span className="block px-4 py-2 text-gray-700 text-base truncate">{user.email}</span>
                    <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base rounded transition-colors" onClick={() => setMobileAccountDropdown(false)}>
                      Orders
                    </Link>
                    <Link href="/favourites" className="block px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base rounded transition-colors" onClick={() => setMobileAccountDropdown(false)}>
                      Favourites
                    </Link>
                    <button
                      onClick={() => { setMobileAccountDropdown(false); signOut(); }}
                      className="block w-full text-left px-4 py-2 rounded text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="block px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base rounded transition-colors"
                      onClick={() => setMobileAccountDropdown(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base rounded transition-colors"
                      onClick={() => setMobileAccountDropdown(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          {/* Search Bar */}
          <form className="flex-1 relative" onSubmit={e => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 focus:border-red-500 focus:outline-none text-base placeholder-gray-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {showSuggestions && search && (
              <div className="absolute left-0 top-full mt-2 min-w-[320px] max-w-[480px] w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2 animate-fadein max-h-80 overflow-y-auto">
                {suggestionLoading ? (
                  <div className="text-gray-400 text-sm italic p-2">Loading...</div>
                ) : suggestions.length === 0 ? (
                  <div className="text-gray-400 text-sm italic p-2">No results found...</div>
                ) : suggestions.map(product => (
                  <button
                    key={product.id}
                    className="flex items-center w-full gap-3 px-2 py-2 hover:bg-blue-50 rounded transition-colors"
                    onMouseDown={e => { e.preventDefault(); router.push(`/shop?search=${encodeURIComponent(product.name)}`); setShowSuggestions(false); setSearch(product.name); }}
                  >
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-contain rounded border" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 truncate">{product.name}</div>
                      <div className="text-xs text-gray-500 truncate">{product.brand}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
          {/* Cart Icon */}
          <Link href="/cart" className="relative flex items-center text-gray-700 hover:text-blue-700 w-10 h-10 justify-center">
            <ShoppingCartIcon className="w-7 h-7" />
            <span className="absolute -top-1.5 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{getCartItemCount()}</span>
          </Link>
          {/* Animated Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="ml-2 inline-flex items-center justify-center w-10 h-10 p-2 rounded-md text-gray-700 hover:text-blue-700 focus:outline-none group"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-panel"
            tabIndex={0}
          >
            <span className="relative w-10 h-10 flex flex-col justify-center items-center">
              {/* Top bar (most right) */}
              <span
                className={`block absolute h-1 w-6 bg-current rounded transition-all duration-300 ease-in-out left-2 ${mobileMenuOpen ? 'rotate-45 top-5 left-1' : 'top-2 left-2'}`}
              ></span>
              {/* Middle bar */}
              <span
                className={`block absolute h-1 w-7 bg-current rounded transition-all duration-300 ease-in-out left-1 ${mobileMenuOpen ? 'opacity-0 left-5' : 'top-4 left-1'}`}
              ></span>
              {/* Bottom bar (flush left) */}
              <span
                className={`block absolute h-1 w-8 bg-current rounded transition-all duration-300 ease-in-out left-0 ${mobileMenuOpen ? '-rotate-45 top-5 left-1' : 'top-6 left-0'}`}
              ></span>
            </span>
          </button>
        </div>
        {/* Red accent underline for mobile header */}
        <div className="w-full h-1 bg-red-500 mt-2" />
      </div>
      {/* Overlay for mobile menu */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-md transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
        onClick={() => setMobileMenuOpen(false)}
      />
      {/* Dropdown Card anchored to hamburger */}
      <div className="md:hidden">
        <div className="relative">
          {/* Hamburger button is already here, so we can anchor to it */}
          {mobileMenuOpen && (
            <div
              className="absolute right-2 mt-2 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-dropdown overflow-y-auto max-h-[70vh]"
              style={{ minHeight: '300px' }}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
            >
              {/* Slick Mobile Search Bar */}
              <div className="pt-2 pb-4">
                <form className="relative" onSubmit={e => e.preventDefault()} autoComplete="off">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-transform duration-200 ${searchFocused ? 'scale-110 text-black' : 'text-gray-400'} pointer-events-none`}>
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search ATV parts or keywords"
                    className={`w-full pl-12 pr-10 py-3 border transition-all duration-200 rounded-full bg-white placeholder-gray-500 outline-none text-base
                      ${searchFocused ? 'border-red-500' : 'border-gray-200'}
                    `}
                    aria-label="Search"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                      aria-label="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                  {showSuggestions && search && (
                    <div className="absolute left-0 top-full mt-2 min-w-[320px] max-w-[480px] w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2 animate-fadein max-h-80 overflow-y-auto">
                      {suggestionLoading ? (
                        <div className="text-gray-400 text-sm italic p-2">Loading...</div>
                      ) : suggestions.length === 0 ? (
                        <div className="text-gray-400 text-sm italic p-2">No results found...</div>
                      ) : suggestions.map(product => (
                        <button
                          key={product.id}
                          className="flex items-center w-full gap-3 px-2 py-2 hover:bg-blue-50 rounded transition-colors"
                          onMouseDown={e => { e.preventDefault(); router.push(`/shop?search=${encodeURIComponent(product.name)}`); setShowSuggestions(false); setSearch(product.name); }}
                        >
                          <img src={product.image} alt={product.name} className="w-10 h-10 object-contain rounded border" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 truncate">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate">{product.brand}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              </div>
              <nav className="flex flex-col space-y-2">
                <Link href="/" className={`px-2 py-2 rounded text-lg font-medium transition-colors ${pathname === '/' ? 'text-blue-700 font-bold bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700'} hover:text-blue-700`}>Home</Link>
                <div className="flex items-center">
                  <Link href="/shop" className={`flex-1 px-2 py-2 rounded text-lg font-medium transition-colors ${pathname.startsWith('/shop') ? 'text-blue-700 font-bold bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700'} hover:text-blue-700`}>Shop</Link>
                </div>
                <Link href="/blogs" className={`px-2 py-2 rounded text-lg font-medium transition-colors ${pathname === '/blogs' ? 'text-blue-700 font-bold bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700'} hover:text-blue-700`}>Blogs</Link>
                <button onClick={() => setMobileDropdown((prev) => ({ ...prev, pages: !prev.pages }))} className="flex justify-between items-center px-2 py-2 rounded text-lg font-medium text-gray-700 hover:text-blue-700">
                  Pages
                  <svg className={`w-4 h-4 ml-1 transform transition-transform ${mobileDropdown.pages ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {mobileDropdown.pages && (
                  <div className="pl-4 border-l border-blue-100 mt-1">
                    <Link href="/about" className={`block px-3 py-2 rounded text-base font-medium transition-colors ${pathname === '/about' ? 'text-blue-700 font-bold bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700'} hover:text-blue-700`}>About Us</Link>
                    <Link href="/contact" className={`block px-3 py-2 rounded text-base font-medium transition-colors ${pathname === '/contact' ? 'text-blue-700 font-bold bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700'} hover:text-blue-700`}>Contact</Link>
                    <Link href="/faq" className={`block px-3 py-2 rounded text-base font-medium transition-colors ${pathname === '/faq' ? 'text-blue-700 font-bold bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700'} hover:text-blue-700`}>FAQ</Link>
                    <Link href="/terms" className={`block px-3 py-2 rounded text-base font-medium transition-colors ${pathname === '/terms' ? 'text-blue-700 font-bold bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700'} hover:text-blue-700`}>Terms & Conditions</Link>
                    <Link href="/privacy" className={`block px-3 py-2 rounded text-base font-medium transition-colors ${pathname === '/privacy' ? 'text-blue-700 font-bold bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700'} hover:text-blue-700`}>Privacy Policy</Link>
                  </div>
                )}
                {/* Auth links at the end of the nav */}
                <div className="mt-4">
                  {!loading && user ? (
                    <button
                      onClick={() => { setMobileMenuOpen(false); signOut(); }}
                      className="w-full text-left px-2 py-2 rounded text-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-6 h-6" />
                      Sign Out
                    </button>
                  ) : (
                    <>
                      <Link href="/signin" className="w-full text-left px-2 py-2 rounded text-lg font-medium text-gray-700 hover:text-blue-700 transition-colors">Sign In</Link>
                      <Link href="/signup" className="w-full text-left px-2 py-2 rounded text-lg font-medium text-gray-700 hover:text-blue-700 transition-colors">Sign Up</Link>
                    </>
                  )}
                </div>
                {/* <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-blue-700 mt-2">
                                          <ShoppingCartIcon className="w-7 h-7" /> Cart <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{getCartItemCount()}</span>
                </Link> */}
              </nav>
            </div>
          )}
        </div>
      </div>
      <header className="hidden md:block bg-white/95 backdrop-blur shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 relative overflow-visible">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <Image src="/images/logo-A.jpg" alt="UTV & ATV Parts Pro Logo" width={120} height={90} className="transition-transform group-hover:scale-110" />
              </Link>
            </div>
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 justify-center px-6 overflow-visible">
              <form className="w-96 flex relative overflow-visible" onSubmit={e => e.preventDefault()} autoComplete="off">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-transform duration-200 ${searchFocused ? 'scale-110 text-blue-500' : 'text-gray-400'} pointer-events-none`}>
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => { setSearchFocused(true); setShowSuggestions(true); }}
                  onBlur={() => { setSearchFocused(false); setTimeout(() => setShowSuggestions(false), 150); }}
                  placeholder="Search UTV & ATV parts or keywords"
                  className={`flex-1 pl-12 pr-10 py-2 border transition-all duration-200 rounded-full shadow-md bg-white placeholder-gray-500 outline-none text-base
                    ${searchFocused ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                  `}
                  aria-label="Search"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
                {showSuggestions && search && (
                  <div className="absolute left-0 top-full mt-2 min-w-[320px] max-w-[480px] w-full md:min-w-[600px] md:max-w-[900px] md:w-[600px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2 animate-fadein max-h-80 overflow-y-auto">
                    {suggestionLoading ? (
                      <div className="text-gray-400 text-sm italic p-2">Loading...</div>
                    ) : suggestions.length === 0 ? (
                      <div className="text-gray-400 text-sm italic p-2">No results found...</div>
                    ) : suggestions.map(product => (
                      <button
                        key={product.id}
                        className="flex items-center w-full gap-3 px-2 py-2 hover:bg-blue-50 rounded transition-colors"
                        onMouseDown={e => { e.preventDefault(); router.push(`/shop?search=${encodeURIComponent(product.name)}`); setShowSuggestions(false); setSearch(product.name); }}
                      >
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-contain rounded border" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 truncate">{product.name}</div>
                          <div className="text-xs text-gray-500 truncate">{product.brand}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-6 relative ml-auto">
              {/* Home */}
              <Link href="/" className="px-3 py-2 text-base font-semibold text-gray-700 hover:text-blue-700 relative transition-colors group">
                <span className="relative z-10">Home</span>
                <span className="absolute left-0 bottom-1 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
              </Link>
              {/* Shop */}
              <Link href="/shop" className="px-3 py-2 text-base font-semibold text-gray-700 hover:text-blue-700 relative transition-colors group">
                <span className="relative z-10">Shop</span>
                <span className="absolute left-0 bottom-1 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
              </Link>
              {/* Blogs */}
              <Link href="/blogs" className="px-3 py-2 text-base font-semibold text-gray-700 hover:text-blue-700 relative transition-colors group">
                <span className="relative z-10">Blogs</span>
                <span className="absolute left-0 bottom-1 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
              </Link>
              {/* Pages (dropdown placeholder) */}
              <div
                className="relative group"
                onMouseEnter={() => {
                  clearTimeout(brandsTimeout.current);
                  setBrandsDropdown(true);
                }}
                onMouseLeave={() => {
                  brandsTimeout.current = setTimeout(() => setBrandsDropdown(false), 150);
                }}
              >
                <button className="px-3 py-2 text-base font-semibold text-gray-700 hover:text-blue-700 flex items-center gap-1 relative transition-colors group">
                  <span className="relative z-10">Pages</span>
                  <span className="absolute left-0 bottom-1 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded"></span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {brandsDropdown && (
                  <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <Link href="/about" className="block px-5 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base whitespace-nowrap transition-colors">About Us</Link>
                    <Link href="/contact" className="block px-5 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base whitespace-nowrap transition-colors">Contact</Link>
                    <Link href="/faq" className="block px-5 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base whitespace-nowrap transition-colors">FAQ</Link>
                    <Link href="/terms" className="block px-5 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base whitespace-nowrap transition-colors">Terms & Conditions</Link>
                    <Link href="/privacy" className="block px-5 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base whitespace-nowrap transition-colors">Privacy Policy</Link>
                  </div>
                )}
              </div>
            </nav>
            {/* Account & Cart */}
            <div className="hidden md:flex items-center space-x-4 ml-4">
              {/* Account Dropdown */}
              <div className="relative group" tabIndex={0}>
                <button className="flex items-center gap-1 text-gray-700 hover:text-blue-700 focus:outline-none px-2 py-1" aria-haspopup="true" aria-expanded="false">
                  <UserIcon className="w-6 h-6" />
                  <span className="hidden lg:inline">Account</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 top-full mt-2 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200">
                  {!loading && user ? (
                    <>
                      <span className="block px-5 py-2 text-gray-700 text-base truncate">{user.email}</span>
                      <Link href="/orders" className="block px-5 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base whitespace-nowrap transition-colors">Orders</Link>
                      <Link href="/favourites" className="block px-5 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base whitespace-nowrap transition-colors">Favourites</Link>
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-5 py-2 rounded text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/signin" className="block px-5 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base whitespace-nowrap transition-colors">Sign In</Link>
                      <Link href="/signup" className="block px-5 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-base whitespace-nowrap transition-colors">Sign Up</Link>
                    </>
                  )}
                </div>
              </div>
              <Link href="/cart" className="relative flex items-center text-gray-700 hover:text-blue-700">
                <ShoppingCartIcon className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{getCartItemCount()}</span>
              </Link>
            </div>
            {/* Mobile Cart & Hamburger */}
            <div className="md:hidden flex items-center">
              <Link href="/cart" className="relative flex items-center text-gray-700 hover:text-blue-700">
                <ShoppingCartIcon className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{getCartItemCount()}</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-700 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Red accent underline for desktop header */}
        <div className="w-full h-1 bg-red-500" />
      </header>
    </>
  );
} 