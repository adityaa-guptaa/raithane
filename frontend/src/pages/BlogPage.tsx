import { ArrowRight, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title: "10 Reasons to Switch to Organic Farming",
    excerpt: "Discover the amazing benefits of organic farming for your health and the environment.",
    author: "Aditya Gupta",
    date: "Feb 12, 2026",
    category: "Organic Farming",
    image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 2,
    title: "Understanding Sustainable Agriculture in Nepal",
    excerpt: "Explore how traditional farming methods are being revitalized for a sustainable future.",
    author: "Sita Sharma",
    date: "Jan 25, 2026",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1592997572599-806f71d5b404?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 3,
    title: "The Journey of Raithane: From Farm to Table",
    excerpt: "Learn about our mission and how we bring fresh produce directly to your doorstep.",
    author: "Raithane Team",
    date: "Dec 10, 2025",
    category: "Our Story",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 4,
    title: "Seasonal Eating: Why It Matters",
    excerpt: "Why eating fruits and vegetables in season is better for your health and wallet.",
    author: "Nutrition Expert",
    date: "Nov 05, 2025",
    category: "Health & Wellness",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1000",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Blog</h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Insights, stories, and tips on organic living, sustainable farming, and healthy eating.
          </p>
        </div>

        {/* Featured Post (Optional - First item) */}
        <div className="mb-12">
          {BLOG_POSTS.slice(0, 1).map((post) => (
             <div key={post.id} className="relative rounded-3xl overflow-hidden shadow-xl group cursor-pointer h-[400px] md:h-[500px]">
               <img 
                 src={post.image} 
                 alt={post.title} 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
                 <div className="flex items-center gap-4 text-white/80 text-sm mb-3">
                   <span className="bg-[#992A16] text-white px-3 py-1 rounded-full text-xs font-semibold">{post.category}</span>
                   <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-gray-200 transition-colors">
                   {post.title}
                 </h2>
                 <p className="text-gray-300 line-clamp-2 md:line-clamp-3 mb-6 max-w-3xl text-lg">
                   {post.excerpt}
                 </p>
                 <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all">
                   Read Article <ArrowRight className="w-5 h-5" />
                 </Link>
               </div>
             </div>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100 flex flex-col h-full group">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#992A16] transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                  {post.excerpt}
                </p>
                
                <Link 
                  to={`/blog/${post.id}`} 
                  className="inline-flex items-center gap-1 text-[#992A16] font-semibold text-sm hover:gap-2 transition-all mt-auto"
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
