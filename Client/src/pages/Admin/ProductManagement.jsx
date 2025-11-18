import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductTable from "../../components/product/ProductTable";
import { getListingDetails } from "../../service/listingService";

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState("catalog");

  // FIX: Declare listings state
  const [listings, setListings] = useState([]);

  // Fetch listings when component mounts
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await getListingDetails();
        setListings(res?.data || []); // FIX: Save data
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      }
    };

    fetchListings();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>

        {/* FIX: Missing space before transition-colors */}
        <button className="bg-[#f9A03f] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#faa64d] transition-colors">
          Add Product
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            {
              id: "catalog",
              name: "Master Catalog",
              count: listings?.length || 0,
            },
            { id: "moderation", name: "Moderation Queue", count: 23 },
            { id: "categories", name: "Categories", count: 45 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-[#f9A03f] text-[#faa64d] hover:cursor-pointer"
                  : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer hover:border-gray-300"
              }`}
            >
              {tab.name}
              <span className="ml-2 py-0.5 px-2 text-xs bg-gray-200 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "catalog" && <ProductTable products={listings || []} />}

        {activeTab === "moderation" && <div>Moderation Queue Content</div>}

        {activeTab === "categories" && <div>Categories Management</div>}
      </motion.div>
    </motion.div>
  );
}
