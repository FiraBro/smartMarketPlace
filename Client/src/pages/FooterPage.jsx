import React from "react";

// ✅ FAQ Component
export const FAQ = () => (
  <div className="p-8 bg-gray-50 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
    <div className="space-y-4 text-gray-700">
      <div>
        <h4 className="font-semibold">How can I track my order?</h4>
        <p>
          You can track your order from your account dashboard under “My
          Orders”.
        </p>
      </div>
      <div>
        <h4 className="font-semibold">What is the return policy?</h4>
        <p>
          Returns are accepted within 14 days of delivery if the product is
          unused and in original packaging.
        </p>
      </div>
      <div>
        <h4 className="font-semibold">Do you offer international shipping?</h4>
        <p>
          Yes, we ship worldwide with standard and express delivery options.
        </p>
      </div>
    </div>
  </div>
);

// ✅ Contact Component
export const Contact = () => (
  <div className="p-8 bg-gray-50 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">📩 Contact Us</h2>
    <form className="space-y-4 max-w-md">
      <input
        type="text"
        placeholder="Your Name"
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Your Email"
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Your Message"
        rows="4"
        className="w-full p-2 border rounded"
      ></textarea>
      <button
        type="submit"
        className="bg-[#250902] text-white px-4 py-2 rounded hover:bg-amber-600 transition"
      >
        Send Message
      </button>
    </form>
  </div>
);

// ✅ Blog Component
export const Blog = () => (
  <div className="p-8 bg-gray-50 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">📝 Wait till finish Blog</h2>
    <div className="space-y-6 text-gray-700">
      <article>
        <h3 className="font-semibold text-lg">Top 5 Shopping Tips</h3>
        <p>
          Learn how to save money and find the best deals while shopping online.
        </p>
      </article>
      <article>
        <h3 className="font-semibold text-lg">Latest Fashion Trends</h3>
        <p>
          Stay updated with this season’s most popular styles and accessories.
        </p>
      </article>
      <article>
        <h3 className="font-semibold text-lg">
          How to Choose Quality Products
        </h3>
        <p>Our guide to identifying high-quality items for long-lasting use.</p>
      </article>
    </div>
  </div>
);
