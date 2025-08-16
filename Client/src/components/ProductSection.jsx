import React from "react";
import ProductCard from "./ProductCard";

const ProductSection = ({ title, icon }) => {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 89.99,
      oldPrice: 129.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.5,
      reviews: 124,
    },
    // ... other products
  ];

  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-2 rounded-lg mr-4">{icon}</div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <a href="#" className="ml-auto text-blue-600 hover:underline">
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
