import React from "react";
import { HeroSection } from "../components/HeroSection";
import MostSoldProductSection from "../components/MostSoldProductSection";
import { CategorySection } from "../components/CategorySection";
import { SubscriptionSection } from "../components/SubscriptionSection";
import { Footer } from "../components/Footer";
import PopularProducts from "../components/PopularProducts";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="max-w-[85rem] mx-auto px-4 bg-[#fff]">
      <HeroSection />
      <CategorySection />
      <PopularProducts />
      <MostSoldProductSection />
      <SubscriptionSection />
    </div>
  );
}
