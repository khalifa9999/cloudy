import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LatestBlog from '@/components/latestBlog';
import { Building2 } from "lucide-react"
import Image from 'next/image';
import { User, MessageCircle } from 'lucide-react';

// Real blog data (single source of truth)
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Must-Have ATV Parts for Winter Riding",
    date: "December 15, 2024",
    readTime: "5 min read",
    image: "/images/blog/blog1.jpg",
    excerpt:
      "Prepare your ATV for winter with these essential parts. From winter tires to battery maintenance, discover the key components that will keep you safe on icy trails and help prevent breakdowns during cold weather...",
  },
  {
    id: 2,
    title: "How to Find Quality Used ATV Parts",
    date: "December 10, 2024",
    readTime: "7 min read",
    image: "/images/blog/blog2.jpg",
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
  {
    id: 5,
    title: "How to Choose the Right Oil for Your ATV",
    image: "/images/blog5.jpg",
    author: "oilguru",
    comments: 10,
    excerpt:
      "Choosing the right oil can extend your ATV engine's life. We break down the types of oil, viscosity ratings, and what works best for your riding habits...",
  },
  {
    id: 6,
    title: "The Future of Electric ATVs: What to Expect",
    image: "/images/blogs6.jpg",
    author: "evfanatic",
    comments: 18,
    excerpt:
      "Electric ATVs are changing the landscape of the ATV industry. Explore the latest trends, battery technology, and what the future holds for EV ATV owners...",
  }
];

export default function BlogsPage() {
  // Featured post is the first one
  const featured = blogPosts[0];
  const others = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Hero Section (unchanged) */}
      <div className="relative bg-gradient-to-br from-red-900 to-gray-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
             style={{backgroundImage: "url('https://images.pexels.com/photos/5506059/pexels-photo-5506059.jpeg')"}}></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Building2 className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 tracking-wider uppercase">Our Blog</h1>
          </div>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Insights, stories, and tips from ATV Parts Pro and the ATV community.
          </p>
        </div>
      </div>
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        {/* Featured + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Featured Post */}
          <div className="flex-1">
            <div className="relative rounded-2xl overflow-hidden shadow-lg group transition-transform duration-300 hover:scale-[1.02] animate-fadein">
              <Image src={featured.image} alt={featured.title} width={800} height={400} className="w-full" style={{height: '400px', objectFit: 'cover'}} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                <span className="inline-block bg-white/80 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full mb-2">Business</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">{featured.title}</h2>
                <p className="text-white text-base max-w-2xl mb-3 drop-shadow-lg line-clamp-2">{featured.excerpt}</p>

                <a href={`/blogs/${featured.id}`} className="inline-block mt-2 px-5 py-2 bg-red-500 text-white rounded-full font-semibold shadow hover:bg-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 animate-bounceIn">Read More</a>
              </div>
            </div>
          </div>
          {/* Sidebar: Other Featured Posts */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadein delay-100">
              <h3 className="text-lg font-bold mb-4">Other featured posts</h3>
              <div className="flex flex-col gap-4">
                {others.map((post, idx) => (
                  <div key={post.id} className="flex items-center gap-3 transition-transform duration-200 hover:scale-105 animate-fadein" style={{animationDelay: `${(idx+1)*80}ms`}}>
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={post.image} alt={post.title} width={56} height={56} className="object-cover w-full h-full" style={{height: '56px'}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{post.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
        {/* Responsive Sidebar for Mobile (horizontal scroll) */}
        <div className="lg:hidden mt-8">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {others.map((post, idx) => (
              <div key={post.id} className="min-w-[220px] bg-white rounded-xl shadow p-3 flex flex-col items-start transition-transform duration-200 hover:scale-105 animate-fadein" style={{animationDelay: `${(idx+1)*80}ms`}}>
                <div className="w-full h-24 rounded-lg overflow-hidden mb-2">
                  <Image src={post.image} alt={post.title} width={96} height={96} className="object-cover w-full h-full" />
                </div>
                <p className="text-xs font-semibold text-gray-800 line-clamp-2">{post.title}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Recent Posts Grid */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100 transition">All Posts</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-[1.02] group animate-fadein" style={{animationDelay: `${idx*80}ms`}}>
                <div className="relative w-full h-48 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                  <a href={`/blogs/${post.id}`} className="inline-block mt-2 px-4 py-2 bg-black text-white w-full text-center font-semibold shadow hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black animate-bounceIn">Read More</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 