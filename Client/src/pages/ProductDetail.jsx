import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailView from "../components/ProductDetailView"; // ✅ import UI component
import { addToCart } from "../service/cartService";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  // console.log("Product ID from URL:", product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/listings/${id}`
        );
        const  data  = await res.json();
        console.log("Fetched product data:", data);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async (p) => {
    try {
      await addToCart(p._id, 1);
      alert(`${p.name} added to cart ✅`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Something went wrong ❌");
    }
  };

  return <ProductDetailView product={product} onAddToCart={handleAddToCart} />;
}
