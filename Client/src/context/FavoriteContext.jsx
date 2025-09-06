import { createContext, useContext, useState, useEffect } from "react";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product) => {
    setFavorites((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev; // avoid duplicates
      return [...prev, product];
    });
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoriteContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, clearFavorites }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
