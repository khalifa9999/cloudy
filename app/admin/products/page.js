'use client';
import React, { useState, useEffect } from 'react';
import ProductTable from '../../../components/ProductTable';
import ComboInput from '../../../components/ComboInput';
import { PlusIcon } from '@heroicons/react/24/solid';
import { XMarkIcon, ClipboardDocumentListIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { uploadToImgur } from '../../../lib/imgur';

function ProductModal({ open, onClose, onSave, product, mode = 'add' }) {
  // UTV/ATV Brands (Primary Organization - matching Power Sports Nation)
  const utvAtvBrands = [
    'Kawasaki',
    'Arctic Cat', 
    'Polaris',
    'Can-Am',
    'Honda',
    'Suzuki',
    'Yamaha',
    'John Deere',
    'Kubota',
    'Bombardier',
    'Bobcat',
    'Land Pride',
    'CF Moto',
    'Miscellaneous'
  ];

  // Part Categories (Secondary Organization)
  const categoriesList = [
    // Engine & Performance
    'Engine Parts',
    'Fuel Systems',
    'Exhaust Systems',
    'Cooling Systems',
    'Air Intake & Filters',
    'Ignition Systems',
    'Engine Accessories',
    
    // Drivetrain & Transmission
    'Transmission',
    'Clutch Systems',
    'Drive Belts',
    'CVT Systems',
    'Gearboxes',
    'Differential',
    'Axles & Shafts',
    
    // Suspension & Steering
    'Suspension Systems',
    'Shocks & Struts',
    'Control Arms',
    'Steering Systems',
    'Tie Rods',
    'Ball Joints',
    'Bushings',
    
    // Brakes & Safety
    'Brake Systems',
    'Brake Pads',
    'Brake Rotors',
    'Brake Lines',
    'Master Cylinders',
    'Brake Calipers',
    'Safety Equipment',
    
    // Electrical & Lighting
    'Electrical Systems',
    'Batteries',
    'Starters & Alternators',
    'Lighting Systems',
    'Wiring & Harnesses',
    'Switches & Controls',
    'Gauges & Instruments',
    
    // Body & Exterior
    'Body Panels',
    'Bumpers & Guards',
    'Fenders',
    'Hoods & Covers',
    'Doors & Windows',
    'Mirrors',
    'Graphics & Decals',
    
    // Interior & Comfort
    'Seats & Cushions',
    'Dashboards',
    'Floor Mats',
    'Storage Solutions',
    'Comfort Accessories',
    'Upholstery',
    
    // Wheels & Tires
    'Wheels & Rims',
    'Tires',
    'Tire Accessories',
    'Wheel Bearings',
    'Lug Nuts',
    'Wheel Spacers',
    
    // Accessories & Modifications
    'Performance Upgrades',
    'Protection Equipment',
    'Storage & Cargo',
    'Comfort & Convenience',
    'Audio & Entertainment',
    'Tools & Maintenance',
    
    // Maintenance & Service
    'Oil & Fluids',
    'Filters',
    'Belts & Hoses',
    'Gaskets & Seals',
    'Fasteners',
    'Lubricants'
  ];

  // UTV/ATV Models by Brand
  const utvAtvModels = {
    'Kawasaki': {
      'ATV': ['Brute Force', 'KFX', 'Prairie', 'Bayou'],
      'UTV': ['Teryx', 'Mule']
    },
    'Arctic Cat': {
      'ATV': ['Wildcat', 'Prowler', 'Alterra', 'Thundercat'],
      'UTV': ['Wildcat', 'Prowler', 'Alterra']
    },
    'Polaris': {
      'ATV': ['Sportsman', 'Scrambler', 'Outlaw'],
      'UTV': ['RZR', 'Ranger', 'General']
    },
    'Can-Am': {
      'ATV': ['Outlander', 'Renegade', 'DS'],
      'UTV': ['Maverick', 'Commander', 'Traxter']
    },
    'Honda': {
      'ATV': ['TRX', 'Rancher', 'Rubicon', 'Foreman'],
      'UTV': ['Pioneer', 'Talon']
    },
    'Suzuki': {
      'ATV': ['KingQuad', 'QuadSport', 'Vinson'],
      'UTV': ['KingQuad']
    },
    'Yamaha': {
      'ATV': ['Grizzly', 'Raptor', 'Wolverine', 'Kodiak'],
      'UTV': ['Viking', 'Wolverine']
    },
    'John Deere': {
      'UTV': ['Gator', 'HPX', 'XUV']
    },
    'Kubota': {
      'UTV': ['RTV', 'Sidekick']
    },
    'Bombardier': {
      'ATV': ['Traxter', 'Quest'],
      'UTV': ['Traxter', 'Quest']
    },
    'Bobcat': {
      'UTV': ['3400', '3600', '5600']
    },
    'Land Pride': {
      'UTV': ['RTV-XG850', 'RTV-XG850']
    },
    'CF Moto': {
      'ATV': ['ZFORCE', 'UFORCE'],
      'UTV': ['ZFORCE', 'UFORCE']
    },
    'Miscellaneous': {
      'Universal': ['Universal Fit', 'Custom', 'Aftermarket']
    }
  };

  // Vehicle Type Options
  const vehicleTypes = ['ATV', 'UTV', 'Universal'];

  // Year Range Options
  const yearRanges = [
    '2010-2015', '2016-2020', '2021-2023', '2024+',
    '2010', '2011', '2012', '2013', '2014', '2015',
    '2016', '2017', '2018', '2019', '2020', '2021',
    '2022', '2023', '2024'
  ];

  // Common materials for ATV parts
  const materialsList = [
    'Steel', 'Aluminum', 'Plastic/Polypropylene', 'Carbon Fiber', 'Titanium',
    'Rubber', 'Leather', 'Fabric', 'Glass', 'Ceramic', 'Composite',
    'Stainless Steel', 'Chrome', 'Powder Coated', 'Anodized', 'Painted'
  ];

  // Condition options for parts
  const conditionOptions = [
    'New', 'Like New', 'Excellent', 'Good', 'Fair', 'Used', 'Refurbished'
  ];

  const isPreview = mode === 'preview';
  const [form, setForm] = useState({ 
    name: '', 
    brand: utvAtvBrands[0], 
    category: categoriesList[0], 
    vehicleType: 'ATV',
    model: '',
    year: '',
    material: '',
    function: '',
    weight: '',
    condition: 'New',
    partNumber: '',
    price: '',
    originalPrice: '',
    images: [],
    description: '',
    specifications: '',
    warranty: '',
    stockQuantity: ''
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Get available models based on brand and vehicle type
  const getAvailableModels = (brand, vehicleType) => {
    if (!brand || !vehicleType) return [];
    const brandModels = utvAtvModels[brand];
    if (!brandModels) return [];
    return brandModels[vehicleType] || [];
  };

  // Update form when product prop changes
  useEffect(() => {
    if (product) {
      const productData = { 
        ...product, 
        images: product.images || (product.image ? [product.image] : []),
        // Ensure all new fields have default values
        brand: product.brand || utvAtvBrands[0],
        vehicleType: product.vehicleType || 'ATV',
        year: product.year || '',
        condition: product.condition || 'New',
        partNumber: product.partNumber || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        description: product.description || '',
        specifications: product.specifications || '',
        warranty: product.warranty || '',
        stockQuantity: product.stockQuantity || ''
      };
      setForm(productData);
      setImagePreviews(productData.images || []);
    } else {
      setForm({ 
        name: '', 
        brand: utvAtvBrands[0],
        category: categoriesList[0], 
        vehicleType: 'ATV',
        model: '',
        year: '',
        material: '',
        function: '',
        weight: '',
        condition: 'New',
        partNumber: '',
        price: '',
        originalPrice: '',
        images: [],
        description: '',
        specifications: '',
        warranty: '',
        stockQuantity: ''
      });
      setImagePreviews([]);
    }
  }, [product]);

  const handleImageChange = async (e) => {
    if (isPreview) return;
    
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploadingImages(true);
    setUploadError(null);
    
    try {
      const uploadPromises = files.map(async (file) => {
        // Show conversion status for WebP files
        if (file.type === 'image/webp') {
          console.log(`Converting ${file.name} from WebP to PNG...`);
        }
        return await uploadToImgur(file);
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const newImages = [...imagePreviews, ...uploadedUrls];
      setForm({ ...form, images: newImages });
      setImagePreviews(newImages);
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError('Failed to upload one or more images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (idx) => {
    if (isPreview) return;
    const newImages = imagePreviews.filter((_, i) => i !== idx);
    setForm({ ...form, images: newImages });
    setImagePreviews(newImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPreview || uploadingImages) return;
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) return;
    
    setUploadingImages(true);
    setUploadError(null);
    
    try {
      const uploadPromises = files.map(file => uploadToImgur(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const newImages = [...imagePreviews, ...uploadedUrls];
      setForm({ ...form, images: newImages });
      setImagePreviews(newImages);
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError('Failed to upload one or more images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl animate-fadeIn relative max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-200 rounded-t-2xl border-b sticky top-0 z-10">
          <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <h2 className="text-lg font-bold text-gray-700 flex-1 truncate">
            {isPreview ? 'Product Preview' : product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 flex-shrink-0"><XMarkIcon className="h-5 w-5" /></button>
        </div>
        <form
          onSubmit={e => {
            if (isPreview) return;
            e.preventDefault();
            onSave(form);
          }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 py-4 sm:py-6"
        >
          {/* Left: Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold">Part Name</label>
              <input 
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" 
                placeholder="e.g., Front Bumper, Engine Oil Filter, Brake Pads" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                required 
                readOnly={isPreview} 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ComboInput
                label="Brand"
                value={form.brand}
                onChange={(value) => {
                  setForm({ ...form, brand: value, model: '' });
                }}
                options={utvAtvBrands}
                placeholder="Select brand"
                required
                disabled={isPreview}
              />
              <ComboInput
                label="Vehicle Type"
                value={form.vehicleType}
                onChange={(value) => {
                  setForm({ ...form, vehicleType: value, model: '' });
                }}
                options={vehicleTypes}
                placeholder="Select vehicle type"
                required
                disabled={isPreview}
              />
            </div>

            <ComboInput
              label="Model"
              value={form.model}
              onChange={(value) => setForm({ ...form, model: value })}
              options={getAvailableModels(form.brand, form.vehicleType)}
              placeholder="Select model"
              required
              disabled={isPreview}
            />

            <ComboInput
              label="Year"
              value={form.year}
              onChange={(value) => setForm({ ...form, year: value })}
              options={yearRanges}
              placeholder="Select year or year range"
              required
              disabled={isPreview}
            />

            <ComboInput
              label="Category"
              value={form.category}
              onChange={(value) => setForm({ ...form, category: value })}
              options={categoriesList}
              placeholder="Select or enter category"
              required
              disabled={isPreview}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ComboInput
                label="Condition"
                value={form.condition}
                onChange={(value) => setForm({ ...form, condition: value })}
                options={conditionOptions}
                placeholder="Select or enter condition"
                required
                disabled={isPreview}
              />
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold">Part Number</label>
                <input 
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" 
                  placeholder="e.g., KAW-12345, OEM-789" 
                  value={form.partNumber} 
                  onChange={e => setForm({ ...form, partNumber: e.target.value })} 
                  readOnly={isPreview} 
                />
              </div>
            </div>

            <ComboInput
              label="Material"
              value={form.material}
              onChange={(value) => setForm({ ...form, material: value })}
              options={materialsList}
              placeholder="Select or enter material"
              required
              disabled={isPreview}
            />

            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold">Function/Description</label>
              <textarea 
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" 
                placeholder="e.g., Absorbs impact, Improves performance, Provides protection" 
                value={form.function} 
                onChange={e => setForm({ ...form, function: e.target.value })} 
                required 
                readOnly={isPreview}
                rows={3}
              />
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold">Weight</label>
                <input 
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" 
                  placeholder="e.g., 15 kg, 2.5 lbs" 
                  value={form.weight} 
                  onChange={e => setForm({ ...form, weight: e.target.value })} 
                  readOnly={isPreview} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold">Stock Quantity</label>
                <input 
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" 
                  placeholder="e.g., 50, 100+" 
                  value={form.stockQuantity} 
                  onChange={e => setForm({ ...form, stockQuantity: e.target.value })} 
                  readOnly={isPreview} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold">Price ($)</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" 
                  placeholder="e.g., 99.99" 
                  value={form.price} 
                  onChange={e => setForm({ ...form, price: e.target.value })} 
                  required
                  readOnly={isPreview} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold">Original Price ($)</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm" 
                  placeholder="e.g., 129.99 (optional)" 
                  value={form.originalPrice} 
                  onChange={e => setForm({ ...form, originalPrice: e.target.value })} 
                  readOnly={isPreview} 
                />
              </div>
            </div>





            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              {!isPreview && (
                <>
                  <button type="button" onClick={onClose} className="px-4 py-3 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition text-sm">Cancel</button>
                  <button type="submit" className="group flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-all font-semibold text-sm transform hover:scale-110 duration-200">
                    <PlusIcon className="h-5 w-5 group-hover:animate-spin" />
                    Save
                  </button>
                </>
              )}
              {isPreview && (
                <button type="button" onClick={onClose} className="px-4 py-3 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition text-sm">Close</button>
              )}
            </div>
          </div>
          {/* Right: Image Upload & Preview */}
          <div className="flex flex-col items-center justify-center gap-4">
            <label className="block text-gray-700 font-semibold mb-2">Product Images</label>
            
            {/* Upload Error Message */}
            {uploadError && (
              <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg mb-2">
                <p className="text-red-600 text-sm">{uploadError}</p>
              </div>
            )}
            
            {/* Loading State */}
            {uploadingImages && (
              <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600 text-sm">
                    Processing and uploading images...
                    <br />
                    <span className="text-xs text-blue-500">WebP files will be converted to PNG automatically</span>
                  </span>
                </div>
              </div>
            )}
            
            {imagePreviews && imagePreviews.length === 1 ? (
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                <img src={imagePreviews[0]} alt="Preview" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(0)}
                  className={`absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-600 hover:text-red-500 hover:bg-opacity-100 transition ${isPreview ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isPreview}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ) : imagePreviews && imagePreviews.length > 1 ? (
              <div className="grid grid-cols-2 gap-2 w-full mb-2">
                {imagePreviews.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src={img} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className={`absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-600 hover:text-red-500 hover:bg-opacity-100 transition ${isPreview ? 'cursor-not-allowed opacity-50' : ''}`}
                      disabled={isPreview}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 w-full mb-2">
                <PhotoIcon className="h-12 w-12 text-gray-300" />
                <span className="text-xs text-gray-400 mt-1">No images</span>
              </div>
            )}
            
            {/* File Upload Input */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images to Imgur
              </label>
              <div className="flex items-center justify-center w-full">
                <label 
                  className="flex flex-col items-center justify-center w-full h-20 sm:h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-4 pb-4 sm:pt-5 sm:pb-6">
                    <ArrowUpTrayIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-xs sm:text-sm text-gray-500 text-center px-2">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isPreview || uploadingImages}
                  />
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductPreviewModal({ open, onClose, product }) {
  if (!open || !product) return null;
  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl shadow-lg max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate flex-1 mr-4">Car Part Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Product Images */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700">Product Images</h3>
            {images.length === 1 ? (
              <div className="relative w-full h-48 sm:h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={images[0]} alt="Preview" className="object-cover w-full h-full" />
              </div>
            ) : images.length > 1 ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-full h-24 sm:h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src={img} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
                <PhotoIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300" />
                <span className="text-xs sm:text-sm text-gray-400 mt-2">No images available</span>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700">Part Information</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500 font-medium">Part Name</div>
                <div className="text-sm sm:text-lg font-semibold text-gray-800 truncate" title={product.name}>{product.name}</div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">Brand</div>
                  <div className="font-semibold text-gray-800 truncate" title={product.brand}>{product.brand}</div>
                </div>
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">Model</div>
                  <div className="font-semibold text-gray-800 truncate" title={product.model}>{product.model}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500 font-medium">Category</div>
                <div className="font-semibold text-gray-800 truncate" title={product.category}>{product.category}</div>
              </div>

              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500 font-medium">Material</div>
                <div className="font-semibold text-gray-800 truncate" title={product.material}>{product.material}</div>
              </div>

              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500 font-medium">Function</div>
                <div className="font-semibold text-gray-800 truncate" title={product.function}>{product.function}</div>
              </div>

              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500 font-medium">Compatibility</div>
                <div className="font-semibold text-gray-800 truncate" title={product.compatibility}>{product.compatibility}</div>
              </div>

              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500 font-medium">Weight</div>
                <div className="font-semibold text-gray-800 truncate" title={product.weight}>{product.weight}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">Price</div>
                  <div className="font-semibold text-gray-800 truncate" title={product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'N/A'}>
                    {product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'N/A'}
                  </div>
                </div>
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">Original Price</div>
                  <div className="font-semibold text-gray-800 truncate" title={product.originalPrice ? `$${parseFloat(product.originalPrice).toFixed(2)}` : 'N/A'}>
                    {product.originalPrice ? `$${parseFloat(product.originalPrice).toFixed(2)}` : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500 font-medium">Status</div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {product.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 sm:mt-6 pt-4 border-t">
          <button 
            onClick={onClose} 
            className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [previewedProduct, setPreviewedProduct] = useState(null);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'utvAtvParts'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Add default values for missing fields
          status: doc.data().status || 'Active',
          image: doc.data().image || '/images/atv-parts.png'
        }));
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add animation to modal (client-side only)
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(40px) scale(0.98); } to { opacity: 1; transform: none; } } .animate-fadeIn { animation: fadeIn 0.3s cubic-bezier(.4,0,.2,1) both; }`;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSave = async (product) => {
    try {
      if (editingProduct) {
        // Update existing product
        const productRef = doc(db, 'utvAtvParts', editingProduct.id);
        await updateDoc(productRef, product);
        setProducts(products.map(p => (p.id === editingProduct.id ? { ...editingProduct, ...product } : p)));
      } else {
        // Add new product
        const docRef = await addDoc(collection(db, 'utvAtvParts'), product);
        setProducts([...products, { ...product, id: docRef.id }]);
      }
      setModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'utvAtvParts', product.id));
        setProducts(products.filter(p => p.id !== product.id));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  // Sample products data
  const sampleProducts = [
    {
      name: "Kawasaki Brute Force 750 Air Filter",
      brand: "Kawasaki",
      category: "Air Intake & Filters",
      vehicleType: "ATV",
      model: "Brute Force",
      year: "2020-2024",
      material: "Paper & Foam",
      function: "High-performance air filter for improved engine breathing and power output",
      weight: "0.5 lbs",
      condition: "New",
      partNumber: "KAF-750-2020",
      description: "Premium air filter designed specifically for the Kawasaki Brute Force 750. Features dual-layer filtration with washable foam outer layer and replaceable paper inner filter. Improves airflow while maintaining excellent filtration efficiency.",
      specifications: "Filter Type: Dual-layer, Outer: Washable foam, Inner: Replaceable paper, Dimensions: 6.5\" x 4.2\" x 2.1\", Filtration Efficiency: 99.5%",
      warranty: "1 Year Limited Warranty",
      stockQuantity: "25",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop"
      ],
      price: 45.99,
      originalPrice: 59.99,
      rating: 4.8,
      reviews: 127,
      status: "Active"
    },
    {
      name: "Polaris RZR XP 1000 Performance Exhaust",
      brand: "Polaris",
      category: "Exhaust Systems",
      vehicleType: "UTV",
      model: "RZR XP 1000",
      year: "2016-2023",
      material: "Stainless Steel",
      function: "High-flow exhaust system for increased horsepower and torque",
      weight: "8.5 lbs",
      condition: "New",
      partNumber: "PEX-RZR-1000",
      description: "Professional-grade exhaust system featuring mandrel-bent tubing, high-flow muffler, and ceramic coating. Delivers 8-12 HP increase and improved throttle response. Includes all necessary mounting hardware and gaskets.",
      specifications: "Material: 304 Stainless Steel, Coating: Ceramic, HP Gain: 8-12 HP, Torque Gain: 6-8 ft-lbs, Sound Level: 96 dB, Includes: Muffler, Header, Gaskets, Hardware",
      warranty: "2 Year Limited Warranty",
      stockQuantity: "12",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop"
      ],
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.9,
      reviews: 89,
      status: "Active"
    },
    {
      name: "Can-Am Maverick X3 LED Light Bar",
      brand: "Can-Am",
      category: "Lighting Systems",
      vehicleType: "UTV",
      model: "Maverick X3",
      year: "2017-2024",
      material: "Aluminum & Polycarbonate",
      function: "High-intensity LED light bar for enhanced visibility during night riding",
      weight: "3.2 lbs",
      condition: "New",
      partNumber: "CAM-LED-32",
      description: "32-inch curved LED light bar featuring 120W output and 12,000 lumens. IP68 waterproof rating with aircraft-grade aluminum housing. Includes mounting brackets and wiring harness for easy installation.",
      specifications: "Length: 32\", Power: 120W, Lumens: 12,000, Beam Pattern: Spot/Flood combo, Voltage: 12V, Waterproof: IP68, Housing: Aircraft-grade aluminum, Lens: Polycarbonate",
      warranty: "3 Year Limited Warranty",
      stockQuantity: "18",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop"
      ],
      price: 189.99,
      originalPrice: 249.99,
      rating: 4.7,
      reviews: 156,
      status: "Active"
    },
    {
      name: "Yamaha Grizzly 700 CVT Belt",
      brand: "Yamaha",
      category: "Drive Belts",
      vehicleType: "ATV",
      model: "Grizzly 700",
      year: "2010-2024",
      material: "Reinforced Rubber & Kevlar",
      function: "High-strength CVT drive belt for reliable power transmission",
      weight: "1.8 lbs",
      condition: "New",
      partNumber: "YCVT-GZ-700",
      description: "OEM-quality CVT belt constructed with reinforced rubber and Kevlar fibers for maximum durability. Designed to handle high torque loads and extreme temperatures. Perfect replacement for worn or damaged factory belts.",
      specifications: "Length: 37.5\", Width: 1.25\", Material: Reinforced rubber with Kevlar, Temperature Range: -40°F to +200°F, Load Capacity: 700 lbs, Includes: Belt only",
      warranty: "1 Year Limited Warranty",
      stockQuantity: "30",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop"
      ],
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.6,
      reviews: 203,
      status: "Active"
    },
    {
      name: "Arctic Cat Wildcat Sport Suspension Kit",
      brand: "Arctic Cat",
      category: "Suspension Systems",
      vehicleType: "UTV",
      model: "Wildcat Sport",
      year: "2013-2018",
      material: "Chrome Moly Steel & Aluminum",
      function: "Performance suspension upgrade for improved handling and ride quality",
      weight: "15.5 lbs",
      condition: "New",
      partNumber: "ACSP-WCS-13",
      description: "Complete suspension upgrade kit including front and rear shocks, control arms, and tie rods. Features adjustable damping, increased travel, and reinforced components for aggressive riding conditions.",
      specifications: "Front Travel: +2\", Rear Travel: +1.5\", Shocks: Adjustable compression/rebound, Arms: Chrome moly steel, Rods: Billet aluminum, Coating: Powder coated black",
      warranty: "2 Year Limited Warranty",
      stockQuantity: "8",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop"
      ],
      price: 899.99,
      originalPrice: 1199.99,
      rating: 4.9,
      reviews: 67,
      status: "Active"
    },
    {
      name: "Honda TRX 450R Performance Camshaft",
      brand: "Honda",
      category: "Engine Parts",
      vehicleType: "ATV",
      model: "TRX 450R",
      year: "2004-2014",
      material: "Billet Steel",
      function: "High-performance camshaft for increased power and improved valve timing",
      weight: "2.1 lbs",
      condition: "New",
      partNumber: "HPC-TRX-450R",
      description: "Racing-grade camshaft designed for maximum power output. Features aggressive lift and duration profiles optimized for high-RPM performance. Includes valve springs and retainers for proper valve control.",
      specifications: "Lift: Intake 0.425\", Exhaust 0.410\", Duration: Intake 248°, Exhaust 240°, Material: Billet steel, Hardness: 58-62 HRC, Includes: Camshaft, valve springs, retainers",
      warranty: "1 Year Limited Warranty",
      stockQuantity: "15",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop"
      ],
      price: 349.99,
      originalPrice: 449.99,
      rating: 4.8,
      reviews: 94,
      status: "Active"
    }
  ];

  const handleAddSampleProducts = async () => {
    if (!window.confirm('This will add 6 sample products to your database. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      const addedProducts = [];

      for (let i = 0; i < sampleProducts.length; i++) {
        const product = sampleProducts[i];
        console.log(`Adding sample product ${i + 1}/${sampleProducts.length}: ${product.name}`);
        
        const docRef = await addDoc(collection(db, 'utvAtvParts'), product);
        const newProduct = { ...product, id: docRef.id };
        addedProducts.push(newProduct);
        
        console.log(`Sample product added successfully with ID: ${docRef.id}`);
      }

      // Update the products state
      setProducts([...products, ...addedProducts]);
      
      alert(`Successfully added ${sampleProducts.length} sample products!`);
    } catch (error) {
      console.error('Error adding sample products:', error);
      alert('Failed to add sample products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter ? p.category === filter : true)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to page 1 if filter/search changes and current page is out of range
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [search, filter, totalPages]);

  const categories = Array.from(new Set(products.map(p => p.category)));

  if (loading) {
    return (
      <div className="p-4 sm:p-8 bg-white rounded-xl shadow min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading UTV & ATV parts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 bg-white rounded-xl shadow min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow min-h-[300px] w-full p-4 sm:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 text-gray-800 truncate">UTV & ATV Parts Management</h1>
          <p className="text-sm sm:text-base text-gray-500 truncate">Manage your UTV & ATV parts inventory. Total: {products.length} parts</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => { setModalOpen(true); setEditingProduct(null); }}
            className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-all text-sm sm:text-base font-semibold transform hover:scale-110 duration-200"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-spin" />
            Add Product
          </button>
          {/* <button
            onClick={handleAddSampleProducts}
            className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all text-sm sm:text-base font-semibold transform hover:scale-110 duration-200"
          >
            <ClipboardDocumentListIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Add Sample Products
          </button> */}
        </div>
      </div>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="border p-3 rounded-lg w-full sm:w-1/2 lg:w-1/3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border p-3 rounded-lg w-full sm:w-1/2 lg:w-1/4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <ProductTable
        products={paginatedProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={setPreviewedProduct}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <ProductModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null); }}
        onSave={handleSave}
        product={editingProduct}
        mode={editingProduct ? 'edit' : 'add'}
      />
      <ProductPreviewModal
        open={!!previewedProduct}
        onClose={() => setPreviewedProduct(null)}
        product={previewedProduct}
      />
    </div>
  );
} 