'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { db } from '../../../lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useCart } from '../../../lib/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!productId) return;

        // 1) Firestore direct lookup by id
        const productRef = doc(db, 'utvAtvParts', String(productId));
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const data = { id: productSnap.id, ...productSnap.data() };
          setProduct(data);
          setActiveImage(data.images?.[0] || 'https://via.placeholder.com/900x600?text=No+Image');
          return;
        }

        // 2) localStorage fallback (for locally created items)
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
          const list = JSON.parse(savedProducts);
          const localMatch = list.find((p) => String(p.id) === String(productId));
          if (localMatch) {
            setProduct(localMatch);
            setActiveImage(localMatch.images?.[0] || 'https://via.placeholder.com/900x600?text=No+Image');
            return;
          }
        }

        // 3) sample seed fallback
        const sampleRes = await fetch('/sample-products.json');
        const sampleData = await sampleRes.json();
        const sampleMatch = sampleData.find((p) => String(p.id) === String(productId));
        if (sampleMatch) {
          setProduct(sampleMatch);
          setActiveImage(sampleMatch.images?.[0] || 'https://via.placeholder.com/900x600?text=No+Image');
          return;
        }

        // 4) collection scan fallback for legacy ids in doc fields
        const snapshot = await getDocs(collection(db, 'utvAtvParts'));
        const match = snapshot.docs
          .map((item) => ({ id: item.id, ...item.data() }))
          .find((item) => String(item.id) === String(productId) || String(item.productId) === String(productId));
        if (match) {
          setProduct(match);
          setActiveImage(match.images?.[0] || 'https://via.placeholder.com/900x600?text=No+Image');
        }
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length) return product.images;
    if (product.image) return [product.image];
    return ['https://via.placeholder.com/900x600?text=No+Image'];
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name || 'Unnamed Product',
      image: product.images?.[0] || product.image || 'https://via.placeholder.com/300x200?text=No+Image',
      brand: product.brand || 'Unknown',
      category: product.category || 'General'
    });
    alert(`${product.name || 'Product'} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow text-center max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">This product may have been removed or moved.</p>
          <Link href="/shop" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/shop" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Back to Shop
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            <div>
              <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={activeImage || images[0]}
                  alt={product.name || 'Product image'}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      onClick={() => setActiveImage(img)}
                      className={`h-20 rounded-md overflow-hidden border-2 ${
                        activeImage === img ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.brand && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{product.brand}</span>}
                {product.vehicleType && (
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{product.vehicleType}</span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name || 'Unnamed Product'}</h1>

              <div className="mb-6">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  In Stock
                </span>
              </div>

              <div className="mb-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Add to Cart
                </button>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {product.category && (
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="text-gray-900 font-medium">{product.category}</p>
                  </div>
                )}
                {product.partNumber && (
                  <div>
                    <p className="text-gray-500">Part Number</p>
                    <p className="text-gray-900 font-medium">{product.partNumber}</p>
                  </div>
                )}
                {product.model && (
                  <div>
                    <p className="text-gray-500">Model</p>
                    <p className="text-gray-900 font-medium">{product.model}</p>
                  </div>
                )}
                {product.year && (
                  <div>
                    <p className="text-gray-500">Year</p>
                    <p className="text-gray-900 font-medium">{product.year}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
