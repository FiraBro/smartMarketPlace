import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailView from "../components/ProductDetailView";
import { addToCart } from "../service/cartService";
import { getListingById } from "../service/listingService";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getListingById(id);
        // data.listing if API returns { listing, related }, fallback to data
        setProduct(data.listing || data);
        setRelated(data.related || []);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async (p) => {
    try {
      await addToCart(p._id, 1);
      alert(`${p.title} added to cart ✅`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Something went wrong ❌");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <ProductDetailView
      product={product}
      related={related}
      onAddToCart={handleAddToCart}
    />
  );
}
