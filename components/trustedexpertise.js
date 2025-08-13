import Image from "next/image"
import { Check, ArrowRight } from "lucide-react"
import { motion } from "framer-motion";

export default function TrustedExpertise() {
  return (
    <section className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mx-2 lg:mx-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Left Content */}
          <div className="space-y-4">
            {/* Trusted Expertise Badge */}
            <motion.div 
              className="inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-full border">
                Trusted Expertise
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div className="space-y-2"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: 'spring' }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Get a great deal for your ATV parts, sell to us now
              </h1>
            </motion.div>

            <motion.p 
              className="text-base text-gray-600 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
                Get the best value for your ATV parts with our transparent and straightforward selling process
            </motion.p>

            {/* Feature List */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-gray-900 font-medium text-sm">Experienced Professionals You Can Trust</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-gray-900 font-medium text-sm">Clear and Transparent Pricing, No Hidden Fees</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-gray-900 font-medium text-sm">Genuine Spares Parts</span>
              </div>
            </div>

            {/* CTA Button */}
            <motion.div className="pt-2"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-2xl flex items-center space-x-2 transition-colors duration-200 text-sm">
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          {/* Right Image Collage */}
          <div className="w-full h-[320px] flex items-center justify-center relative overflow-hidden">
            {/* Image 1 */}
            <div className="w-1/2 h-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/atv.jpg"
                alt="Family standing next to white car"
                width={400}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image 2: Woman in dealership */}
            <div className="w-1/2 h-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/atv1.jpg"
                alt="Professional woman in car dealership"
                width={400}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Slanted Divider at the seam */}
            <div
              className="absolute top-0 left-1/2 h-full w-2 bg-red-400 z-20 rounded"
              style={{ transform: 'translateX(-50%)' }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}
