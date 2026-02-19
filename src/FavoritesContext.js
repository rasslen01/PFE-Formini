// src/context/FavoritesContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export function useFavorites() {
  return useContext(FavoritesContext);
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const getId = (f) => f._id || f.id;

  const toggleFavorite = (formation) => {
    setFavorites((prev) => {
      const fId = getId(formation);
      const exists = prev.find((f) => getId(f) === fId);
      if (exists) {
        return prev.filter((f) => getId(f) !== fId);
      }
      return [...prev, { ...formation, addedAt: new Date().toISOString() }];
    });
  };

  const isFavorite = (id) => favorites.some((f) => getId(f) === id);

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => getId(f) !== id));
  };

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        removeFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}