// src/components/Cards/CentreCard.js
import React from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "../Button/FavoriteButton";

export default function CentreCard({ formation }) {
  // Images par domaine
  var getImage = function (domaine) {
    var images = {
      informatique: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=70",
      marketing: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=70",
      data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=70",
      mobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=70",
      ia: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=70",
      reseaux: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=70",
    };
    return images[domaine] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=70";
  };

  // Couleur badge
  var getColor = function (domaine) {
    var colors = {
      informatique: "#3b82f6",
      marketing: "#8b5cf6",
      data: "#10b981",
      mobile: "#ec4899",
      ia: "#f59e0b",
      reseaux: "#ef4444",
    };
    return colors[domaine] || "#0ea5e9";
  };

  // Ville formatée
  var getVilleName = function (ville) {
    var names = {
      tunis: "Tunis", ariana: "Ariana", sfax: "Sfax",
      sousse: "Sousse", bizerte: "Bizerte", monastir: "Monastir",
      nabeul: "Nabeul", ben_arous: "Ben Arous", manouba: "Manouba",
      gabes: "Gabès", kairouan: "Kairouan",
    };
    return names[ville] || ville;
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        position: "relative",
      }}
      className="hover:shadow-xl transform hover:-translate-y-1"
    >
      {/* ===== IMAGE ===== */}
      <div style={{ position: "relative", height: "140px", overflow: "hidden" }}>
        <img
          src={getImage(formation.domaine)}
          alt={formation.nom}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Overlay sombre */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
          }}
        ></div>

        {/* ❤️ BOUTON LOVE — HAUT DROITE */}
        <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 10 }}>
          <FavoriteButton formation={formation} size="sm" />
        </div>

        {/* Badge domaine — HAUT GAUCHE */}
        <span
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            backgroundColor: getColor(formation.domaine),
            color: "white",
            fontSize: "10px",
            fontWeight: "bold",
            padding: "3px 8px",
            borderRadius: "20px",
            textTransform: "uppercase",
          }}
        >
          {formation.domaine}
        </span>

        {/* Prix — BAS DROITE */}
        <span
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            backgroundColor: "#10b981",
            color: "white",
            fontSize: "11px",
            fontWeight: "bold",
            padding: "3px 8px",
            borderRadius: "20px",
          }}
        >
          {formation.prix ? formation.prix + " DT" : "Gratuit"}
        </span>
      </div>

      {/* ===== CONTENU ===== */}
      <div style={{ padding: "12px" }}>

        {/* Nom — CLIQUABLE vers profil du centre */}
        <Link
          to={"/centre/" + (formation._id || formation.id)}
          style={{ textDecoration: "none" }}
        >
          <h4
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              color: "#1e293b",
              marginBottom: "4px",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            className="hover:text-lightBlue-600"
          >
            {formation.nom}
          </h4>
        </Link>

        {/* Description */}
        {formation.description && (
          <p
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              marginBottom: "8px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.4",
            }}
          >
            {formation.description}
          </p>
        )}

        {/* Infos : Ville + Durée + Étudiants */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "10px",
              color: "#64748b",
              backgroundColor: "#f1f5f9",
              padding: "2px 6px",
              borderRadius: "20px",
            }}
          >
            📍 {getVilleName(formation.ville)}
          </span>

          {formation.duree && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "10px",
                color: "#64748b",
                backgroundColor: "#f1f5f9",
                padding: "2px 6px",
                borderRadius: "20px",
              }}
            >
              ⏱ {formation.duree}
            </span>
          )}

          {formation.nbEtudiants && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "10px",
                color: "#64748b",
                backgroundColor: "#f1f5f9",
                padding: "2px 6px",
                borderRadius: "20px",
              }}
            >
              👥 {formation.nbEtudiants}
            </span>
          )}
        </div>

        {/* Note étoiles + Formateur */}
        {(formation.rating || formation.formateur) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
              paddingBottom: "8px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            {formation.rating && (
              <div style={{ display: "flex", alignItems: "center" }}>
                {[1, 2, 3, 4, 5].map(function (star) {
                  return (
                    <span
                      key={star}
                      style={{
                        color: star <= Math.floor(formation.rating) ? "#facc15" : "#e2e8f0",
                        fontSize: "10px",
                        marginRight: "1px",
                      }}
                    >
                      ★
                    </span>
                  );
                })}
                <span style={{ fontSize: "10px", color: "#94a3b8", marginLeft: "4px" }}>
                  {formation.rating}
                </span>
              </div>
            )}

            {formation.formateur && (
              <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                🎓 {formation.formateur}
              </span>
            )}
          </div>
        )}

        {/* ===== BOUTONS ===== */}
        <div style={{ display: "flex", gap: "6px" }}>
          {/* Bouton Voir détails */}
          <Link
            to={"/centre/" + (formation._id || formation.id)}
            style={{
              flex: 1,
              textAlign: "center",
              backgroundColor: "#0ea5e9",
              color: "white",
              fontWeight: "bold",
              fontSize: "11px",
              textTransform: "uppercase",
              padding: "7px 10px",
              borderRadius: "6px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            <i className="fas fa-eye" style={{ marginRight: "4px" }}></i>
            Détails
          </Link>

          {/* Bouton S'inscrire */}
          <Link
            to={"/inscription/" + (formation._id || formation.id)}
            style={{
              textAlign: "center",
              backgroundColor: "#10b981",
              color: "white",
              fontWeight: "bold",
              fontSize: "11px",
              textTransform: "uppercase",
              padding: "7px 10px",
              borderRadius: "6px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            <i className="fas fa-pen" style={{ marginRight: "4px" }}></i>
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}