export const SubscriptionSection = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-gray-600 mb-8">
          Get the latest updates, special offers, and exclusive deals directly
          in your inbox.
        </p>

        {/* Form */}
        <form className="flex flex-col sm:flex-row items-center justify-center max-w-2xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:border-orange-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#F9A03F] text-white font-semibold hover:bg-orange-600 transition rounded-r-lg border border-[#F9A03F]"
          >
            Subscribe
          </button>
        </form>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};
