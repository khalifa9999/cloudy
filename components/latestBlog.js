"use client"

import Image from "next/image"
import { ArrowLeft, ArrowRight, MessageCircle, User } from "lucide-react"
import { motion } from "framer-motion";

export default function LatestBlog() {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Must-Have ATV Parts for Winter Riding",
      date: "December 15, 2024",
      readTime: "5 min read",
      image: "/images/blog/blog1.jpg",
      author: "sarah_atv",
      comments: 12,
      excerpt:
        "Prepare your ATV for winter with these essential parts. From winter tires to battery maintenance, discover the key components that will keep you safe on icy trails and help prevent breakdowns during cold weather...",
    },
    {
      id: 2,
      title: "How to Find Quality Used ATV Parts",
      date: "December 10, 2024",
      readTime: "7 min read",
      image: "/images/blog/blog2.jpg",
      author: "mike_c3",
      comments: 8,
      excerpt:
        "Learn the art of finding quality used ATV parts at scrap yards. Our comprehensive guide covers everything from safety tips to identifying genuine OEM parts, helping you save money while maintaining ATV reliability...",
    },
    {
      id: 3,
      title: "DIY Engine Maintenance: Essential Tools and Parts Guide",
      image: "/images/blog/blog3.jpg",
      author: "dave s.",
      comments: 15,
      excerpt:
        "Master basic engine maintenance with our detailed guide. From oil changes to spark plug replacement, discover the essential tools and quality parts needed for successful DIY ATV repairs and maintenance...",
    },
    {
      id: 4,
      title: "Brake System Overhaul: Complete Parts Replacement Guide",
      image: "/images/blog/blog4.jpg",
      author: "emilyTii",
      comments: 6,
      excerpt:
        "Complete brake system maintenance guide covering rotors, pads, calipers, and fluid. Learn when to replace components, how to choose quality parts, and ensure your ATV's stopping power remains optimal...",
    },
  ]

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-red-500 mr-2 md:mr-3 text-2xl md:text-3xl">»»</span>
            LATEST BLOG
          </h2>
          <div className="flex space-x-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-white hover:shadow-md transition-all">
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-white hover:shadow-md transition-all">
              <ArrowRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="flex overflow-x-auto gap-6 pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:pb-0">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex-shrink-0 w-80 md:w-auto"
            >
              {/* Blog Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Blog Content */}
              <div className="p-6">
                {/* Blog Title */}
                <motion.h3 
                  className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 hover:text-red-500 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {post.title}
                </motion.h3>
                {/* Author and Comments */}
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>
                      Post by: <span className="text-red-500 font-medium">{post.author}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.comments} Comment(s)</span>
                  </div>
                </div>
                {/* Excerpt */}
                <motion.p 
                  className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  {post.excerpt}
                </motion.p>
                {/* Read More Button */}
                <button className="inline-flex items-center text-sm font-semibold text-gray-800 hover:text-red-500 transition-colors group">
                  READ MORE
                  <span className="ml-2 text-xs group-hover:translate-x-1 transition-transform">⊞</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
