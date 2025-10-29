import React from "react";
import { HeroSection } from "../components/HeroSection";
import MostSoldProductSection from "../components/MostSoldProductSection";
import { CategorySection } from "../components/CategorySection";
import { SubscriptionSection } from "../components/SubscriptionSection";
import PopularProducts from "../components/PopularProducts";

export default function HomePage() {
  return (
    <div className="max-w-[95rem] mx-auto px-4 bg-[#fff]">
      <HeroSection />

      {/* ✅ Add wrapper with correct id */}
      <div id="category-section">
        <CategorySection />
      </div>

      <PopularProducts />
      <MostSoldProductSection />
      <SubscriptionSection />
    </div>
  );
}
