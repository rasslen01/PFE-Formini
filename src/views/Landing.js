// src/views/Landing.js
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import TextType from "./TextType";
import RecommendationCard from "../components/Cards/RecommendationCard";
import StudentNavbar from "components/Navbars/StudentNavbar";
import Footer from "components/Footers/Footer.js";
import SallleDeFormation from "../assets/img/SallleDeFormation.avif";
import { useFavorites } from "../FavoritesContext";
import FavoriteButton from "../components/Button/FavoriteButton";
import { registerFormation } from "../Services/apiInscriptions";
import { getAllFormations } from "../Services/ApiFormation";

const BACKEND_URL = "http://localhost:5000";

export default function Landing() {
  const history = useHistory();
  const { favoritesCount } = useFavorites();

  const [ville, setVille] = useState("");
  const [domaine, setDomaine] = useState("");
  const [search, setSearch] = useState("");

  const [formations, setFormations] = useState([]);
  const [isLoadingFormations, setIsLoadingFormations] = useState(true);
  const [formationsError, setFormationsError] = useState("");
  const [registeringId, setRegisteringId] = useState("");

  const normalize = (v) => (v || "").toString().trim().toLowerCase();

  // ─── Helper: construire l'URL complète de l'image ───
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  const mapFormation = (f) => {
    return {
      _id: f._id,
      id: f._id,
      nom: f.name || "Sans titre",
      ville: normalize(f.location),
      domaine: f.domain ? normalize(f.domain) : "",
      description: f.description || "",
      prix: typeof f.price === "number" ? f.price : Number(f.price) || 0,
      gratuit: (typeof f.price === "number" ? f.price : Number(f.price) || 0) === 0,
      duree: f.duree || f.duration || "",
      nbEtudiants: f.nbEtudiants || f.studentsCount || 0,
      rating: typeof f.rating === "number" ? f.rating : null,
      formateur: f.instructor || "",
      niveau: f.level || "",
      status: f.status || "pending",
      date: f.date || "",
      centre: f.centre || "",
      centreLogo: f.centreLogo || "",
      image: f.image || "",  // ✅ image uploadée
    };
  };

  useEffect(() => {
    const load = async () => {
      setIsLoadingFormations(true);
      setFormationsError("");
      try {
        const res = await getAllFormations();
        const list = res.data?.formationsList || [];
        const accepted = list.filter((f) => (f.status || "") === "accepted");
        setFormations(accepted.map(mapFormation));
      } catch (err) {
        console.error("Failed to load formations:", err);
        setFormationsError(
          err.response?.data?.error || "Erreur lors du chargement des formations"
        );
      } finally {
        setIsLoadingFormations(false);
      }
    };
    load();
  }, []);

  const handleRegister = async (formationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez vous connecter d'abord.");
      history.push("/auth/login");
      return;
    }
    try {
      setRegisteringId(formationId);
      await registerFormation(formationId, token);
      alert("✅ Inscription enregistrée avec succès en mode pending.");
      history.push("/mes-inscriptions");
    } catch (error) {
      console.error("Register formation error:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur lors de l'inscription à la formation."
      );
    } finally {
      setRegisteringId("");
    }
  };

  const recommandations = formations
    .slice()
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 2)
    .map((f) => ({
      id: f.id,
      nom: f.nom,
      ville: f.ville,
      domaine: f.domaine,
      score: Math.min(99, Math.round(((f.rating || 4) / 5) * 100)),
      description: (f.description || "").slice(0, 40) + "...",
      prix: f.prix,
      rating: f.rating || 4.5,
    }));

  // ─── Image par domaine (fallback si pas d'image uploadée) ───
  const getDefaultImage = (domaineKey) => {
    const images = {
      informatique: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80",
      marketing:    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
      data:         "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80",
      mobile:       "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80",
      ia:           "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&q=80",
      reseaux:      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80",
      web:          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80",
      cloud:        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80",
      design:       "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=500&q=80",
      cybersécurité:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80",
    };
    return images[normalize(domaineKey)] ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80";
  };

  // ─── Retourne l'image de la formation : uploadée en priorité, sinon par domaine ───
  const getFormationImage = (formation) => {
  // ✅ Ignorer la valeur par défaut vide ou "default-formation.png"
  if (formation.image && formation.image !== "default-formation.png") {
    return buildImageUrl(formation.image);
  }
  return getDefaultImage(formation.domaine);
};

  const getColor = (domaineKey) => {
    const colors = {
      informatique: "#3b82f6",
      marketing:    "#8b5cf6",
      data:         "#10b981",
      mobile:       "#ec4899",
      ia:           "#f59e0b",
      reseaux:      "#ef4444",
      web:          "#0ea5e9",
      cloud:        "#6366f1",
      design:       "#14b8a6",
    };
    return colors[normalize(domaineKey)] || "#0ea5e9";
  };

  const getIcon = (domaineKey) => {
    const icons = {
      informatique: "fas fa-laptop-code",
      marketing:    "fas fa-bullhorn",
      data:         "fas fa-chart-bar",
      mobile:       "fas fa-mobile-alt",
      ia:           "fas fa-robot",
      reseaux:      "fas fa-network-wired",
      web:          "fas fa-code",
      cloud:        "fas fa-cloud",
      design:       "fas fa-pencil-ruler",
    };
    return icons[normalize(domaineKey)] || "fas fa-book";
  };

  const getVilleName = (villeKey) => {
    const names = {
      tunis:      "Tunis",
      ariana:     "Ariana",
      sfax:       "Sfax",
      sousse:     "Sousse",
      bizerte:    "Bizerte",
      monastir:   "Monastir",
      nabeul:     "Nabeul",
      ben_arous:  "Ben Arous",
      manouba:    "Manouba",
      zaghouan:   "Zaghouan",
      beja:       "Béja",
      jendouba:   "Jendouba",
      kef:        "Le Kef",
      siliana:    "Siliana",
      mahdia:     "Mahdia",
      kairouan:   "Kairouan",
      kasserine:  "Kasserine",
      sidi_bouzid:"Sidi Bouzid",
      gabes:      "Gabès",
      medenine:   "Médenine",
      tataouine:  "Tataouine",
      gafsa:      "Gafsa",
      tozeur:     "Tozeur",
      kebili:     "Kébili",
    };
    return names[normalize(villeKey)] || villeKey || "";
  };

  const formationsFiltrees = formations.filter((formation) => {
    return (
      (ville === "" || normalize(formation.ville) === normalize(ville)) &&
      (domaine === "" || normalize(formation.domaine) === normalize(domaine)) &&
      normalize(formation.nom).includes(normalize(search))
    );
  });

  return (
    <>
      <StudentNavbar transparent />

      <main>
        {/* ══════════════ HERO ══════════════ */}
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80')",
            }}
          >
            <span className="w-full h-full absolute opacity-75 bg-black"></span>
          </div>

          <div className="container relative mx-auto">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <div className="pr-12">
                  <h1 className="text-white font-semibold text-5xl">
                    <TextType
                      text={[
                        "Trouvez votre formation idéale.",
                        "Développez vos compétences.",
                        "Construisez votre avenir.",
                      ]}
                      typingSpeed={75}
                      deletingSpeed={50}
                      pauseDuration={2000}
                      showCursor
                      cursorCharacter="_"
                    />
                  </h1>

                  <p className="mt-4 text-lg text-blueGray-200">
                    Explorez des centaines de formations professionnelles à
                    travers toute la Tunisie. Inscrivez-vous et développez vos
                    compétences dès aujourd'hui.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 mt-12">
                    <Link
                      to="/mes-inscriptions"
                      className="bg-lightBlue-500 text-white font-bold uppercase text-sm px-8 py-4 rounded-full shadow-lg hover:bg-lightBlue-600 hover:shadow-xl transition-all duration-150"
                    >
                      <i className="fas fa-graduation-cap mr-2"></i>
                      Mes inscriptions
                    </Link>

                    <Link
                      to="/liste-favoris"
                      className="relative bg-red-500 text-white font-bold uppercase text-sm px-8 py-4 rounded-full shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-150"
                    >
                      <i className="fas fa-heart mr-2"></i>
                      Mes favoris
                      {favoritesCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-blueGray-800 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                          {favoritesCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </div>

        <section className="pb-20 bg-blueGray-200 -mt-24">
          <div className="max-w-7xl mx-auto px-6">

            {/* ══════════════ STATS ══════════════ */}
            <div className="flex flex-wrap -mt-4">
              <div className="w-full md:w-4/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg p-6 text-center transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-lightBlue-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-4 shadow-lg rounded-full bg-lightBlue-50 mx-auto">
                    <i className="fas fa-book-open text-2xl"></i>
                  </div>
                  <h5 className="text-3xl font-bold text-blueGray-800">{formations.length}+</h5>
                  <p className="text-sm text-blueGray-500 mt-1">Formations disponibles</p>
                </div>
              </div>

              <div className="w-full md:w-4/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg p-6 text-center transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-emerald-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-4 shadow-lg rounded-full bg-emerald-50 mx-auto">
                    <i className="fas fa-map-marked-alt text-2xl"></i>
                  </div>
                  <h5 className="text-3xl font-bold text-blueGray-800">24</h5>
                  <p className="text-sm text-blueGray-500 mt-1">Gouvernorats couverts</p>
                </div>
              </div>

              <div className="w-full md:w-4/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg p-6 text-center transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-red-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-4 shadow-lg rounded-full bg-red-50 mx-auto">
                    <i className="fas fa-users text-2xl"></i>
                  </div>
                  <h5 className="text-3xl font-bold text-blueGray-800">558+</h5>
                  <p className="text-sm text-blueGray-500 mt-1">Étudiants inscrits</p>
                </div>
              </div>
            </div>

            {/* ══════════════ RECOMMANDATIONS ══════════════ */}
            <div className="mb-12 mt-8">
              <div className="text-center mb-8">
                <span className="text-sm font-bold uppercase text-lightBlue-500 tracking-wider">
                  Intelligence Artificielle
                </span>
                <h3 className="text-3xl font-bold text-blueGray-800 mt-2">
                  🎯 Recommandé pour vous
                </h3>
                <p className="text-blueGray-500 mt-2">Basé sur votre profil et vos intérêts</p>
              </div>

              <div className="flex flex-wrap">
                {recommandations.map((formation) => (
                  <div key={formation.id} className="w-full md:w-6/12 px-4 mb-4">
                    <RecommendationCard formation={formation} />
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════ FILTRES ══════════════ */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-blueGray-800 mb-6 flex items-center">
                <i className="fas fa-filter text-lightBlue-500 mr-3"></i>
                Filtrer les formations
              </h3>

              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-4/12 px-2 mb-4">
                  <label className="block text-xs font-bold uppercase text-blueGray-500 mb-2">
                    <i className="fas fa-search mr-1"></i> Rechercher
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nom de la formation..."
                      className="w-full border border-blueGray-200 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-lightBlue-500 focus:border-transparent text-sm transition-all"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-blueGray-400"></i>
                  </div>
                </div>

                <div className="w-full md:w-3/12 px-2 mb-4">
                  <label className="block text-xs font-bold uppercase text-blueGray-500 mb-2">
                    <i className="fas fa-map-marker-alt mr-1"></i> Gouvernorat
                  </label>
                  <select
                    className="w-full border border-blueGray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lightBlue-500 text-sm bg-white"
                    onChange={(e) => setVille(e.target.value)}
                    value={ville}
                  >
                    <option value="">Tous les gouvernorats</option>
                    <option value="tunis">Tunis</option>
                    <option value="ariana">Ariana</option>
                    <option value="ben_arous">Ben Arous</option>
                    <option value="manouba">Manouba</option>
                    <option value="nabeul">Nabeul</option>
                    <option value="zaghouan">Zaghouan</option>
                    <option value="bizerte">Bizerte</option>
                    <option value="beja">Béja</option>
                    <option value="jendouba">Jendouba</option>
                    <option value="kef">Le Kef</option>
                    <option value="siliana">Siliana</option>
                    <option value="sousse">Sousse</option>
                    <option value="monastir">Monastir</option>
                    <option value="mahdia">Mahdia</option>
                    <option value="sfax">Sfax</option>
                    <option value="kairouan">Kairouan</option>
                    <option value="kasserine">Kasserine</option>
                    <option value="sidi_bouzid">Sidi Bouzid</option>
                    <option value="gabes">Gabès</option>
                    <option value="medenine">Médenine</option>
                    <option value="tataouine">Tataouine</option>
                    <option value="gafsa">Gafsa</option>
                    <option value="tozeur">Tozeur</option>
                    <option value="kebili">Kébili</option>
                  </select>
                </div>

                <div className="w-full md:w-3/12 px-2 mb-4">
                  <label className="block text-xs font-bold uppercase text-blueGray-500 mb-2">
                    <i className="fas fa-layer-group mr-1"></i> Domaine
                  </label>
                  <select
                    className="w-full border border-blueGray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lightBlue-500 text-sm bg-white"
                    onChange={(e) => setDomaine(e.target.value)}
                    value={domaine}
                  >
                    <option value="">Tous les domaines</option>
                    <option value="informatique">Informatique & IT</option>
                    <option value="reseaux">Réseaux & Télécom</option>
                    <option value="ia">Intelligence Artificielle</option>
                    <option value="data">Data Science</option>
                    <option value="web">Développement Web</option>
                    <option value="mobile">Développement Mobile</option>
                    <option value="gestion">Gestion & Management</option>
                    <option value="marketing">Marketing Digital</option>
                    <option value="finance">Finance & Comptabilité</option>
                    <option value="langues">Langues</option>
                    <option value="sante">Santé</option>
                    <option value="tourisme">Tourisme & Hôtellerie</option>
                  </select>
                </div>

                <div className="w-full md:w-2/12 px-2 mb-4 flex items-end">
                  <button
                    onClick={() => { setVille(""); setDomaine(""); setSearch(""); }}
                    className="w-full bg-blueGray-100 text-blueGray-600 font-bold text-sm px-4 py-3 rounded-lg hover:bg-blueGray-200 transition-all"
                  >
                    <i className="fas fa-redo mr-2"></i>Réinitialiser
                  </button>
                </div>
              </div>
            </div>

            {/* ══════════════ LISTE DES FORMATIONS ══════════════ */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-blueGray-800">
                  <i className="fas fa-book-open text-lightBlue-500 mr-2"></i>
                  Formations disponibles
                </h3>
                <span className="bg-lightBlue-100 text-lightBlue-700 text-sm font-bold px-4 py-2 rounded-full">
                  {formationsFiltrees.length} résultat{formationsFiltrees.length > 1 ? "s" : ""}
                </span>
              </div>

              {isLoadingFormations && (
                <div className="text-center py-12 text-blueGray-500">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Chargement des formations...
                </div>
              )}

              {formationsError && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                  {formationsError}
                </div>
              )}

              {!isLoadingFormations && !formationsError && formationsFiltrees.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                    <h4 className="text-xl font-bold text-blueGray-800 mb-2">
                      Aucune formation trouvée
                    </h4>
                    <button
                      onClick={() => { setVille(""); setDomaine(""); setSearch(""); }}
                      className="bg-lightBlue-500 text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-lightBlue-600 transition-all"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap">
                  {formationsFiltrees.map((formation, index) => {
                    const formationId = formation._id || formation.id;

                    return (
                      <div
                        key={formationId}
                        className="w-full lg:w-4/12 px-4"
                        style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
                      >
                        <div className="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg ease-linear transition-all duration-150 overflow-hidden group">

                          {/* ── Titre ── */}
                          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f1f5f9" }}>
                            <Link to={"/formation/" + formationId} style={{ textDecoration: "none" }}>
                              <h5
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                  color: "#1e293b",
                                  margin: 0,
                                  textAlign: "center",
                                  transition: "color 0.2s",
                                  cursor: "pointer",
                                }}
                                className="group-hover:text-lightBlue-600"
                              >
                                {formation.nom}
                              </h5>
                            </Link>
                          </div>

                          {/* ── Image ── */}
                          <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                            <img
                              alt={formation.nom}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              src={getFormationImage(formation)}  
                              onError={(e) => {
                                // Si l'image uploadée échoue, fallback par domaine
                                e.target.src = getDefaultImage(formation.domaine);
                              }}
                            />
                            <div
                              style={{
                                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                              }}
                            ></div>

                            {/* Badge domaine */}
                            <span
                              style={{
                                position: "absolute", top: "10px", left: "10px",
                                backgroundColor: getColor(formation.domaine),
                                color: "white", fontSize: "10px", fontWeight: "bold",
                                padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase",
                              }}
                            >
                              <i className={getIcon(formation.domaine)} style={{ marginRight: "4px" }}></i>
                              {formation.domaine || "autre"}
                            </span>

                            {/* Bouton favori */}
                            <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                              <FavoriteButton formation={formation} size="sm" />
                            </div>

                            {/* Badge prix */}
                            <span
                              style={{
                                position: "absolute", bottom: "10px", right: "10px",
                                backgroundColor: formation.prix === 0 || formation.gratuit ? "#10b981" : "#1e293b",
                                color: "white", fontSize: "13px", fontWeight: "bold",
                                padding: "4px 12px", borderRadius: "20px",
                              }}
                            >
                              {formation.prix === 0 || formation.gratuit ? "Gratuit" : `${formation.prix} DT`}
                            </span>

                            {/* Badge niveau */}
                            {formation.niveau && (
                              <span
                                style={{
                                  position: "absolute", bottom: "10px", left: "10px",
                                  backgroundColor:
                                    formation.niveau === "Débutant" ? "#10b981" :
                                    formation.niveau === "Intermédiaire" ? "#f59e0b" : "#ef4444",
                                  color: "white", fontSize: "10px", fontWeight: "bold",
                                  padding: "3px 8px", borderRadius: "20px",
                                }}
                              >
                                {formation.niveau}
                              </span>
                            )}
                          </div>

                          {/* ── Corps de la carte ── */}
                          <div style={{ padding: "14px 16px" }}>
                            {formation.description && (
                              <p
                                style={{
                                  fontSize: "12px", color: "#94a3b8",
                                  marginBottom: "10px", lineHeight: "1.5",
                                  overflow: "hidden", display: "-webkit-box",
                                  WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                                }}
                              >
                                {formation.description}
                              </p>
                            )}

                            <div
                              style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", gap: "12px",
                                marginBottom: "12px", paddingBottom: "10px",
                                borderBottom: "1px solid #f1f5f9",
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Badges info */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                                  <span style={{ fontSize: "11px", color: "#64748b", backgroundColor: "#f1f5f9", padding: "3px 8px", borderRadius: "20px" }}>
                                    📍 {getVilleName(formation.ville)}
                                  </span>
                                  {formation.duree && (
                                    <span style={{ fontSize: "11px", color: "#64748b", backgroundColor: "#f1f5f9", padding: "3px 8px", borderRadius: "20px" }}>
                                      ⏱ {formation.duree}
                                    </span>
                                  )}
                                  {formation.nbEtudiants ? (
                                    <span style={{ fontSize: "11px", color: "#64748b", backgroundColor: "#f1f5f9", padding: "3px 8px", borderRadius: "20px" }}>
                                      👥 {formation.nbEtudiants}
                                    </span>
                                  ) : null}
                                </div>

                                {/* Étoiles */}
                                {formation.rating && (
                                  <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span
                                        key={star}
                                        style={{
                                          color: star <= Math.floor(formation.rating) ? "#facc15" : "#e2e8f0",
                                          fontSize: "11px",
                                        }}
                                      >★</span>
                                    ))}
                                    <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "4px" }}>
                                      {formation.rating}
                                    </span>
                                  </div>
                                )}

                                {/* Formateur / Centre */}
                                <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
                                  <span>🎓 {formation.formateur || formation.centre || "Centre"}</span>
                                </div>
                              </div>

                              {/* ✅ Logo du centre */}
                              <div style={{ flexShrink: 0 }}>
                                <img
                                  src={formation.centreLogo || "https://via.placeholder.com/52?text=C"}
                                  alt={formation.centre || "Centre"}
                                  onError={(e) => { e.target.src = "https://via.placeholder.com/52?text=C"; }}
                                  style={{
                                    width: "52px", height: "52px",
                                    borderRadius: "9999px", objectFit: "cover",
                                    border: "2px solid #e2e8f0", backgroundColor: "#ffffff",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                  }}
                                />
                              </div>
                            </div>

                            {/* ── Boutons ── */}
                            <div style={{ display: "flex", gap: "8px" }}>
                              <Link
                                to={"/formation/" + formationId}
                                style={{
                                  flex: 1, textAlign: "center",
                                  backgroundColor: "#0ea5e9", color: "white",
                                  fontWeight: "bold", fontSize: "11px",
                                  textTransform: "uppercase", padding: "8px",
                                  borderRadius: "6px", textDecoration: "none",
                                }}
                              >
                                <i className="fas fa-eye" style={{ marginRight: "4px" }}></i>
                                Détails
                              </Link>

                              <button
                                type="button"
                                onClick={() => handleRegister(formationId)}
                                disabled={registeringId === formationId}
                                style={{
                                  textAlign: "center", backgroundColor: "#10b981",
                                  color: "white", fontWeight: "bold", fontSize: "11px",
                                  textTransform: "uppercase", padding: "8px 12px",
                                  borderRadius: "6px", border: "none", cursor: "pointer",
                                  opacity: registeringId === formationId ? 0.7 : 1,
                                }}
                              >
                                <i className="fas fa-pen" style={{ marginRight: "4px" }}></i>
                                {registeringId === formationId ? "En cours..." : "S'inscrire"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ══════════════ POURQUOI NOUS ══════════════ */}
            <div className="flex flex-wrap items-center mt-32">
              <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                  <i className="fas fa-user-friends text-xl"></i>
                </div>
                <h3 className="text-3xl mb-2 font-semibold leading-normal">Pourquoi nous choisir ?</h3>
                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                  Notre plateforme vous connecte avec les meilleures formations professionnelles en Tunisie.
                  Un système intelligent de recommandation vous guide vers les formations adaptées à votre profil.
                </p>
                <ul className="list-none mt-6">
                  <li className="py-2 flex items-center">
                    <span className="text-emerald-500 mr-3"><i className="fas fa-check-circle"></i></span>
                    <span className="text-blueGray-600">Recommandations personnalisées par IA</span>
                  </li>
                  <li className="py-2 flex items-center">
                    <span className="text-emerald-500 mr-3"><i className="fas fa-check-circle"></i></span>
                    <span className="text-blueGray-600">Formations certifiantes dans 24 gouvernorats</span>
                  </li>
                  <li className="py-2 flex items-center">
                    <span className="text-emerald-500 mr-3"><i className="fas fa-check-circle"></i></span>
                    <span className="text-blueGray-600">Suivi de progression et tableau de bord</span>
                  </li>
                </ul>
              </div>

              <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-lightBlue-500">
                  <img alt="Salle de formation" src={SallleDeFormation} className="w-full align-middle rounded-t-lg" />
                  <blockquote className="relative p-8 mb-4">
                    <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 583 95"
                      className="absolute left-0 w-full block h-95-px -top-94-px">
                      <polygon points="-30,95 583,95 583,65" className="text-lightBlue-500 fill-current"></polygon>
                    </svg>
                    <h4 className="text-xl font-bold text-white">Formations de qualité</h4>
                    <p className="text-md font-light mt-2 text-white">
                      Des formateurs experts, des contenus à jour et un accompagnement personnalisé
                      pour votre réussite professionnelle.
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ NOS SERVICES ══════════════ */}
        <section className="pb-20 relative block bg-blueGray-800">
          <div className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20" style={{ transform: "translateZ(0)" }}>
            <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100">
              <polygon className="text-blueGray-800 fill-current" points="2560 0 2560 100 0 100"></polygon>
            </svg>
          </div>

          <div className="container mx-auto px-4 lg:pt-24 lg:pb-64">
            <div className="flex flex-wrap text-center justify-center">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-semibold text-white">Nos Services</h2>
                <p className="text-lg leading-relaxed mt-4 mb-4 text-blueGray-400">
                  Une plateforme complète pour votre développement professionnel
                </p>
              </div>
            </div>

            <div className="flex flex-wrap mt-12 justify-center">
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-robot text-xl"></i>
                </div>
                <h6 className="text-xl mt-5 font-semibold text-white">IA & Recommandation</h6>
                <p className="mt-2 mb-4 text-blueGray-400">
                  Notre algorithme analyse votre profil pour vous recommander les formations les plus pertinentes.
                </p>
              </div>

              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-certificate text-xl"></i>
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">Certifications</h5>
                <p className="mt-2 mb-4 text-blueGray-400">
                  Obtenez des certificats reconnus à la fin de chaque formation complétée.
                </p>
              </div>

              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-headset text-xl"></i>
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">Support 24/7</h5>
                <p className="mt-2 mb-4 text-blueGray-400">
                  Une équipe dédiée pour vous accompagner tout au long de votre parcours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ CONTACT ══════════════ */}
        <section className="relative block py-24 lg:pt-0 bg-blueGray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200">
                  <div className="flex-auto p-5 lg:p-10">
                    <h4 className="text-2xl font-semibold">
                      <i className="fas fa-envelope text-lightBlue-500 mr-2"></i>
                      Contactez-nous
                    </h4>
                    <p className="leading-relaxed mt-1 mb-4 text-blueGray-500">
                      Une question ? Remplissez ce formulaire et nous vous répondrons sous 24h.
                    </p>

                    <div className="relative w-full mb-3 mt-8">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Nom complet</label>
                      <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Votre nom" />
                    </div>

                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email</label>
                      <input type="email" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Votre email" />
                    </div>

                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Message</label>
                      <textarea rows="4" cols="80" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Votre message..." />
                    </div>

                    <div className="text-center mt-6">
                      <button className="bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg transition-all duration-150" type="button">
                        <i className="fas fa-paper-plane mr-2"></i>Envoyer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}