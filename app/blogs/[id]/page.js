import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { User, MessageCircle, Calendar, Tag } from 'lucide-react';

// Enhanced blogPosts array with more context
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Must-Have ATV Parts for Winter Riding",
    image: "/images/blog/blog1.jpg",
    author: "sarah_atv",
    date: "2024-01-10",
    category: "Winter Safety",
    comments: 12,
    excerpt:
      "Prepare your ATV for winter with these essential parts. From winter tires to battery maintenance, discover the key components that will keep you safe on icy trails and help prevent breakdowns during cold weather...",
    content: `Winter riding can be treacherous, but with the right ATV parts, you can stay safe and avoid breakdowns. Here are the top 10 must-have parts:

1. Winter tires: Provide better traction on snow and ice.
2. Battery warmer: Prevents battery failure in extreme cold.
3. Engine block heater: Makes cold starts easier.
4. Windshield washer fluid: Specially formulated for freezing temps.
5. Wiper blades: Replace with winter-specific blades for best visibility.
6. Snow chains: Essential for deep snow or mountain riding.
7. Emergency kit: Include blankets, food, water, and a flashlight.
8. Antifreeze: Check and top up coolant levels.
9. Floor mats: Protect your ATV's interior from slush and salt.
10. Cargo mat: Keeps your cargo area clean and dry.

**Pro Tip:** Always check your tire pressure and battery health before winter sets in.`,
  },
  {
    id: 2,
    title: "How to Find Quality Used ATV Parts",
    image: "/images/blog/blog2.jpg",
    author: "mike_c3",
    date: "2024-02-05",
    category: "DIY & Savings",
    comments: 8,
    excerpt:
      "Learn the art of finding quality used ATV parts at scrap yards. Our comprehensive guide covers everything from safety tips to identifying genuine OEM parts, helping you save money while maintaining ATV reliability...",
    content: `Scrap yards can be gold mines for ATV enthusiasts and DIYers. Here are some tips:

- Always bring your own tools and gloves.
- Check for OEM markings to ensure authenticity.
- Inspect parts for wear, rust, and cracks.
- Ask the staff about the history of the ATV.
- Negotiate prices—most yards expect it!
- Follow all safety protocols and wear protective gear.

**Fun Fact:** Many rare ATV parts are only available at scrap yards, so keep an eye out for hidden gems!`,
  },
  {
    id: 3,
    title: "DIY Engine Maintenance: Essential Tools and Parts Guide",
    image: "/images/blog/blog3.jpg",
    author: "dave s.",
    date: "2024-03-12",
    category: "Maintenance",
    comments: 15,
    excerpt:
      "Master basic engine maintenance with our detailed guide. From oil changes to spark plug replacement, discover the essential tools and quality parts needed for successful DIY ATV repairs and maintenance...",
    content: `Engine maintenance is easier than you think. Start with these basics:

- Regular oil changes: Use the right oil for your engine.
- Replace spark plugs every 30,000 miles.
- Check belts and hoses for cracks or wear.
- Invest in a good socket set and torque wrench.
- Use quality replacement parts for best results.

**Extra:** Watch online tutorials or join a local ATV club for hands-on learning!`,
  },
  {
    id: 4,
    title: "Brake System Overhaul: Complete Parts Replacement Guide",
    image: "/images/blog/blog4.jpg",
    author: "emilyTii",
    date: "2024-04-02",
    category: "Safety",
    comments: 6,
    excerpt:
      "Complete brake system maintenance guide covering rotors, pads, calipers, and fluid. Learn when to replace components, how to choose quality parts, and ensure your ATV's stopping power remains optimal...",
    content: `Brakes are critical for safety. Here's what you need to know:

- Replace pads and rotors as needed (listen for squealing).
- Check calipers for leaks and proper movement.
- Flush brake fluid every 2 years.
- Use high-quality, ATV-specific parts.
- Follow manufacturer guidelines for installation.

**Tip:** If your brake pedal feels soft, have your system checked immediately!`,
  },
  {
    id: 5,
    title: "How to Choose the Right Oil for Your ATV",
    image: "/images/blog5.jpg",
    author: "oilguru",
    date: "2024-05-15",
    category: "Fluids & Lubricants",
    comments: 10,
    excerpt:
      "Choosing the right oil can extend your ATV engine's life. We break down the types of oil, viscosity ratings, and what works best for your riding habits...",
    content: `Oil choice matters! Here's how to pick:

- Check your owner's manual for recommended viscosity.
- Synthetic oils offer better protection, especially in extreme temperatures.
- Change oil at regular intervals for engine longevity.
- Consider your riding habits—short trips may require more frequent changes.

**Did you know?** Using the wrong oil can void your warranty and reduce engine efficiency.`,
  },
  {
    id: 6,
    title: "The Future of Electric ATVs: What to Expect",
    image: "/images/blogs6.jpg",
    author: "evfanatic",
    date: "2024-06-01",
    category: "EV & Tech",
    comments: 18,
    excerpt:
      "Electric ATVs are changing the landscape of the ATV industry. Explore the latest trends, battery technology, and what the future holds for EV ATV owners...",
    content: `EV ATVs are here to stay. Here's what to expect:

- Advances in battery technology for longer range.
- Faster and more accessible charging infrastructure.
- New models from major ATV manufacturers every year.
- Government incentives to accelerate adoption.
- Integration with smart home and grid tech.

**Looking ahead:** The next decade will see EV ATVs become mainstream, with lower costs and more options for everyone.`,
  }
];

function getRelatedPosts(currentId, category) {
  return blogPosts.filter(
    (post) => post.id !== currentId && post.category === category
  ).slice(0, 2);
}

export default function BlogPostPage({ params }) {
  const { id } = params;
  const post = blogPosts.find((b) => b.id === Number(id));
  const related = post ? getRelatedPosts(post.id, post.category) : [];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="mb-6">Sorry, the blog post you are looking for does not exist.</p>
            <a href="/blogs" className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold">Back to Blogs</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 lg:max-w-none">
            <div className="animate-fadein">
              <div className="relative w-full h-64 sm:h-80 lg:h-96 mb-8">
                <Image src={post.image} alt={post.title} fill className="object-cover rounded-lg" />
              </div>
              <div className="max-w-4xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">{post.title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500 mb-8">
                  <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> {post.category}</span>
                </div>
                <p className="text-gray-700 text-lg sm:text-xl mb-8 leading-relaxed">{post.excerpt}</p>
                <div className="text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-line mb-8 prose prose-lg max-w-none">{post.content}</div>
                <a href="/blogs" className="inline-block mt-8 px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition">Back to Blogs</a>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* All Blog Posts Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">All Blog Posts</h2>
                <div className="space-y-3">
                  {blogPosts.map((blog) => (
                    <a 
                      key={blog.id} 
                      href={`/blogs/${blog.id}`} 
                      className={`block p-3 rounded-xl transition-all ${
                        blog.id === post.id 
                          ? 'bg-red-100 border border-red-200 text-red-800' 
                          : 'bg-white hover:bg-gray-100 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={blog.image} alt={blog.title} width={48} height={48} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-semibold mb-1 line-clamp-2 ${
                            blog.id === post.id ? 'text-red-800' : 'text-gray-900'
                          }`}>
                            {blog.title}
                          </h3>
                          <div className="text-xs text-gray-500 flex gap-2 items-center">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {blog.category}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Related Posts Section */}
              {related.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-800">Related Posts</h2>
                  <div className="space-y-4">
                    {related.map((rel) => (
                      <a key={rel.id} href={`/blogs/${rel.id}`} className="block bg-white rounded-xl p-4 hover:bg-gray-100 transition shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={rel.image} alt={rel.title} width={64} height={64} className="object-cover w-full h-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{rel.title}</h3>
                            <div className="text-xs text-gray-500 flex gap-2 items-center">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {rel.date}</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Categories</h2>
                <div className="space-y-2">
                  {Array.from(new Set(blogPosts.map(blog => blog.category))).map((category) => (
                    <a 
                      key={category} 
                      href={`/blogs?category=${category}`} 
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                        category === post.category 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-white hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 