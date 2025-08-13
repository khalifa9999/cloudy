"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Search, Plus, Minus, Building2 } from "lucide-react"

const faqData = [
  {
    id: 1,
    question: "What types of ATV products do you offer?",
    answer:
      "We offer a wide range of ATV products including ATV parts, accessories, oils and fluids, tools, and more. Browse our categories for the full selection.",
  },
  {
    id: 2,
    question: "How can I be sure your products are genuine?",
    answer:
      "We partner directly with trusted brands and suppliers to ensure all our products are 100% authentic and high quality.",
  },
  {
    id: 3,
    question: "What is your shipping policy?",
    answer:
      "We offer fast and reliable shipping across the country. Shipping times and costs are calculated at checkout based on your location and order size.",
  },
  {
    id: 4,
    question: "Can I return or exchange a product?",
    answer:
      "Yes! We have a hassle-free return and exchange policy. If you’re not satisfied with your purchase, you can return most items within 30 days of delivery. See our Returns Policy for details.",
  },
  {
    id: 5,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and other secure payment options. All transactions are encrypted for your safety.",
  },
  {
    id: 6,
    question: "How do I contact customer support?",
    answer:
      "You can reach our support team 24/7 via our Contact page, email, or live chat. We’re here to help with any questions or issues.",
  },
  // Additional FAQs (hidden by default)
  {
    id: 7,
    question: "How do I track my order?",
    answer:
      "Once your order ships, you’ll receive a tracking number by email. You can also log in to your account to view order status and tracking details.",
  },
  {
    id: 8,
    question: "Do you offer installation services?",
    answer:
      "While we don’t offer installation, we can recommend trusted local mechanics and provide installation guides for many products.",
  },
  {
    id: 9,
    question: "Can I place a bulk or wholesale order?",
    answer:
      "Yes! We offer special pricing for bulk and wholesale orders. Please contact us for a custom quote.",
  },
  {
    id: 10,
    question: "Are your used parts tested?",
    answer:
      "All used parts are thoroughly inspected and tested for quality and reliability before being listed for sale.",
  },
  {
    id: 11,
    question: "What if I can’t find the part I need?",
    answer:
      "If you can’t find a specific part, contact us! We’ll do our best to source it for you or notify you when it’s back in stock.",
  },
  {
    id: 12,
    question: "Do you ship internationally?",
    answer:
      "Currently, we only ship within the United States. We’re working on expanding to more countries soon.",
  },
  {
    id: 13,
    question: "How do I know if a part fits my ATV?",
    answer:
      "Each product page includes fitment information. If you're unsure, contact us with your ATV details and we'll help confirm compatibility.",
  },
  {
    id: 14,
    question: "What warranty do you offer?",
    answer:
      "Many new parts come with a manufacturer’s warranty. Used parts may have a limited warranty—see product details or contact us for specifics.",
  },
  {
    id: 15,
    question: "How do I cancel or change my order?",
    answer:
      "Contact us as soon as possible if you need to change or cancel your order. If it hasn’t shipped yet, we’ll do our best to accommodate your request.",
  },
]

export default function FAQsPage() {
  const [openItems, setOpenItems] = useState(new Set([1])) // First item open by default
  const [searchTerm, setSearchTerm] = useState("")
  const [showAll, setShowAll] = useState(false)

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Only show first 6 unless showAll is true or searching
  const visibleFAQs = searchTerm || showAll ? filteredFAQs : filteredFAQs.slice(0, 6)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-900 to-gray-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
             style={{backgroundImage: "url('https://images.pexels.com/photos/5428830/pexels-photo-5428830.jpeg')"}}></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Building2 className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 tracking-wider uppercase">FAQs</h1>
          </div>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Find answers to commonly asked questions about our ATV products and services.
          </p>
        </div>
      </div>
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-gray-600 text-lg mb-8">Have questions? We're here to help.</p>
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {/* FAQ Items */}
          <div className="space-y-4">
            {visibleFAQs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900 pr-4">{faq.question}</span>
                  <div className="flex-shrink-0">
                    {openItems.has(faq.id) ? (
                      <Minus className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>
                {openItems.has(faq.id) && (
                  <div className="px-6 pb-4">
                    <div className="text-gray-600 leading-relaxed">{faq.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Show More Button */}
          {!showAll && !searchTerm && filteredFAQs.length > 6 && (
            <div className="text-center mt-8">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                onClick={() => setShowAll(true)}
              >
                Show More
              </button>
            </div>
          )}
          {/* No Results */}
          {visibleFAQs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No FAQs found matching "{searchTerm}". Try a different search term.
              </p>
            </div>
          )}
          {/* Contact Section */}
          <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Please chat with our friendly team.
            </p>
            <button className="bg-black hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Get in touch
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
