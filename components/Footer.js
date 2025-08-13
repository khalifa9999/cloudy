'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800">
      {/* Newsletter Signup Section */}
      <div className="bg-red-600 text-white py-16 relative overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[300px]">
            {/* Newsletter Content */}
            <div className="flex-1 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4">
                Never Miss a Part Newsletter
              </h2>
              <p className="text-lg mb-6 text-red-100">
                We part out an average of 40 machines per week. Get the exclusive first look on our freshest inventory.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your E-mail"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-200 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-6 py-3 bg-red-600 border-2 border-white text-white font-semibold uppercase rounded-lg hover:bg-red-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
            {/* UTV & ATV Image */}
            <div className="hidden lg:block flex-1 relative h-full">
              <div className="absolute right-0 bottom-0 transform translate-y-16 -mb-12">
                <Image
                  src="/images/newsletter.png"
                  alt="UTV & ATV"
                  width={450}
                  height={350}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Get In Touch */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">GET IN TOUCH</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 mr-3 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>9105 W Riggin Ave, Visalia, CA 93291, United States</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                <span>+1 760-307-4541</span>
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                <span>cloudyautosalvage@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">INFORMATION</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/faq" className="hover:text-red-600 transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-red-600 transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Jobs</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Newsletter Sign Up</Link></li>
            </ul>
          </div>

          {/* Useful Pages */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">USEFUL PAGES</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/about" className="hover:text-red-600 transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-red-600 transition-colors">Privacy And Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Tax Exemption</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">FOLLOW US</h3>
            <div className="flex space-x-3">
              <Link href="#" className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                </svg>
              </Link>
              <Link href="#" className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              <Link href="#" className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">© 2024 UTV & ATV Parts Pro. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-red-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-red-600 transition-colors">Terms of Service</Link>
              <Link href="#" className="text-gray-400 hover:text-red-600 transition-colors">Sitemap</Link>
              <Link href="#" className="text-gray-400 hover:text-red-600 transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 