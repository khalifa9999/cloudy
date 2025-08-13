'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShieldCheck, CreditCard, Phone, QrCode, Loader2, Copy, Check, X } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../lib/CartContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState('');
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: ''
  });

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      router.push('/shop');
    } else {
      // Simulate a brief loading time for better UX
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cart, router]);

  // Calculate cart item count with safety check
  const itemCount = cart && cart.length > 0 ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

  const paymentMethods = [
    {
      id: 'zelle',
      name: 'Zelle',
      description: 'Bank-to-bank transfer',
      color: 'bg-purple-500',
      popular: true
    },
    {
      id: 'chime',
      name: 'Chime',
      description: 'Pay with your Chime account',
      color: 'bg-green-500',
      popular: true
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      description: 'Contactless payment with Apple Pay',
      color: 'bg-black',
      popular: false
    },
    {
      id: 'cashapp',
      name: 'Cash App',
      description: 'Pay with Cash App ($cashtag)',
      color: 'bg-gray-500',
      popular: false
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(orderInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = orderInfo;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Validate cart
    if (!cart || cart.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !orderDetails[field] || orderDetails[field].trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Starting order submission...', { cart, orderDetails, selectedPaymentMethod });
      
      // Validate cart items have required properties
      const validCartItems = cart.filter(item => item && (item.name || item.id));
      if (validCartItems.length === 0) {
        throw new Error('Cart items are invalid. Please refresh the page and try again.');
      }
      
      // Save order to Firestore
      const orderData = {
        customerInfo: {
          firstName: orderDetails.firstName,
          lastName: orderDetails.lastName,
          email: orderDetails.email,
          phone: orderDetails.phone,
          address: orderDetails.address,
          city: orderDetails.city,
          state: orderDetails.state,
          zipCode: orderDetails.zipCode,
          notes: orderDetails.notes || ''
        },
        orderItems: validCartItems.map(item => ({
          name: item.name || `Item ${item.id || 'Unknown'}`,
          quantity: item.quantity || 1,
          price: item.price || 0
        })),
        paymentMethod: selectedPaymentMethod,
        totalItems: itemCount,
        orderStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Order data prepared:', orderData);

      // Add order to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      const newOrderId = orderRef.id;
      setOrderId(newOrderId);
      
      console.log('Order saved to Firestore with ID:', newOrderId);

      // Send order email to admin
      const emailResponse = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: newOrderId,
          orderDetails,
          cartItems: validCartItems.map(item => ({
            name: item.name || `Item ${item.id || 'Unknown'}`,
            quantity: item.quantity || 1
          })),
          selectedPaymentMethod
        })
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Email API response error:', emailResponse.status, errorText);
        throw new Error(`Failed to send order email: ${emailResponse.status} ${errorText}`);
      }

      console.log('Order email sent successfully');

      // Prepare order information for the modal
      const orderSummary = validCartItems.map(item => 
        `${item.name || `Item ${item.id || 'Unknown'}`} x${item.quantity || 1}`
      ).join('\n');
      
      const orderInfoText = ` ORDER INFORMATION 

🆔 ORDER ID: ${newOrderId}

👤 CUSTOMER INFORMATION:
• Name: ${orderDetails.firstName} ${orderDetails.lastName}
• Email: ${orderDetails.email}
• Phone: ${orderDetails.phone}
• Address: ${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} ${orderDetails.zipCode}

📦 ORDER ITEMS:
${orderSummary}

📊 ORDER SUMMARY:
• Total Items: ${itemCount}
• Payment Method: ${selectedPaymentMethod.toUpperCase()}
• Additional Notes: ${orderDetails.notes || 'None'}

📱 Please copy this information and paste it when the chat opens with our agent.`;

      setOrderInfo(orderInfoText);
      setShowOrderModal(true);
      setIsProcessing(false);
      
      console.log('Order modal displayed successfully');

    } catch (error) {
      console.error('Error processing order:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        cart: cart,
        orderDetails: orderDetails,
        selectedPaymentMethod: selectedPaymentMethod
      });
      
      // More specific error messages
      if (error.message.includes('Failed to send order email')) {
        alert('Order saved but failed to send email. Please contact support.');
      } else if (error.message.includes('Firestore')) {
        alert('Failed to save order to database. Please try again.');
      } else {
        alert(`There was an error processing your order: ${error.message}`);
      }
      
      setIsProcessing(false);
    }
  };

  const proceedToMessenger = () => {
    try {
      // Validate that we have the necessary data
      if (!orderId || !orderDetails.firstName || !cart || cart.length === 0) {
        alert('Order information is incomplete. Please try submitting the order again.');
        return;
      }

      // Validate cart items have required properties
      const validCartItems = cart.filter(item => item && (item.name || item.id));
      if (validCartItems.length === 0) {
        alert('Cart items are invalid. Please try refreshing the page.');
        return;
      }

      // Create Facebook Messenger URL with pre-filled order details
      const orderSummary = validCartItems.map(item => 
        `${item.name || `Item ${item.id || 'Unknown'}`} x${item.quantity || 1}`
      ).join('\n');

      const messengerUrl = `https://m.me/Cloudysautosalvage?ref=order&order=${encodeURIComponent(
        `🚗 NEW ORDER REQUEST 🚗\n\n🆔 ORDER ID: ${orderId}\n\n👤 CUSTOMER INFORMATION:\n• Name: ${orderDetails.firstName} ${orderDetails.lastName}\n• Email: ${orderDetails.email}\n• Phone: ${orderDetails.phone}\n• Address: ${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} ${orderDetails.zipCode}\n\n📦 ORDER ITEMS:\n${orderSummary}\n\n📊 ORDER SUMMARY:\n• Total Items: ${itemCount}\n• Payment Method: ${selectedPaymentMethod.toUpperCase()}\n• Additional Notes: ${orderDetails.notes || 'None'}\n\n💰 Please provide pricing and payment instructions.`
      )}`;
      
      // Redirect to Facebook Messenger
      window.location.href = messengerUrl;
    } catch (error) {
      console.error('Error proceeding to messenger:', error);
      alert('There was an error redirecting to messenger. Please try again.');
    }
  };

  // Show loading if cart is not loaded yet or page is loading
  if (!cart || cart.length === 0 || isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Checkout</h2>
          <p className="text-gray-600">Please wait while we prepare your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={orderDetails.firstName}
                          onChange={handleInputChange}
                          required
                          disabled={isProcessing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={orderDetails.lastName}
                          onChange={handleInputChange}
                          required
                          disabled={isProcessing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={orderDetails.email}
                          onChange={handleInputChange}
                          required
                          disabled={isProcessing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={orderDetails.phone}
                          onChange={handleInputChange}
                          required
                          disabled={isProcessing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={orderDetails.address}
                          onChange={handleInputChange}
                          required
                          disabled={isProcessing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={orderDetails.city}
                            onChange={handleInputChange}
                            required
                            disabled={isProcessing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={orderDetails.state}
                            onChange={handleInputChange}
                            required
                            disabled={isProcessing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={orderDetails.zipCode}
                            onChange={handleInputChange}
                            required
                            disabled={isProcessing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={orderDetails.notes}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={isProcessing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Any special instructions or notes for your order..."
                    />
                  </div>
                </form>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>
                <p className="text-gray-600 mb-6">Choose your preferred payment method. No credit cards required.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !isProcessing && handlePaymentMethodSelect(method.id)}
                    >
                      {method.popular && (
                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {selectedPaymentMethod === method.id && (
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items in cart:</span>
                    <span className="font-medium">{itemCount} items</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Items:</span>
                      <span>{itemCount} items</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!selectedPaymentMethod || isProcessing}
                  className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl mb-4 relative overflow-hidden"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Submit Order</span>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </div>
                  )}
                </button>


                {/* Facebook Messenger Info */}
                {/* <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Complete Order on Facebook Messenger</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">After submitting, you'll see your order details and be redirected to our Facebook Messenger chat where your order details will be pre-filled for easy completion.</p>
                </div> */}

                {/* Security Badges */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Secure payment processing
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="w-4 h-4 text-green-500" />
                    Mobile-friendly payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Order Information Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">One more step to go! 🎉</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Order ID: {orderId}</span>
                </div>
                <p className="text-sm text-blue-700">
                  Please copy the order information below and proceed to chat with our agent.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Information (Copy this before proceeding):
                </label>
                <div className="relative">
                  <textarea
                    value={orderInfo}
                    readOnly
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm resize-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Copied to clipboard!
                  </p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Important Instructions:</span>
                </div>
                <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Copy the order information above to your clipboard</li>
                  <li>Click the "Proceed to Chat" button below</li>
                  <li>Once the chat opens, paste the order information</li>
                  <li>Our agent will assist you with pricing and payment</li>
                </ol>
              </div>
            </div>

            {/* Modal Footer - Fixed at bottom */}
            <div className="flex items-center rounded-lg  justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={proceedToMessenger}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 shadow-lg"
              >
                <Phone className="w-4 h-4" />
                Proceed to Chat
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
