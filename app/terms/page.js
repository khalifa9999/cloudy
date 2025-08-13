"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ChevronRight, Calendar, FileText, Building2 } from "lucide-react"

const sections = [
  { id: "acceptance", title: "Acceptance of Terms", number: "1" },
  { id: "services", title: "Description of Services", number: "2" },
  { id: "orders", title: "Product Orders", number: "3" },
  { id: "shipping", title: "Shipping & Delivery", number: "4" },
  { id: "returns", title: "Returns & Exchanges", number: "5" },
  { id: "warranty", title: "Product Warranty", number: "6" },
  { id: "payment", title: "Payment Terms", number: "7" },
  { id: "intellectual", title: "Intellectual Property", number: "8" },
  { id: "limitation", title: "Limitation of Liability", number: "9" },
  { id: "governing", title: "Governing Law", number: "10" },
  { id: "changes", title: "Changes to Terms", number: "11" },
  { id: "contact", title: "Contact Information", number: "12" },
]

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id)

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => {
        const element = document.getElementById(section.id)
        return { element, id: section.id }
      }).filter(item => item.element !== null)
      
      console.log('Found section elements:', sectionElements.map(item => item.id))
      
      if (sectionElements.length === 0) {
        console.log('No section elements found!')
        return
      }
      
      let activeId = sectionElements[0].id
      
      // Find the section that's currently in view
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const rect = sectionElements[i].element.getBoundingClientRect()
        console.log(`Section ${sectionElements[i].id}: top=${rect.top}`)
        
        // Check if the section is at or above the threshold (150px from top)
        if (rect.top <= 150) { // Increased threshold slightly
          activeId = sectionElements[i].id
          console.log(`Setting active to: ${activeId}`)
          break
        }
      }
      
      setActiveSection(activeId)
    }
    
    // Debounce the scroll handler
    let timeout
    const debouncedHandleScroll = () => {
      clearTimeout(timeout)
      timeout = setTimeout(handleScroll, 10)
    }
    
    window.addEventListener("scroll", debouncedHandleScroll, { passive: true })
    window.addEventListener("resize", debouncedHandleScroll)
    
    // Set initial active section after a short delay to ensure DOM is ready
    setTimeout(handleScroll, 100)
    
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll)
      window.removeEventListener("resize", debouncedHandleScroll)
      clearTimeout(timeout)
    }
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-900 to-gray-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
             style={{backgroundImage: "url('https://images.pexels.com/photos/7841424/pexels-photo-7841424.jpeg')"}}></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Building2 className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 tracking-wider uppercase">Terms & Conditions</h1>
          </div>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our ATV products and services.
          </p>
        </div>
      </div>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left flex items-center justify-between p-2 rounded-lg transition-colors ${
                          activeSection === section.id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <span className="text-sm">
                          {section.number}. {section.title}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                {/* Introduction */}
                <div className="mb-12 p-6 bg-blue-50 rounded-2xl border-l-4 border-blue-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Our ATV Marketplace</h2>
                  <p className="text-gray-600 mb-6">
                    These Terms and Conditions ("Terms", "Terms and Conditions") govern your relationship with our ATV products and accessories marketplace ("us", "we", or "our"). Please read these Terms and Conditions carefully before using our Service. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                  </p>
                </div>
                {/* Section 1: Acceptance of Terms */}
                <section id="acceptance" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>
                    <p>
                      If you do not agree to abide by the above, please do not use this service. We reserve the right to change these conditions from time to time as we see fit and your continued use of the site will signify your acceptance of any adjustment to these terms.
                    </p>
                  </div>
                </section>
                {/* Section 2: Description of Services */}
                <section id="services" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Description of Services</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We provide an online platform for purchasing ATV parts, accessories, oils, fluids, tools, and related products. Our services include product listings, order processing, customer support, and delivery.
                    </p>
                  </div>
                </section>
                {/* Section 3: Product Orders */}
                <section id="orders" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Product Orders</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      By placing an order through our website, you warrant that you are legally capable of entering into binding contracts and that all information you provide is accurate and complete. We reserve the right to refuse or cancel any order at our discretion.
                    </p>
                  </div>
                </section>
                {/* Section 4: Shipping & Delivery */}
                <section id="shipping" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Shipping & Delivery</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We offer shipping to most locations. Shipping times and costs are provided at checkout. We are not responsible for delays outside our control, including carrier delays or customs processing.
                    </p>
                  </div>
                </section>
                {/* Section 5: Returns & Exchanges */}
                <section id="returns" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Returns & Exchanges</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We accept returns and exchanges within 30 days of delivery for most products, provided they are unused and in original packaging. Please see our Returns Policy for details and instructions.
                    </p>
                  </div>
                </section>
                {/* Section 6: Product Warranty */}
                <section id="warranty" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Product Warranty</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Some products may be covered by manufacturer warranties. Please refer to the product description or contact us for warranty details. We do not provide additional warranties unless explicitly stated.
                    </p>
                  </div>
                </section>
                {/* Section 7: Payment Terms */}
                <section id="payment" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Payment Terms</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      All payments must be made in full at the time of purchase. We accept major credit cards, PayPal, and other secure payment methods. Prices and availability are subject to change without notice.
                    </p>
                  </div>
                </section>
                {/* Section 8: Intellectual Property */}
                <section id="intellectual" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Intellectual Property</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      All content on this website, including images, logos, product descriptions, and graphics, is the property of our company or our suppliers and is protected by copyright and trademark laws. You may not use, reproduce, or distribute any content without our written permission.
                    </p>
                  </div>
                </section>
                {/* Section 9: Limitation of Liability */}
                <section id="limitation" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Limitation of Liability</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      In no event shall we, nor our directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                  </div>
                </section>
                {/* Section 10: Governing Law */}
                <section id="governing" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Governing Law</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      These Terms shall be interpreted and governed by the laws of the State of Illinois, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                    </p>
                  </div>
                </section>
                {/* Section 11: Changes to Terms */}
                <section id="changes" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Changes to Terms</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                    </p>
                    <p>
                      What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
                    </p>
                  </div>
                </section>
                {/* Section 12: Contact Information */}
                <section id="contact" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">12. Contact Information</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>If you have any questions about these Terms and Conditions, please contact us:</p>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <ul className="space-y-2">
                        <li>
                          <strong>Email:</strong> support@yourautosite.com
                        </li>
                        <li>
                          <strong>Phone:</strong> (Your phone number here)
                        </li>
                        <li>
                          <strong>Address:</strong> (Your business address here)
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
                {/* Footer CTA */}
                <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions about our Terms?</h3>
                    <p className="text-gray-600 mb-6">
                      Our support team is here to help clarify any questions you may have about these terms and conditions.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
