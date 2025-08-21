// Blog Section Component
export const BlogSection = () => {
  const posts = [
    {
      id: 1,
      title: "How to Choose the Right Tech Gadgets",
      excerpt:
        "Learn how to select the best tech gadgets for your needs and budget.",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "May 15, 2023",
    },
    {
      id: 2,
      title: "The Future of E-Commerce",
      excerpt:
        "Discover the latest trends shaping the future of online shopping.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "June 2, 2023",
    },
    {
      id: 3,
      title: "Sustainable Shopping Tips",
      excerpt:
        "How to make environmentally friendly choices when shopping online.",
      image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      date: "June 10, 2023",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800 relative inline-block">
          Latest From Our Blog
          <span className="block w-16 h-1 bg-blue-600 mx-auto mt-3 rounded"></span>
        </h2>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image with hover zoom */}
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover transform hover:scale-110 transition duration-500"
                />
                {/* Date Badge */}
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  {post.date}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-3 hover:text-blue-600 transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-5">{post.excerpt}</p>
                <a
                  href="#"
                  className="inline-block text-blue-600 font-medium hover:underline"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
