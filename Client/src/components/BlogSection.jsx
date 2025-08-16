// Blog Section Component
export const BlogSection = () => {
  const posts = [
    {
      id: 1,
      title: "How to Choose the Right Tech Gadgets",
      excerpt:
        "Learn how to select the best tech gadgets for your needs and budget.",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      date: "May 15, 2023",
    },
    {
      id: 2,
      title: "The Future of E-Commerce",
      excerpt:
        "Discover the latest trends shaping the future of online shopping.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      date: "June 2, 2023",
    },
    {
      id: 3,
      title: "Sustainable Shopping Tips",
      excerpt:
        "How to make environmentally friendly choices when shopping online.",
      image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      date: "June 10, 2023",
    },
  ];

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Latest From Our Blog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="text-gray-500 text-sm">{post.date}</span>
                <h3 className="font-semibold text-xl my-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
