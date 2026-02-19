// src/pages/ListeFavoris.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentNavbar from "components/Navbars/StudentNavbar";
import Footer from "components/Footers/Footer";
import TextType from "../views/TextType";

export default function Favorites() {
  var [favorites, setFavorites] = useState([]);
  var [searchTerm, setSearchTerm] = useState("");
  var [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(function () {
    try {
      var saved = localStorage.getItem("favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
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
    if (!searchTerm || searchTerm === "") {
      return true;
    }
    var search = searchTerm.toLowerCase();
    var nom = f.nom || "";
    var ville = f.ville || "";
    var domaine = f.domaine || "";
    return (
      nom.toLowerCase().includes(search) ||
      ville.toLowerCase().includes(search) ||
      domaine.toLowerCase().includes(search)
    );
  });

  var getVilleName = function (ville) {
    var names = {
      tunis: "Tunis",
      ariana: "Ariana",
      sfax: "Sfax",
      sousse: "Sousse",
      bizerte: "Bizerte",
      monastir: "Monastir",
      nabeul: "Nabeul",
      ben_arous: "Ben Arous",
      manouba: "Manouba",
      gabes: "Gabès",
      kairouan: "Kairouan",
    };
    return names[ville] || ville || "Non précisée";
  };

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

  return (
    <>
      <StudentNavbar />

      <main>
        <div
          className="relative pt-24 pb-32 flex content-center items-center justify-center"
          style={{ minHeight: "35vh" }}
        >
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1470&q=80')",
            }}
          >
            <span className="absolute w-full h-full bg-black opacity-75"></span>
          </div>

          <div className="container relative mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center">
              <div className="w-full lg:w-7/12 px-4">
                <h1 className="text-white font-semibold text-5xl">
                  <TextType
                    text={[
                      "Mes Favoris ❤️",
                      "Les formations que j'aime.",
                      favoritesCount +
                        " formation" +
                        (favoritesCount > 1 ? "s" : "") +
                        " sauvegardée" +
                        (favoritesCount > 1 ? "s" : "") +
                        ".",
                    ]}
                    typingSpeed={75}
                    deletingSpeed={50}
                    pauseDuration={2000}
                    showCursor
                    cursorCharacter="_"
                  />
                </h1>
                <p className="mt-4 text-lg text-blueGray-200">
                  {favoritesCount > 0
                    ? favoritesCount +
                      " formation" +
                      (favoritesCount > 1 ? "s" : "") +
                      " sauvegardée" +
                      (favoritesCount > 1 ? "s" : "")
                    : "Aucun favori pour le moment"}
                </p>
                <Link
                  to="/landing"
                  className="inline-block mt-8 bg-lightBlue-500 text-white font-bold uppercase text-sm px-8 py-4 rounded-full shadow-lg hover:bg-lightBlue-600 transition-all duration-150"
                >
                  <i className="fas fa-search mr-2"></i>
                  Découvrir des formations
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none h-20">
            <svg
              className="absolute bottom-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 2560 100"
            >
              <polygon
                className="fill-current text-blueGray-100"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
      </main>

      <section className="relative bg-blueGray-100 py-16">
        <div className="container mx-auto px-4">
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                }}
              >
                <i
                  className="fas fa-heart"
                  style={{ color: "#ef4444", fontSize: "20px" }}
                ></i>
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  Mes Favoris
                </h2>
                <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
                  {favoritesCount} formation
                  {favoritesCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={function (e) {
                    setSearchTerm(e.target.value);
                  }}
                  style={{
                    width: "220px",
                    padding: "8px 12px 8px 32px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
                <i
                  className="fas fa-search"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "12px",
                  }}
                ></i>
              </div>

              {favoritesCount > 0 && (
                <button
                  onClick={function () {
                    setShowConfirmClear(true);
                  }}
                  style={{
                    padding: "8px 14px",
                    backgroundColor: "#fef2f2",
                    color: "#ef4444",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  <i
                    className="fas fa-trash-alt"
                    style={{ marginRight: "4px" }}
                  ></i>
                  Tout supprimer
                </button>
              )}
            </div>
          </div>

          {showConfirmClear && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "32px",
                  maxWidth: "400px",
                  width: "90%",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>
                  💔
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Supprimer tous les favoris ?
                </h3>
                <p
                  style={{
                    color: "#94a3b8",
                    marginBottom: "20px",
                    fontSize: "14px",
                  }}
                >
                  Cette action est irréversible.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={function () {
                      setShowConfirmClear(false);
                    }}
                    style={{
                      padding: "8px 20px",
                      backgroundColor: "#e2e8f0",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={function () {
                      clearFavorites();
                      setShowConfirmClear(false);
                    }}
                    style={{
                      padding: "8px 20px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Tout supprimer
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredFavorites.map(function (formation, index) {
                var formationId = formation._id || formation.id;

                return (
                  <div
                    key={formationId || index}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                    }}
                    className="hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div
                      style={{
                        position: "relative",
                        height: "120px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={getImage(formation.domaine)}
                        alt={formation.nom || "Formation"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                        }}
                      ></div>

                      <span
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          backgroundColor: getColor(formation.domaine),
                          color: "white",
                          fontSize: "9px",
                          fontWeight: "bold",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          textTransform: "uppercase",
                        }}
                      >
                        {formation.domaine || "Autre"}
                      </span>

                      <span
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          right: "8px",
                          backgroundColor: "#10b981",
                          color: "white",
                          fontSize: "11px",
                          fontWeight: "bold",
                          padding: "2px 8px",
                          borderRadius: "20px",
                        }}
                      >
                        {formation.prix
                          ? formation.prix + " DT"
                          : "Gratuit"}
                      </span>
                    </div>

                    <div style={{ padding: "12px" }}>
                      <Link
                        to={"/centre/" + formationId}
                        style={{ textDecoration: "none" }}
                      >
                        <h4
                          style={{
                            fontWeight: "bold",
                            fontSize: "13px",
                            color: "#1e293b",
                            marginBottom: "4px",
                            cursor: "pointer",
                          }}
                          className="hover:text-lightBlue-600"
                        >
                          {formation.nom || "Sans nom"}
                        </h4>
                      </Link>

                      <p
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          marginBottom: "6px",
                        }}
                      >
                        📍 {getVilleName(formation.ville)}
                      </p>

                      {formation.rating && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "6px",
                          }}
                        >
                          {[1, 2, 3, 4, 5].map(function (star) {
                            return (
                              <span
                                key={star}
                                style={{
                                  color:
                                    star <= Math.floor(formation.rating)
                                      ? "#facc15"
                                      : "#e2e8f0",
                                  fontSize: "10px",
                                }}
                              >
                                ★
                              </span>
                            );
                          })}
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#94a3b8",
                              marginLeft: "4px",
                            }}
                          >
                            {formation.rating}
                          </span>
                        </div>
                      )}

                      {formation.formateur && (
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#94a3b8",
                            marginBottom: "8px",
                          }}
                        >
                          🎓 {formation.formateur}
                        </p>
                      )}

                      {formation.addedAt && (
                        <p
                          style={{
                            fontSize: "9px",
                            color: "#cbd5e1",
                            marginBottom: "8px",
                          }}
                        >
                          ⏱ Ajouté le{" "}
                          {new Date(formation.addedAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}

                      <div style={{ display: "flex", gap: "6px" }}>
                        <Link
                          to={"/centre/" + formationId}
                          style={{
                            flex: 1,
                            textAlign: "center",
                            backgroundColor: "#0ea5e9",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "10px",
                            textTransform: "uppercase",
                            padding: "6px 8px",
                            borderRadius: "6px",
                            textDecoration: "none",
                          }}
                        >
                          <i
                            className="fas fa-eye"
                            style={{ marginRight: "4px" }}
                          ></i>
                          Détails
                        </Link>
                        <button
                          onClick={function () {
                            removeFavorite(formationId);
                          }}
                          style={{
                            padding: "6px 10px",
                            backgroundColor: "#fef2f2",
                            color: "#ef4444",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                          title="Retirer des favoris"
                        >
                          <i className="fas fa-heart-broken"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "48px",
                  maxWidth: "450px",
                  margin: "0 auto",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                }}
              >
                {searchTerm ? (
                  <>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                      🔍
                    </div>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "8px",
                      }}
                    >
                      Aucun résultat
                    </h3>
                    <p style={{ color: "#94a3b8", marginBottom: "16px" }}>
                      Aucune formation ne correspond à "{searchTerm}"
                    </p>
                    <button
                      onClick={function () {
                        setSearchTerm("");
                      }}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#0ea5e9",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Effacer la recherche
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                      💔
                    </div>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "8px",
                      }}
                    >
                      Aucun favori pour le moment
                    </h3>
                    <p
                      style={{
                        color: "#94a3b8",
                        marginBottom: "20px",
                        fontSize: "14px",
                      }}
                    >
                      Cliquez sur le bouton ❤️ sur une formation pour la
                      sauvegarder ici.
                    </p>
                    <Link
                      to="/landing"
                      style={{
                        display: "inline-block",
                        padding: "12px 24px",
                        backgroundColor: "#0ea5e9",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        borderRadius: "25px",
                        textDecoration: "none",
                      }}
                    >
                      <i
                        className="fas fa-compass"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Explorer les formations
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