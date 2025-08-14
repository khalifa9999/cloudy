'use client';

import { useState } from 'react';
import { ArrowUpTrayIcon, DocumentTextIcon, TableCellsIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function ImportProducts() {
  const [importMethod, setImportMethod] = useState('json');
  const [importData, setImportData] = useState('');
  const [previewProducts, setPreviewProducts] = useState([]);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImportData(e.target.result);
    };

    if (importMethod === 'json') {
      reader.readAsText(file);
    } else if (importMethod === 'csv') {
      reader.readAsText(file);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const product = {};
        headers.forEach((header, index) => {
          product[header] = values[index] || '';
        });
        products.push(product);
      }
    }

    return products;
  };

  const validateProduct = (product) => {
    const required = ['name', 'brand', 'category', 'price'];
    const missing = required.filter(field => !product[field]);
    
    if (missing.length > 0) {
      return { valid: false, errors: `Missing required fields: ${missing.join(', ')}` };
    }

    if (isNaN(parseFloat(product.price))) {
      return { valid: false, errors: 'Price must be a valid number' };
    }

    return { valid: true };
  };

  const previewImport = () => {
    try {
      let products = [];

      if (importMethod === 'json') {
        products = JSON.parse(importData);
      } else if (importMethod === 'csv') {
        products = parseCSV(importData);
      } else if (importMethod === 'manual') {
        // Parse manual entry as JSON
        products = JSON.parse(importData);
      }

      // Ensure products is an array
      if (!Array.isArray(products)) {
        products = [products];
      }

      // Validate each product
      const validatedProducts = products.map((product, index) => {
        const validation = validateProduct(product);
        return {
          ...product,
          id: `import-${index}`,
          valid: validation.valid,
          errors: validation.errors,
          price: parseFloat(product.price) || 0,
          originalPrice: parseFloat(product.originalPrice) || 0,
          stockQuantity: parseInt(product.stockQuantity) || 0,
          rating: parseFloat(product.rating) || 4.5,
          reviews: parseInt(product.reviews) || 0,
          status: product.status || 'Active',
          images: Array.isArray(product.images) ? product.images : [product.image || ''].filter(Boolean)
        };
      });

      setPreviewProducts(validatedProducts);
      setMessage(`Found ${validatedProducts.length} products. ${validatedProducts.filter(p => p.valid).length} valid, ${validatedProducts.filter(p => !p.valid).length} with errors.`);
    } catch (error) {
      setMessage(`Error parsing data: ${error.message}`);
      setPreviewProducts([]);
    }
  };

  const importProducts = () => {
    const validProducts = previewProducts.filter(p => p.valid);
    if (validProducts.length === 0) {
      setMessage('No valid products to import');
      return;
    }

    setImporting(true);
    
    // Get existing products from localStorage
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Add new products with unique IDs
    const newProducts = validProducts.map(product => ({
      ...product,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));

    // Save to localStorage
    localStorage.setItem('products', JSON.stringify([...existingProducts, ...newProducts]));
    
    setImporting(false);
    setMessage(`Successfully imported ${validProducts.length} products!`);
    setPreviewProducts([]);
    setImportData('');
  };

  const sampleJSON = `[
  {
    "name": "Sample Product",
    "brand": "Sample Brand",
    "category": "Sample Category",
    "vehicleType": "ATV",
    "model": "Sample Model",
    "year": "2020-2024",
    "price": 99.99,
    "originalPrice": 129.99,
    "stockQuantity": 10,
    "description": "Sample product description",
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
  }
]`;

  const sampleCSV = `name,brand,category,vehicleType,model,year,price,originalPrice,stockQuantity,description
"Sample Product","Sample Brand","Sample Category","ATV","Sample Model","2020-2024",99.99,129.99,10,"Sample product description"`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Import Products</h1>
          <p className="text-gray-600 mt-2">Import products from JSON, CSV, or manual entry</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Import Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Import Method</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setImportMethod('json')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    importMethod === 'json' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  JSON File
                </button>
                <button
                  onClick={() => setImportMethod('csv')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    importMethod === 'csv' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <TableCellsIcon className="w-5 h-5" />
                  CSV File
                </button>
                <button
                  onClick={() => setImportMethod('manual')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    importMethod === 'manual' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ArrowUpTrayIcon className="w-5 h-5" />
                  Manual Entry
                </button>
              </div>

              {importMethod === 'manual' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    JSON Data
                  </label>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste JSON data here..."
                  />
                  <div className="mt-2">
                    <button
                      onClick={() => setImportData(sampleJSON)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Load Sample JSON
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload {importMethod.toUpperCase()} File
                  </label>
                  <input
                    type="file"
                    accept={importMethod === 'json' ? '.json' : '.csv'}
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {importMethod === 'csv' && (
                    <div className="mt-2">
                      <button
                        onClick={() => setImportData(sampleCSV)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Load Sample CSV
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={previewImport}
                  disabled={!importData.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <EyeIcon className="w-4 h-4 inline mr-2" />
                  Preview Import
                </button>
                <button
                  onClick={importProducts}
                  disabled={previewProducts.filter(p => p.valid).length === 0 || importing}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {importing ? 'Importing...' : 'Import Products'}
                </button>
              </div>

              {message && (
                <div className={`p-3 rounded-md ${
                  message.includes('Error') || message.includes('No valid') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Import Preview</h2>
            
            {previewProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ArrowUpTrayIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No products to preview</p>
                <p className="text-sm">Upload a file or enter data to see preview</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {previewProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`p-4 border rounded-lg ${
                      product.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.valid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>Brand: {product.brand}</div>
                      <div>Category: {product.category}</div>
                      <div>Price: ${product.price}</div>
                      <div>Stock: {product.stockQuantity}</div>
                    </div>
                    
                    {!product.valid && (
                      <div className="mt-2 text-sm text-red-600">
                        <strong>Errors:</strong> {product.errors}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Import Instructions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Required Fields</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• name (string)</li>
                <li>• brand (string)</li>
                <li>• category (string)</li>
                <li>• price (number)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Optional Fields</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• vehicleType (string)</li>
                <li>• model (string)</li>
                <li>• year (string)</li>
                <li>• originalPrice (number)</li>
                <li>• stockQuantity (number)</li>
                <li>• description (string)</li>
                <li>• images (array of URLs)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">File Formats</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• JSON: Array of product objects</li>
                <li>• CSV: Comma-separated values with headers</li>
                <li>• Manual: JSON format in text area</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
