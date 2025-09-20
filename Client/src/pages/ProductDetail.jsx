import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailView from "../components/ProductDetailView";
import { addToCart } from "../service/cartService";
import { getListingById } from "../service/listingService"; // ✅ use integrated service

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getListingById(id);
        console.log("Fetched product data:", data);

        setProduct(data.listing); // ✅ set only product
        setRelated(data.related); // ✅ set related products
      } catch (err) {
        console.error("Failed to fetch product:", err);
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

  return (
    <ProductDetailView
      product={product}
      related={related} // ✅ pass related to UI
      onAddToCart={handleAddToCart}
    />
  );
}
