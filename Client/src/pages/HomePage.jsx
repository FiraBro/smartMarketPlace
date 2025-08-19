import React from "react";
import { HeroSection } from "../components/HeroSection";
import ProductSection from "../components/ProductSection";
import { FeaturesBanner } from "../components/FeaturesBanner";
import { BlogSection } from "../components/BlogSection";
import { Footer } from "../components/Footer";
import PopularProducts from "../components/PopulraProducts";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="bg-[#fff]">
      {/* Page Wrapper with width 85rem */}
      <div className="max-w-[85rem] mx-auto px-4">
        <Navbar />
        <HeroSection />
        <FeaturesBanner />
        <PopularProducts />
        <ProductSection />
        <BlogSection />
      </div>

      {/* Footer Full Width */}
      <Footer />
    </div>
  );
}
