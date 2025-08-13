"use client";
import React from 'react';
import { ChevronRight } from 'lucide-react';

const BrowseByType = () => {
  const partCategories = [
    {
      id: 1,
      name: 'Engine Parts',
      parts: '24 Parts',
      image: '/images/home/b1.png'
    },
    {
      id: 2,
      name: 'Suspension',
      parts: '16 Parts',
      image: '/images/home/b2.png'
    },
    {
      id: 3,
      name: 'Brake Systems',
      parts: '150 Parts',
      image: '/images/home/b3.png'
    },
    {
      id: 4,
      name: 'Electrical',
      parts: '25 Parts',
      image: '/images/home/b41.png'
    },
    {
      id: 5,
      name: 'Fuel Systems',
      parts: '56 Parts',
      image: '/images/home/b7.png'
    },
    {
      id: 6,
      name: 'Transmission',
      parts: '25 Parts',
      image: '/images/home/b5.png'
    },
    {
      id: 7,
      name: 'Body Parts',
      parts: '125 Parts',
      image: '/images/home/b88.png'
    },
    {
      id: 8,
      name: 'Accessories',
      parts: 'Parts',
      image: '/images/home/b99.png'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-12 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse by ATV Part Category</h1>
          <p className="text-gray-600">Find the right ATV part for any repair or upgrade</p>
        </div>
        <button className="bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
          View More
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {partCategories.map((type) => (
          <div
            key={type.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="relative overflow-hidden">
              <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <img
                  src={type.image}
                  alt={type.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-gray-500 text-xs">{type.parts}</p>
                </div>
                <ChevronRight 
                  className="text-gray-400 group-hover:text-gray-600 transition-colors" 
                  size={18} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseByType; 