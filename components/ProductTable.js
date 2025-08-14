import React from 'react';
import { PencilSquareIcon, TrashIcon, EyeIcon, PhotoIcon } from '@heroicons/react/24/outline';

const dummyProducts = [
  {
    id: 1,
    image: '/public/images/f-prod1.png',
    name: 'Front Bumper Guard',
    category: 'Bumpers & Guards',
    brand: 'Polaris',
    model: 'RZR 1000',
    material: 'Steel',
    weight: '15 kg',
    condition: 'New',
    partNumber: 'POL-12345',
  },
  {
    id: 2,
    image: '/public/images/f-prod2.png',
    name: 'Engine Oil Filter',
    category: 'Filters',
    brand: 'Kawasaki',
    model: 'Brute Force',
    material: 'Paper, Steel',
    weight: '0.5 kg',
    condition: 'New',
    partNumber: 'KAW-789',
  },
  {
    id: 3,
    image: '/public/images/f-prod3.png',
    name: 'Brake Pads Set',
    category: 'Brake Pads',
    brand: 'Yamaha',
    model: 'Grizzly',
    material: 'Ceramic, Steel',
    weight: '2.5 kg',
    condition: 'New',
    partNumber: 'YAM-456',
  },
];

// Mobile Card Component
function ProductCard({ product, onEdit, onDelete, onPreview }) {
  const images = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow product-card">
      <div className="flex items-start gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          {images.length === 0 ? (
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
              <PhotoIcon className="w-6 h-6 text-gray-400" />
            </div>
          ) : (
            <div className="relative">
              <img 
                src={images[0]} 
                alt={product.name} 
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center hidden">
                <PhotoIcon className="w-6 h-6 text-gray-400" />
              </div>
              {images.length > 1 && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {images.length}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-semibold text-gray-900 break-words product-title" title={product.name}>
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 break-words" title={`${product.brand} ${product.model}`}>
                {product.brand} {product.model}
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${
              product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
            }`}>
              {product.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <div className="break-words">
              <span className="font-medium">Category:</span> {product.category}
            </div>
            <div className="break-words">
              <span className="font-medium">Condition:</span> {product.condition || 'New'}
            </div>
            {product.material && (
              <div className="break-words">
                <span className="font-medium">Material:</span> {product.material}
              </div>
            )}
            {product.weight && (
              <div className="break-words">
                <span className="font-medium">Weight:</span> {product.weight}
              </div>
            )}
            {product.price && (
              <div className="break-words">
                <span className="font-medium">Price:</span> ${parseFloat(product.price).toFixed(2)}
                {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                  <span className="text-gray-400 line-through ml-1">${parseFloat(product.originalPrice).toFixed(2)}</span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onPreview && onPreview(product)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              <EyeIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => onEdit && onEdit(product)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors"
            >
              <PencilSquareIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => onDelete && onDelete(product)}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductTable({ products = dummyProducts, onEdit, onDelete, onPreview, currentPage = 1, totalPages = 1, onPageChange }) {
  return (
    <div className="w-full">
      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 pb-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            onPreview={onPreview}
          />
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3 text-sm font-medium">Image</th>
              <th className="p-3 text-sm font-medium">Name</th>
              <th className="p-3 text-sm font-medium">Brand</th>
              <th className="p-3 text-sm font-medium">Model</th>
              <th className="p-3 text-sm font-medium">Category</th>
              <th className="p-3 text-sm font-medium">Price</th>
              <th className="p-3 text-sm font-medium">Weight</th>
              <th className="p-3 text-sm font-medium">Status</th>
              <th className="p-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {(() => {
                    // Handle both single image and multiple images
                    const images = product.images && product.images.length > 0 
                      ? product.images 
                      : (product.image ? [product.image] : []);
                    
                    if (images.length === 0) {
                      // Show placeholder when no images
                      return (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <PhotoIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      );
                    } else if (images.length === 1) {
                      // Show single image
                      return (
                        <div className="relative">
                          <img 
                            src={images[0]} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center hidden">
                            <PhotoIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                      );
                    } else {
                      // Show first image with indicator for multiple images
                      return (
                        <div className="relative">
                          <img 
                            src={images[0]} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center hidden">
                            <PhotoIcon className="w-6 h-6 text-gray-400" />
                          </div>
                          {images.length > 1 && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              {images.length}
                            </div>
                          )}
                        </div>
                      );
                    }
                  })()}
                </td>
                <td className="p-3 font-medium">
                  <div className="max-w-[200px] truncate" title={product.name}>
                    {product.name}
                  </div>
                </td>
                <td className="p-3">
                  <div className="max-w-[100px] truncate" title={product.brand}>
                    {product.brand}
                  </div>
                </td>
                <td className="p-3">
                  <div className="max-w-[100px] truncate" title={product.model}>
                    {product.model}
                  </div>
                </td>
                <td className="p-3">
                  <div className="max-w-[100px] truncate" title={product.category}>
                    {product.category}
                  </div>
                </td>
                <td className="p-3">
                  <div className="max-w-[80px] truncate" title={product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'N/A'}>
                    {product.price ? (
                      <div>
                        <span className="font-medium">${parseFloat(product.price).toFixed(2)}</span>
                        {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                          <div className="text-gray-400 line-through text-xs">${parseFloat(product.originalPrice).toFixed(2)}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="max-w-[80px] truncate" title={product.weight}>
                    {product.weight}
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPreview && onPreview(product)}
                      className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                      title="Preview"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEdit && onEdit(product)}
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(product)}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-2 p-3 sm:p-4 border-t mt-4 pb-4">
          <div className="text-sm text-gray-600 sm:hidden">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded border bg-gray-100 text-gray-600 disabled:opacity-50 text-sm transition-colors hover:bg-gray-200"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 hidden sm:inline">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded border bg-gray-100 text-gray-600 disabled:opacity-50 text-sm transition-colors hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 