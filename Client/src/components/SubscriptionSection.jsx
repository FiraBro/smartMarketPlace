// src/components/SubscriptionSection.jsx
import React, { useState } from "react";
import { subscribeNewsletter } from "../service/newsLetterService";

export const SubscriptionSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const data = await subscribeNewsletter(email);
      setMessage(data.message || "Subscribed successfully!");
      setEmail(""); // clear input
    } catch (err) {
      setError(err.message || "Subscription failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-gray-600 mb-8">
          Get the latest updates, special offers, and exclusive deals directly
          in your inbox.
        </p>

        <form
          className="flex flex-col sm:flex-row items-center justify-center max-w-2xl mx-auto"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:border-orange-400 focus:outline-none"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#F9A03F] text-white font-semibold hover:bg-orange-600 transition rounded-r-lg border border-[#F9A03F]"
          >
            {loading ? "Submitting..." : "Subscribe"}
          </button>
        </form>

        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}

        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};
