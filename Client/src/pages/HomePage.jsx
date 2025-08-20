import React from "react";
import { HeroSection } from "../components/HeroSection";
import MostSoldProductSection from "../components/MostSoldProductSection";
import { FeaturesBanner } from "../components/FeaturesBanner";
import { BlogSection } from "../components/BlogSection";
import { Footer } from "../components/Footer";
import PopularProducts from "../components/PopularProducts";
import Navbar from "../components/Navbar";

export default function HomePage({ openCart, cartItems, total }) {
  return (
    <div className="bg-[#fff]">
      {/* Page Wrapper with width 85rem */}
      <div className="max-w-[85rem] mx-auto px-4">
        {/* ✅ Pass openCart & cartItems into Navbar */}
        <Navbar openCart={openCart} cartItems={cartItems} total={total} />

        <HeroSection />
        <FeaturesBanner />
        <PopularProducts />
        <MostSoldProductSection />
        <BlogSection />
      </div>

      {/* Footer Full Width */}
      <Footer />
    </div>
  );
}
