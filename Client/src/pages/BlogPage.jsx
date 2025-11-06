import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendar, FaClock, FaUser, FaTag, FaSearch } from "react-icons/fa";

const BlogPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Shopping Tips to Save Money in 2024",
      excerpt: "Discover proven strategies to maximize your savings while shopping online and in-store. Learn about price tracking, coupon stacking, and seasonal sales.",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Shopping Tips",
      tags: ["savings", "tips", "money"]
    },
    {
      id: 2,
      title: "Latest Fashion Trends for Spring 2024",
      excerpt: "Explore the must-have styles, colors, and accessories dominating the fashion scene this spring. From sustainable fashion to bold patterns.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Michael Chen",
      date: "March 12, 2024",
      readTime: "7 min read",
      category: "Fashion",
      tags: ["fashion", "trends", "spring"]
    },
    {
      id: 3,
      title: "How to Identify High-Quality Products",
      excerpt: "Learn the key indicators of quality craftsmanship and materials. Our comprehensive guide helps you make informed purchasing decisions.",
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Emily Rodriguez",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Buying Guide",
      tags: ["quality", "guide", "reviews"]
    },
    {
      id: 4,
      title: "Sustainable Shopping: Making Eco-Friendly Choices",
      excerpt: "Discover how to reduce your environmental impact through conscious shopping habits and supporting sustainable brands.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "David Thompson",
      date: "March 8, 2024",
      readTime: "8 min read",
      category: "Sustainability",
      tags: ["eco-friendly", "sustainable", "green"]
    },
    {
      id: 5,
      title: "Smart Home Gadgets That Are Worth the Investment",
      excerpt: "A curated list of innovative smart home devices that truly enhance your living experience and provide real value for money.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      author: "Alexandra Kim",
      date: "March 5, 2024",
      readTime: "6 min read",
      category: "Technology",
      tags: ["tech", "gadgets", "smart home"]
    },
    {
      id: 6,
      title: "The Psychology of Consumer Behavior",
      excerpt: "Understanding why we buy what we buy and how marketers use psychological principles to influence purchasing decisions.",
      image: "https://images.unsplash.com/photo-1551833086-7597410dae7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      author: "Dr. Robert Martinez",
      date: "March 3, 2024",
      readTime: "9 min read",
      category: "Psychology",
      tags: ["psychology", "behavior", "marketing"]
    }
  ];

  const categories = ["All", "Shopping Tips", "Fashion", "Buying Guide", "Sustainability", "Technology", "Psychology"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Blog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-200"
                  : "bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-600 border border-gray-200 hover:border-amber-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              onClick={() => navigate(`/blog/${post.id}`)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-200 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                
                {/* Meta Information */}
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4 flex-wrap">
                  <div className="flex items-center mb-1">
                    <FaUser className="w-3 h-3 mr-1.5" />
                    <span className="text-xs">{post.author}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <FaCalendar className="w-3 h-3 mr-1.5" />
                    <span className="text-xs">{post.date}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <FaClock className="w-3 h-3 mr-1.5" />
                    <span className="text-xs">{post.readTime}</span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs flex items-center font-medium"
                    >
                      <FaTag className="w-2.5 h-2.5 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Read More */}
                <div className="flex items-center text-amber-600 font-semibold text-sm group-hover:text-amber-700 transition-colors duration-200">
                  Read full article
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaSearch className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search terms or browse different categories to find what you're looking for.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;