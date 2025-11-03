import React from "react";

// ✅ Updated FAQ Component
export const FAQ = () => (
  <div className="text-gray-800">
    <div className="space-y-4">
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-amber-300 transition-all duration-200">
        <h4 className="font-semibold text-lg text-gray-900 mb-2">
          How can I track my order?
        </h4>
        <p className="text-gray-600 text-sm">
          You can track your order from your account dashboard under "My Orders".
        </p>
      </div>
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-amber-300 transition-all duration-200">
        <h4 className="font-semibold text-lg text-gray-900 mb-2">
          What is the return policy?
        </h4>
        <p className="text-gray-600 text-sm">
          Returns are accepted within 14 days if the product is unused and in its original packaging.
        </p>
      </div>
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-amber-300 transition-all duration-200">
        <h4 className="font-semibold text-lg text-gray-900 mb-2">
          Do you offer international shipping?
        </h4>
        <p className="text-gray-600 text-sm">
          Yes, we ship worldwide with both standard and express delivery options.
        </p>
      </div>
    </div>
  </div>
);

// ✅ Updated Contact Component
export const Contact = () => (
  <div className="text-gray-800">
    <form className="space-y-5">
      <div>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Your Email"
          className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
        />
      </div>
      <div>
        <textarea
          placeholder="Your Message"
          rows="4"
          className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      >
        Send Message
      </button>
    </form>
  </div>
);

// ✅ Updated Blog Component
export const Blog = () => (
  <div className="text-gray-800">
    <div className="space-y-5">
      <article className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-amber-300 transition-all duration-200 group cursor-pointer">
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-amber-600 transition-colors">
          Top 5 Shopping Tips
        </h3>
        <p className="text-gray-600 text-sm mt-2">
          Learn how to save money and find the best deals while shopping online.
        </p>
        <div className="flex items-center mt-3 text-amber-600 text-sm font-medium">
          Read more
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
      <article className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-amber-300 transition-all duration-200 group cursor-pointer">
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-amber-600 transition-colors">
          Latest Fashion Trends
        </h3>
        <p className="text-gray-600 text-sm mt-2">
          Stay updated with this season's most popular styles and accessories.
        </p>
        <div className="flex items-center mt-3 text-amber-600 text-sm font-medium">
          Read more
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
      <article className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-amber-300 transition-all duration-200 group cursor-pointer">
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-amber-600 transition-colors">
          How to Choose Quality Products
        </h3>
        <p className="text-gray-600 text-sm mt-2">
          Our guide to identifying high-quality items for long-lasting use.
        </p>
        <div className="flex items-center mt-3 text-amber-600 text-sm font-medium">
          Read more
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </div>
  </div>
);