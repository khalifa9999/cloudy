"use client";
import Header from '../components/Header';
import Hero from '../components/Hero';
import PremiumBrands from '../components/PremiumBrands';
import TrustedExpertise from '../components/trustedexpertise';
import DealOfTheDay from '@/components/DealOfTheDay';
import LatestBlog from '@/components/latestBlog';
import FeaturedProducts from '@/components/featuredProducts';
import PopularBrands from '@/components/productCategories';
import Footer from '@/components/Footer';
import CustomerReviews from '../components/CustomerReviews';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <div>
        <Header />
      </div>
      <div>
        <Hero />
      </div>
      <div className="mx-2 md:mx-8">
        <PopularBrands/>
      </div>
      <div className="mx-2 md:mx-8">
        <DealOfTheDay />
      </div>
      {/* <div className="mx-2 md:mx-8">
        <FeaturedProducts/>
      </div> */}
      <div className="mx-2 md:mx-8">
        <TrustedExpertise />
      </div>
      <div className="mx-2 md:mx-8">
        <LatestBlog/>
      </div>
      {/* <div className="mx-2 md:mx-8">
        <PremiumBrands />
      </div> */}
      <div>
        <CustomerReviews />
      </div>
      <div>
        <Footer />
      </div>
      {showButton && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '0.75rem 1.25rem',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
          aria-label="Back to top"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}
