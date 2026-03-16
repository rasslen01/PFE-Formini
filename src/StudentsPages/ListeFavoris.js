// src/pages/ListeFavoris.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentNavbar from "components/Navbars/StudentNavbar";
import Footer from "components/Footers/Footer";
import TextType from "../views/TextType";

const BACKEND_URL = "http://localhost:5000";

export default function Favorites() {
  var [favorites, setFavorites] = useState([]);
  var [searchTerm, setSearchTerm] = useState("");
  var [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(function () {
    try {
      var saved = localStorage.getItem("favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch (e) {
      setFavorites([]);
    }
  }, []);

  var removeFavorite = function (id) {
    var updated = favorites.filter(function (f) {
      return (f._id || f.id) !== id;
    });
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  var clearFavorites = function () {
    setFavorites([]);
    localStorage.setItem("favorites", JSON.stringify([]));
  };

  var favoritesCount = favorites.length;

  var filteredFavorites = favorites.filter(function (f) {
    if (!searchTerm || searchTerm === "") return true;
    var search = searchTerm.toLowerCase();
    return (
      (f.nom || "").toLowerCase().includes(search) ||
      (f.ville || "").toLowerCase().includes(search) ||
      (f.domaine || "").toLowerCase().includes(search)
    );
  });

  var getVilleName = function (ville) {
    var names = {
      tunis: "Tunis", ariana: "Ariana", sfax: "Sfax", sousse: "Sousse",
      bizerte: "Bizerte", monastir: "Monastir", nabeul: "Nabeul",
      ben_arous: "Ben Arous", manouba: "Manouba", gabes: "Gabès", kairouan: "Kairouan",
    };
    return names[ville] || ville || "Non précisée";
  };

  var getColor = function (domaine) {
    var colors = {
      informatique: "#3b82f6", marketing: "#8b5cf6", data: "#10b981",
      mobile: "#ec4899", ia: "#f59e0b", reseaux: "#ef4444",
    };
    return colors[domaine] || "#0ea5e9";
  };

  // ✅ Image par défaut selon domaine (fallback)
  var getDefaultImage = function (domaine) {
    var images = {
      informatique: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=70",
      marketing:    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=70",
      data:         "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=70",
      mobile:       "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=70",
      ia:           "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=70",
      reseaux:      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=70",
    };
    return images[domaine] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=70";
  };

  // ✅ Priorité: image uploadée → fallback domaine
  var getFormationImage = function (formation) {
    var img = formation.image || "";
    if (!img || img === "" || img === "default-formation.png") {
      return getDefaultImage(formation.domaine);
    }
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    var cleanPath = img.startsWith("/") ? img : "/" + img;
    return BACKEND_URL + cleanPath;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .fav-root { font-family: 'DM Sans', sans-serif; }
        .fav-heading { font-family: 'Syne', sans-serif; }

        .fav-hero {
          position: relative; min-height: 38vh;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; padding: 90px 0 80px;
        }
        .fav-hero-bg {
          position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1470&q=80');
          background-size: cover; background-position: center;
        }
        .fav-hero-bg::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(2,6,23,0.82) 0%, rgba(15,23,42,0.68) 100%);
        }
        .fav-hero-content {
          position: relative; z-index: 2;
          text-align: center; max-width: 640px; margin: 0 auto; padding: 0 24px;
        }
        .fav-hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 12px;
          min-height: 3.5rem; display: flex; align-items: center; justify-content: center;
        }
        .fav-hero-sub { font-size: 1rem; color: rgba(255,255,255,0.6); margin-bottom: 28px; }
        .fav-hero-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff; font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.8px;
          padding: 13px 28px; border-radius: 50px; text-decoration: none;
          box-shadow: 0 6px 24px rgba(14,165,233,0.4); transition: all 0.25s;
        }
        .fav-hero-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(14,165,233,0.5); color: #fff; }
        .fav-wave { position: absolute; bottom: 0; left: 0; right: 0; pointer-events: none; }

        .fav-section {
          background: #f1f5f9;
          background-image: radial-gradient(ellipse 70% 50% at 5% 0%, rgba(14,165,233,0.06), transparent),
            radial-gradient(ellipse 60% 40% at 95% 100%, rgba(2,132,199,0.05), transparent);
          padding: 52px 0 80px;
        }

        .fav-toolbar {
          background: #fff; border-radius: 18px; padding: 18px 24px; margin-bottom: 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06);
          border: 1px solid rgba(226,232,240,0.8);
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;
        }
        .fav-toolbar-left { display: flex; align-items: center; gap: 14px; }
        .fav-heart-icon {
          width: 46px; height: 46px; border-radius: 14px;
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .fav-toolbar-right { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .fav-search-wrap { position: relative; }
        .fav-search-wrap input {
          width: 220px; padding: 9px 14px 9px 36px;
          border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.82rem;
          font-family: 'DM Sans', sans-serif; outline: none; color: #334155;
          transition: border-color 0.2s, box-shadow 0.2s; background: #f8fafc;
        }
        .fav-search-wrap input:focus { border-color: #7dd3fc; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); background: #fff; }
        .fav-search-wrap i { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.75rem; }
        .fav-clear-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px; background: #fef2f2; color: #ef4444;
          border: 1px solid #fecaca; border-radius: 10px; font-size: 0.8rem;
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .fav-clear-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .fav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }

        .fav-card {
          background: #fff; border-radius: 18px; overflow: hidden;
          border: 1px solid rgba(226,232,240,0.7);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
          transition: transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.28s;
          animation: fav-card-in 0.4s ease both;
        }
        .fav-card:hover { transform: translateY(-5px); box-shadow: 0 2px 6px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.12); }
        .fav-card-img { position: relative; height: 130px; overflow: hidden; }
        .fav-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; display: block; }
        .fav-card:hover .fav-card-img img { transform: scale(1.07); }
        .fav-card-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%); }
        .fav-domain-badge {
          position: absolute; top: 10px; left: 10px;
          font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
          color: #fff; padding: 3px 10px; border-radius: 50px;
        }
        .fav-price-badge {
          position: absolute; bottom: 10px; right: 10px;
          background: rgba(16,185,129,0.95); color: #fff;
          font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 50px;
        }
        .fav-card-body { padding: 14px 16px; }
        .fav-card-title {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem;
          color: #0f172a; margin-bottom: 5px; text-decoration: none;
          display: block; line-height: 1.3; transition: color 0.2s;
        }
        .fav-card-title:hover { color: #0ea5e9; }
        .fav-meta { font-size: 0.72rem; color: #94a3b8; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; }
        .fav-added { font-size: 0.68rem; color: #cbd5e1; margin-bottom: 12px; }
        .fav-card-actions { display: flex; gap: 8px; }
        .fav-details-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.72rem;
          text-transform: uppercase; letter-spacing: 0.4px; padding: 8px; border-radius: 10px;
          text-decoration: none; box-shadow: 0 3px 10px rgba(14,165,233,0.3); transition: all 0.2s;
        }
        .fav-details-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(14,165,233,0.4); color: #fff; }
        .fav-remove-btn {
          width: 34px; height: 34px; border-radius: 10px;
          background: #fef2f2; border: 1px solid #fecaca; color: #ef4444;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem; transition: all 0.2s; flex-shrink: 0;
        }
        .fav-remove-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .fav-empty { text-align: center; padding: 60px 0; }
        .fav-empty-card {
          background: #fff; border-radius: 24px; padding: 56px 40px;
          max-width: 440px; margin: 0 auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.07);
          border: 1px solid rgba(226,232,240,0.8);
        }
        .fav-empty-emoji { font-size: 3.5rem; margin-bottom: 18px; display: block; }
        .fav-empty-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .fav-empty-sub { font-size: 0.87rem; color: #94a3b8; margin-bottom: 24px; line-height: 1.6; }
        .fav-explore-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.8rem;
          text-transform: uppercase; letter-spacing: 0.6px; padding: 12px 28px;
          border-radius: 50px; text-decoration: none;
          box-shadow: 0 5px 18px rgba(14,165,233,0.35); transition: all 0.25s;
        }
        .fav-explore-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(14,165,233,0.45); color: #fff; }
        .fav-reset-btn {
          display: inline-block; padding: 10px 24px; background: #0ea5e9; color: #fff;
          border: none; border-radius: 10px; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .fav-reset-btn:hover { background: #0284c7; }

        .fav-modal-overlay {
          position: fixed; inset: 0; background: rgba(15,23,42,0.6);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
          z-index: 9999; animation: fav-fade-in 0.2s ease;
        }
        .fav-modal {
          background: #fff; border-radius: 24px; padding: 40px 36px;
          max-width: 380px; width: 90%; text-align: center;
          box-shadow: 0 24px 80px rgba(0,0,0,0.2); animation: fav-slide-up 0.25s ease;
        }
        .fav-modal-emoji { font-size: 3rem; margin-bottom: 16px; display: block; }
        .fav-modal-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .fav-modal-sub { font-size: 0.85rem; color: #94a3b8; margin-bottom: 24px; }
        .fav-modal-actions { display: flex; gap: 10px; justify-content: center; }
        .fav-modal-cancel {
          padding: 10px 22px; background: #f1f5f9; color: #475569;
          border: 1px solid #e2e8f0; border-radius: 10px; font-weight: 600;
          font-size: 0.85rem; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .fav-modal-cancel:hover { background: #e2e8f0; }
        .fav-modal-confirm {
          padding: 10px 22px; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff;
          border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.85rem; cursor: pointer; box-shadow: 0 4px 14px rgba(239,68,68,0.35); transition: all 0.2s;
        }
        .fav-modal-confirm:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(239,68,68,0.45); }

        @keyframes fav-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fav-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fav-card-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <StudentNavbar />

      <div className="fav-root fav-hero">
        <div className="fav-hero-bg"></div>
        <div className="fav-hero-content">
          <h1 className="fav-hero-title">
            <TextType text={["Mes Favoris "]} typingSpeed={75} deletingSpeed={50} pauseDuration={2000} showCursor />
          </h1>
          <p className="fav-hero-sub">
            {favoritesCount > 0
              ? favoritesCount + " formation" + (favoritesCount > 1 ? "s" : "") + " sauvegardée" + (favoritesCount > 1 ? "s" : "")
              : "Aucun favori pour le moment"}
          </p>
          <Link to="/landing" className="fav-hero-btn">
            <i className="fas fa-search"></i>Découvrir des formations
          </Link>
        </div>
        <div className="fav-wave">
          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 2560 100" style={{ display: "block", width: "100%", height: 80 }}>
            <polygon fill="#f1f5f9" points="2560 0 2560 100 0 100" />
          </svg>
        </div>
      </div>

      <section className="fav-root fav-section">
        <div className="container mx-auto px-4">
          <div className="fav-toolbar">
            <div className="fav-toolbar-left">
              <div className="fav-heart-icon">
                <i className="fas fa-heart" style={{ color: "#ef4444", fontSize: 20 }}></i>
              </div>
              <div>
                <h2 className="fav-heading" style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Mes Favoris
                </h2>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0 }}>
                  {favoritesCount} formation{favoritesCount > 1 ? "s" : ""} sauvegardée{favoritesCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="fav-toolbar-right">
              <div className="fav-search-wrap">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Rechercher..." value={searchTerm}
                  onChange={function (e) { setSearchTerm(e.target.value); }} />
              </div>
              {favoritesCount > 0 && (
                <button className="fav-clear-btn" onClick={function () { setShowConfirmClear(true); }}>
                  <i className="fas fa-trash-alt"></i>Tout supprimer
                </button>
              )}
            </div>
          </div>

          {showConfirmClear && (
            <div className="fav-modal-overlay">
              <div className="fav-modal">
                <span className="fav-modal-emoji">💔</span>
                <h3 className="fav-modal-title">Supprimer tous les favoris ?</h3>
                <p className="fav-modal-sub">Cette action est irréversible.</p>
                <div className="fav-modal-actions">
                  <button className="fav-modal-cancel" onClick={function () { setShowConfirmClear(false); }}>Annuler</button>
                  <button className="fav-modal-confirm" onClick={function () { clearFavorites(); setShowConfirmClear(false); }}>Tout supprimer</button>
                </div>
              </div>
            </div>
          )}

          {filteredFavorites.length > 0 ? (
            <div className="fav-grid">
              {filteredFavorites.map(function (formation, index) {
                var formationId = formation._id || formation.id;
                return (
                  <div key={formationId || index} className="fav-card" style={{ animationDelay: `${index * 0.06}s` }}>
                    <div className="fav-card-img">
                      {/* ✅ Image uploadée ou fallback domaine */}
                      <img
                        src={getFormationImage(formation)}
                        alt={formation.nom || "Formation"}
                        onError={function (e) { e.target.src = getDefaultImage(formation.domaine); }}
                      />
                      <div className="fav-card-img-overlay"></div>
                      <span className="fav-domain-badge" style={{ background: getColor(formation.domaine) }}>
                        {formation.domaine || "Autre"}
                      </span>
                      <span className="fav-price-badge">
                        {formation.prix ? formation.prix + " DT" : "Gratuit"}
                      </span>
                    </div>

                    <div className="fav-card-body">
                      <Link to={"/formation/" + formationId} className="fav-card-title">
                        {formation.nom || "Sans nom"}
                      </Link>
                      <p className="fav-meta"><span>📍</span> {getVilleName(formation.ville)}</p>

                      {formation.rating && (
                        <div style={{ marginBottom: 4 }}>
                          {[1,2,3,4,5].map(function (star) {
                            return (
                              <span key={star} style={{ color: star <= Math.floor(formation.rating) ? "#facc15" : "#e2e8f0", fontSize: "0.72rem" }}>★</span>
                            );
                          })}
                          <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginLeft: 3 }}>{formation.rating}</span>
                        </div>
                      )}

                      {formation.formateur && (
                        <p className="fav-meta"><span>🎓</span> {formation.formateur}</p>
                      )}

                      {formation.addedAt && (
                        <p className="fav-added">
                          ⏱ Ajouté le {new Date(formation.addedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}

                      <div className="fav-card-actions">
                        <Link to={"/formation/" + formationId} className="fav-details-btn">
                          <i className="fas fa-eye" style={{ fontSize: "0.7rem" }}></i>Détails
                        </Link>
                        <button className="fav-remove-btn" onClick={function () { removeFavorite(formationId); }} title="Retirer des favoris">
                          <i className="fas fa-heart-broken"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="fav-empty">
              <div className="fav-empty-card">
                {searchTerm ? (
                  <>
                    <span className="fav-empty-emoji">🔍</span>
                    <h3 className="fav-empty-title">Aucun résultat</h3>
                    <p className="fav-empty-sub">Aucune formation ne correspond à "{searchTerm}"</p>
                    <button className="fav-reset-btn" onClick={function () { setSearchTerm(""); }}>Effacer la recherche</button>
                  </>
                ) : (
                  <>
                    <span className="fav-empty-emoji">💔</span>
                    <h3 className="fav-empty-title">Aucun favori pour le moment</h3>
                    <p className="fav-empty-sub">Cliquez sur le bouton ❤️ sur une formation pour la sauvegarder ici.</p>
                    <Link to="/landing" className="fav-explore-btn">
                      <i className="fas fa-compass"></i>Explorer les formations
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}