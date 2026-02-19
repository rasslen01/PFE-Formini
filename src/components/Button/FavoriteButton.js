// src/components/Button/FavoriteButton.js
import React, { useState } from "react";
import { useFavorites } from "../../FavoritesContext";

export default function FavoriteButton({ formation, size }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);

  const formationId = formation._id || formation.id;
  const liked = isFavorite(formationId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    toggleFavorite(formation);
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          width: size === "sm" ? "32px" : "38px",
          height: size === "sm" ? "32px" : "38px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size === "sm" ? "14px" : "16px",
          backgroundColor: liked ? "#ef4444" : "white",
          color: liked ? "white" : "#9ca3af",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          transform: isAnimating ? "scale(1.3)" : "scale(1)",
        }}
        title={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <i className={liked ? "fas fa-heart" : "far fa-heart"}></i>
      </button>
    </>
  );
}