import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendar, FaClock, FaUser, FaTag, FaShare, FaBookmark, FaShoppingBag, FaArrowRight } from "react-icons/fa";

const BlogPostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - in real app, you'd fetch this based on the ID
  const blogPost = {
    id: 1,
    title: "Top 10 Shopping Tips to Save Money in 2024",
    content: `
      <p class="text-gray-700 text-lg leading-relaxed mb-6">Shopping smart is more than just finding good deals—it's about developing habits that save you money while ensuring you get the best value for your purchases. In this comprehensive guide, we'll explore ten proven strategies that can transform your shopping experience.</p>
      
      <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Master the Art of Price Tracking</h2>
      <p class="text-gray-700 leading-relaxed mb-6">Price tracking tools and browser extensions can alert you when items you're interested in drop in price. Many retailers have predictable sale cycles, and tracking these patterns can save you significant amounts over time.</p>
      
      <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Leverage Cashback and Rewards Programs</h2>
      <p class="text-gray-700 leading-relaxed mb-6">Cashback websites and credit card rewards programs offer real money back on your purchases. Combine these with store sales and coupons for maximum savings potential.</p>
      
      <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Understand Seasonal Sales Cycles</h2>
      <p class="text-gray-700 leading-relaxed mb-6">Most products follow seasonal pricing patterns. Electronics often see price drops during Black Friday, while clothing typically goes on sale at the end of each season. Plan your purchases accordingly.</p>
      
      <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Subscribe to Newsletters Strategically</h2>
      <p class="text-gray-700 leading-relaxed mb-6">Many stores offer first-time subscriber discounts. Create a separate email account for shopping newsletters to avoid inbox clutter while still accessing exclusive deals and promotions.</p>
      
      <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Compare Prices Across Platforms</h2>
      <p class="text-gray-700 leading-relaxed mb-6">Don't assume one retailer has the best price. Use price comparison tools to check multiple stores instantly. Remember to factor in shipping costs and return policies when making your decision.</p>
    `,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    author: "Sarah Johnson",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Shopping Tips",
    tags: ["savings", "tips", "money", "budget", "shopping"]
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Latest Fashion Trends for Spring 2024",
      excerpt: "Explore the must-have styles and accessories dominating this season's fashion scene.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "March 12, 2024",
      category: "Fashion"
    },
    {
      id: 3,
      title: "How to Identify High-Quality Products",
      excerpt: "Learn the key indicators of quality craftsmanship and materials for informed purchasing decisions.",
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "March 10, 2024",
      category: "Buying Guide"
    },
    {
      id: 4,
      title: "Sustainable Shopping Practices",
      excerpt: "Discover eco-friendly shopping habits that benefit both your wallet and the environment.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      date: "March 8, 2024",
      category: "Sustainability"
    }
  ];

 

  return (
    <div className="min-h-screen bg-gray-50">
  
      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaShoppingBag className="w-4 h-4" />
            <span>{blogPost.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blogPost.title}
          </h1>
          
          {/* Author and Meta Info */}
          <div className="flex items-center justify-center space-x-8 text-gray-600 mb-8">
            <div className="flex items-center space-x-3">
              <img 
                src={blogPost.authorImage} 
                alt={blogPost.author}
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div>
                <div className="font-semibold text-gray-900">{blogPost.author}</div>
                <div className="text-sm text-gray-500">Shopping Expert</div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <FaCalendar className="w-4 h-4 text-amber-500" />
                <span>{blogPost.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="w-4 h-4 text-amber-500" />
                <span>{blogPost.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden mb-12 shadow-xl">
          <img 
            src={blogPost.image} 
            alt={blogPost.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
          <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
        </article>

        {/* Tags and Social Sharing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Tags</h3>
              <div className="flex flex-wrap gap-3">
                {blogPost.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 cursor-pointer"
                  >
                    <FaTag className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-12 border border-amber-100">
          <div className="flex items-start space-x-6">
            <img 
              src={blogPost.authorImage} 
              alt={blogPost.author}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">About the Author</h3>
              <h4 className="text-lg font-semibold text-amber-600 mb-2">{blogPost.author}</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Shopping expert and consumer advocate with over 10 years of experience helping people make smart purchasing decisions. 
                Sarah specializes in budget optimization, product quality assessment, and sustainable shopping practices.
              </p>
              <div className="flex space-x-4 text-sm text-gray-600">
                <span>📚 150+ Articles</span>
                <span>⭐ 4.9 Rating</span>
                <span>👥 50K+ Readers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Related Articles</h2>
            <button 
              onClick={() => navigate('/blog')}
              className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-200"
            >
              <span>View All Articles</span>
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <article 
                key={post.id}
                onClick={() => navigate(`/blog/${post.id}`)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendar className="w-4 h-4 mr-2" />
                    {post.date}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;