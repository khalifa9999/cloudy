import React from 'react';
import Link from 'next/link';

export default function RentalPanels() {
  // Helper to scroll to car list if already on /shop
  const handlePanelClick = (type) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/shop') {
      window.history.replaceState(null, '', `/shop?type=${type}`);
      setTimeout(() => {
        const el = document.getElementById('car-list');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <section className="py-16 bg-white mx-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="bg-blue-200 rounded-2xl p-10 flex flex-col justify-between min-h-[350px] relative overflow-hidden">
            <div>
              <h2 className="text-4xl font-bold mb-4">Looking for new ATV parts?</h2>
              <p className="text-lg text-gray-700 mb-8">Explore the latest ATV parts and find exactly what your vehicle needs.</p>
              <Link
                href="/shop?type=new"
                scroll={false}
                className="bg-green-400 hover:bg-green-500 transition text-black font-semibold text-lg px-8 py-4 rounded-xl flex items-center gap-2"
              >
                Browse New ATV Parts <span className="text-2xl">→</span>
              </Link>
            </div>
            <img src="/images/home/b1.png" alt="New ATV" className="absolute right-4 bottom-0 w-2/3 max-w-xs object-contain" style={{zIndex:1}} />
          </div>
          {/* Right Panel */}
          <div className="bg-yellow-200 rounded-2xl p-10 flex flex-col justify-between min-h-[350px] relative overflow-hidden">
            <div>
              <h2 className="text-4xl font-bold mb-4">Looking for used ATV parts?</h2>
              <p className="text-lg text-gray-700 mb-8">Find quality pre-owned parts that fit your needs and budget, all in one place.</p>
              <Link
                href="/shop?type=used"
                scroll={false}
                className="bg-white hover:bg-gray-100 transition text-black font-semibold text-lg px-8 py-4 rounded-xl flex items-center gap-2"
              >
                Browse Used Parts <span className="text-2xl">→</span>
              </Link>
            </div>
            <img src="/images/home/b7.png" alt="Used Car" className="absolute right-4 bottom-0 w-2/3 max-w-xs object-contain" style={{zIndex:1}} />
          </div>
        </div>
      </div>
    </section>
  );
} 