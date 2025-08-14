'use client';

import { useState, useRef } from 'react';
import { ArrowUpTrayIcon, DocumentTextIcon, TableCellsIcon, EyeIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';

export default function ImportProducts() {
  const [importMethod, setImportMethod] = useState('excel');
  const [importData, setImportData] = useState('');
  const [previewProducts, setPreviewProducts] = useState([]);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'info', 'success', 'error'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setMessage('Processing file...');
    setMessageType('info');

    try {
      let products = [];

      if (importMethod === 'excel') {
        products = await parseExcelFile(file);
      } else if (importMethod === 'csv') {
        products = await parseCSVFile(file);
      } else if (importMethod === 'json') {
        products = await parseJSONFile(file);
      }

      setImportData(JSON.stringify(products, null, 2));
      setMessage(`File processed successfully. Found ${products.length} products.`);
      setMessageType('success');
    } catch (error) {
      setMessage(`Error processing file: ${error.message}`);
      setMessageType('error');
      setUploadedFile(null);
    }
  };

  const parseExcelFile = async (file) => {
    const XLSX = await import('xlsx');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            throw new Error('Excel file must have at least a header row and one data row');
          }

          const headers = jsonData[0];
          const products = [];

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.some(cell => cell !== undefined && cell !== null && cell !== '')) {
              const product = {};
              headers.forEach((header, index) => {
                if (header && row[index] !== undefined) {
                  product[header.trim()] = row[index];
                }
              });
              products.push(product);
            }
          }

          resolve(products);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const parseCSVFile = async (file) => {
    const Papa = await import('papaparse');
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          } else {
            resolve(results.data);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const parseJSONFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(Array.isArray(data) ? data : [data]);
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const validateProduct = (product) => {
    const errors = [];
    const warnings = [];

    // Required fields
    if (!product.name || product.name.trim() === '') {
      errors.push('Product name is required');
    }
    if (!product.brand || product.brand.trim() === '') {
      errors.push('Brand is required');
    }
    if (!product.category || product.category.trim() === '') {
      errors.push('Category is required');
    }
    if (!product.price || isNaN(parseFloat(product.price))) {
      errors.push('Valid price is required');
    }

    // Optional field validations
    if (product.originalPrice && isNaN(parseFloat(product.originalPrice))) {
      warnings.push('Original price should be a valid number');
    }
    if (product.stockQuantity && isNaN(parseInt(product.stockQuantity))) {
      warnings.push('Stock quantity should be a valid number');
    }
    if (product.rating && (isNaN(parseFloat(product.rating)) || parseFloat(product.rating) < 0 || parseFloat(product.rating) > 5)) {
      warnings.push('Rating should be between 0 and 5');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  };

  const normalizeProduct = (product) => {
    return {
      name: product.name?.trim() || '',
      brand: product.brand?.trim() || '',
      category: product.category?.trim() || '',
      vehicleType: product.vehicleType?.trim() || 'ATV',
      model: product.model?.trim() || '',
      year: product.year?.trim() || '',
      material: product.material?.trim() || '',
      function: product.function?.trim() || product.description?.trim() || '',
      weight: product.weight?.trim() || '',
      condition: product.condition?.trim() || 'New',
      partNumber: product.partNumber?.trim() || '',
      description: product.description?.trim() || '',
      specifications: product.specifications?.trim() || '',
      warranty: product.warranty?.trim() || '',
      stockQuantity: parseInt(product.stockQuantity) || 0,
      images: Array.isArray(product.images) 
        ? product.images.filter(img => img && img.trim() !== '')
        : product.image 
          ? [product.image].filter(img => img && img.trim() !== '')
          : [],
      price: parseFloat(product.price) || 0,
      originalPrice: parseFloat(product.originalPrice) || 0,
      rating: parseFloat(product.rating) || 4.5,
      reviews: parseInt(product.reviews) || 0,
      status: product.status?.trim() || 'Active'
    };
  };

  const previewImport = () => {
    try {
      let products = [];

      if (importMethod === 'manual') {
        products = JSON.parse(importData);
      } else if (importData) {
        products = JSON.parse(importData);
      }

      if (!Array.isArray(products)) {
        products = [products];
      }

      const validatedProducts = products.map((product, index) => {
        const normalizedProduct = normalizeProduct(product);
        const validation = validateProduct(normalizedProduct);
        
        return {
          ...normalizedProduct,
          id: `import-${index}`,
          valid: validation.valid,
          errors: validation.errors,
          warnings: validation.warnings
        };
      });

      setPreviewProducts(validatedProducts);
      const validCount = validatedProducts.filter(p => p.valid).length;
      const errorCount = validatedProducts.filter(p => !p.valid).length;
      
      setMessage(`Found ${validatedProducts.length} products. ${validCount} valid, ${errorCount} with errors.`);
      setMessageType(errorCount > 0 ? 'error' : 'success');
    } catch (error) {
      setMessage(`Error parsing data: ${error.message}`);
      setMessageType('error');
      setPreviewProducts([]);
    }
  };

  const importProducts = async () => {
    const validProducts = previewProducts.filter(p => p.valid);
    if (validProducts.length === 0) {
      setMessage('No valid products to import');
      setMessageType('error');
      return;
    }

    setImporting(true);
    setProgress(0);
    
    try {
      let importedCount = 0;
      let errorCount = 0;

      for (let i = 0; i < validProducts.length; i++) {
        const product = validProducts[i];
        
        try {
          // Check if product already exists (by name and brand)
          const existingQuery = query(
            collection(db, 'utvAtvParts'),
            where('name', '==', product.name),
            where('brand', '==', product.brand)
          );
          const existingDocs = await getDocs(existingQuery);
          
          if (!existingDocs.empty) {
            console.log(`Product "${product.name}" by ${product.brand} already exists, skipping...`);
            continue;
          }

          // Add to Firebase
          await addDoc(collection(db, 'utvAtvParts'), {
            ...product,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          importedCount++;
        } catch (error) {
          console.error(`Error importing product "${product.name}":`, error);
          errorCount++;
        }

        // Update progress
        setProgress(((i + 1) / validProducts.length) * 100);
      }

      setMessage(`Import completed! ${importedCount} products imported successfully. ${errorCount} errors.`);
      setMessageType(errorCount > 0 ? 'error' : 'success');
      
      if (importedCount > 0) {
        setPreviewProducts([]);
        setImportData('');
        setUploadedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      setMessage(`Import failed: ${error.message}`);
      setMessageType('error');
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const downloadTemplate = async (format = 'csv') => {
    const template = [
      {
        name: 'Sample Product Name',
        brand: 'Sample Brand',
        category: 'Air Intake & Filters',
        vehicleType: 'ATV',
        model: 'Sample Model',
        year: '2020-2024',
        material: 'Sample Material',
        function: 'Sample function description',
        weight: '1.5 lbs',
        condition: 'New',
        partNumber: 'SAMPLE-123',
        description: 'Sample product description',
        specifications: 'Sample specifications',
        warranty: '1 Year',
        stockQuantity: '10',
        price: '99.99',
        originalPrice: '129.99',
        rating: '4.5',
        reviews: '50',
        status: 'Active',
        images: 'https://example.com/image1.jpg,https://example.com/image2.jpg'
      }
    ];

    if (format === 'excel') {
      try {
        const XLSX = await import('xlsx');
        const worksheet = XLSX.utils.json_to_sheet(template);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        
        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'product-import-template.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating Excel template:', error);
        // Fallback to CSV
        downloadTemplate('csv');
      }
    } else {
      // CSV format
      const csvContent = [
        Object.keys(template[0]).join(','),
        ...template.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product-import-template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const clearData = () => {
    setImportData('');
    setPreviewProducts([]);
    setMessage('');
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bulk Import Products</h1>
          <p className="text-gray-600 mt-2">Import products from Excel, CSV, or JSON files</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              {messageType === 'success' && <CheckCircleIcon className="w-5 h-5" />}
              {messageType === 'error' && <ExclamationTriangleIcon className="w-5 h-5" />}
              <span>{message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Import Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Import Method</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setImportMethod('excel')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    importMethod === 'excel' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <TableCellsIcon className="w-5 h-5" />
                  Excel File
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

              {/* File Upload */}
              {importMethod !== 'manual' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={
                      importMethod === 'excel' ? '.xlsx,.xls' :
                      importMethod === 'csv' ? '.csv' :
                      '.json'
                    }
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowUpTrayIcon className="w-5 h-5" />
                    Choose {importMethod.toUpperCase()} File
                  </button>
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {uploadedFile.name}
                    </p>
                  )}
                </div>
              )}

              {/* Manual Entry */}
              {importMethod === 'manual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste JSON Data
                  </label>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paste your JSON data here..."
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={previewImport}
                  disabled={!importData && !uploadedFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Preview Import
                </button>
                <div className="relative group">
                  <button
                    onClick={() => downloadTemplate('csv')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Download Template
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-10">
                    <button
                      onClick={() => downloadTemplate('csv')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      CSV Template
                    </button>
                    <button
                      onClick={() => downloadTemplate('excel')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Excel Template
                    </button>
                  </div>
                </div>
                <button
                  onClick={clearData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Import Preview</h2>
            
            {previewProducts.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {previewProducts.filter(p => p.valid).length} of {previewProducts.length} products ready to import
                  </span>
                  <button
                    onClick={importProducts}
                    disabled={importing || previewProducts.filter(p => p.valid).length === 0}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {importing ? 'Importing...' : 'Import Products'}
                  </button>
                </div>

                {importing && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {previewProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`p-3 rounded-lg border ${
                        product.valid 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name || 'Unnamed Product'}</h4>
                          <p className="text-sm text-gray-600">{product.brand} - {product.category}</p>
                          <p className="text-sm text-gray-600">${product.price}</p>
                          
                          {product.errors && product.errors.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-red-600">Errors:</p>
                              <ul className="text-xs text-red-600 list-disc list-inside">
                                {product.errors.map((error, i) => (
                                  <li key={i}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {product.warnings && product.warnings.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-yellow-600">Warnings:</p>
                              <ul className="text-xs text-yellow-600 list-disc list-inside">
                                {product.warnings.map((warning, i) => (
                                  <li key={i}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="ml-2">
                          {product.valid ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          ) : (
                            <XMarkIcon className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <EyeIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No preview data available</p>
                <p className="text-sm">Upload a file or paste data to see preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Import Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Required Fields</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>name</strong> - Product name</li>
                <li>• <strong>brand</strong> - Manufacturer brand</li>
                <li>• <strong>category</strong> - Product category</li>
                <li>• <strong>price</strong> - Product price (number)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Optional Fields</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>vehicleType</strong> - ATV, UTV, Motorcycle, etc.</li>
                <li>• <strong>model</strong> - Vehicle model</li>
                <li>• <strong>year</strong> - Year range</li>
                <li>• <strong>description</strong> - Product description</li>
                <li>• <strong>images</strong> - Comma-separated image URLs</li>
                <li>• <strong>stockQuantity</strong> - Available stock</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
