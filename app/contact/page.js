import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Phone, Mail, MapPin, Building2 } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-900 to-gray-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
             style={{backgroundImage: "url('/images/contact.jpg')"}}></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Building2 className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 tracking-wider uppercase">Contact Us</h1>
          </div>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Get in touch with ATV Parts Pro team. We're here to help you with all your ATV needs.
          </p>
        </div>
      </div>

      <main className="flex-1 bg-white">
        {/* Contact Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
              If you have any questions, please feel free to get in touch with us via phone, text, email, the form
              below, or even on social media!
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 md:mb-16">
            {/* Left Side - Form */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">GET IN TOUCH</h3>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NAME</label>
                    <input
                      type="text"
                      placeholder="Enter your name*"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PHONE NUMBER</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number*"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">EMAIL</label>
                  <input
                    type="email"
                    placeholder="Enter your email*"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YOUR MESSAGE</label>
                  <textarea
                    rows={4}
                    placeholder="Enter your message..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-colors duration-200"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>

            {/* Right Side - Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">CONTACT INFORMATION</h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">PHONE</p>
                      <p className="text-gray-600">773-365-1240</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">ADDRESS</p>
                      <p className="text-gray-600">1425 N McLean Blvd Elgin, IL</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">EMAIL</p>
                      <p className="text-gray-600">office@steponetrains.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">BUSINESS HOURS</h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">MONDAY - FRIDAY</span>
                    <span className="text-gray-600">9:00 am - 8:00 pm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">SATURDAY</span>
                    <span className="text-gray-600">9:00 am - 6:00 pm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">SUNDAY</span>
                    <span className="text-gray-600">9:00 am - 5:00 pm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full">
            <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2965.0824050173574!2d-88.30814492346!3d42.037334971208976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880f0c8c8c8c8c8c%3A0x8c8c8c8c8c8c8c8c!2s1425%20N%20McLean%20Blvd%2C%20Elgin%2C%20IL%2060123!5e0!3m2!1sen!2sus!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
