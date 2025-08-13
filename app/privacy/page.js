import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2 } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-900 to-gray-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
             style={{backgroundImage: "url('https://images.pexels.com/photos/4152513/pexels-photo-4152513.jpeg')"}}></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Building2 className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 tracking-wider uppercase">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Your privacy matters. Learn how we protect and use your information at ATV Parts Pro.
          </p>
        </div>
      </div>
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>
        <div className="prose max-w-none text-gray-700">
          <p><strong>Last updated:</strong> [Date]</p>
          <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.</p>
          <h2>1. Information We Collect</h2>
          <p>We may collect personal information such as your name, email address, phone number, and payment details when you use our services or contact us.</p>
          <h2>2. How We Use Your Information</h2>
          <p>Your information is used to process orders, provide customer support, and improve our services. We do not sell your personal data to third parties.</p>
          <h2>3. Cookies</h2>
          <p>We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie preferences in your browser settings.</p>
          <h2>4. Data Security</h2>
          <p>We implement security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
          <h2>5. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Please review it periodically for changes.</p>
          <p>If you have any questions, please contact us via our Contact page.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 