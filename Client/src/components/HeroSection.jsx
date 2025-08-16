// Hero Section Component
export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to SmartMarketPlace
          </h1>
          <p className="text-xl mb-6">
            Discover amazing products at unbeatable prices
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
              Shop Now
            </button>
            <button className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
              Learn More
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            alt="Shopping"
            className="rounded-lg shadow-2xl max-w-md w-full"
          />
        </div>
      </div>
    </section>
  );
};
