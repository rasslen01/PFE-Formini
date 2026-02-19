/*eslint-disable*/
import React, { useState } from "react";
import { Link } from "react-router-dom";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function Index() {
  var [ville, setVille] = useState("");
  var [domaine, setDomaine] = useState("");
  var [search, setSearch] = useState("");

  var formations = [
    { id: 1, nom: "Développement Web Full Stack", ville: "tunis", domaine: "informatique", description: "Maîtrisez HTML, CSS, JavaScript, React et Node.js pour créer des applications web complètes et modernes.", prix: 450, duree: "3 mois", nbEtudiants: 128, rating: 4.8, formateur: "Ahmed Benali", niveau: "Intermédiaire" },
    { id: 2, nom: "Marketing Digital & Réseaux Sociaux", ville: "sfax", domaine: "marketing", description: "Apprenez à créer des campagnes marketing efficaces sur Facebook, Instagram, Google Ads et plus encore.", prix: 300, duree: "2 mois", nbEtudiants: 95, rating: 4.6, formateur: "Sara Moussaoui", niveau: "Débutant" },
    { id: 3, nom: "Data Science & Machine Learning", ville: "tunis", domaine: "data", description: "Explorez Python, Pandas, TensorFlow et les algorithmes de Machine Learning pour analyser des données massives.", prix: 550, duree: "4 mois", nbEtudiants: 76, rating: 4.9, formateur: "Karim Tazi", niveau: "Avancé" },
    { id: 4, nom: "Intelligence Artificielle Appliquée", ville: "sousse", domaine: "ia", description: "Découvrez le Deep Learning, le NLP et la vision par ordinateur avec des projets pratiques.", prix: 600, duree: "4 mois", nbEtudiants: 54, rating: 4.7, formateur: "Mohamed Sahli", niveau: "Avancé" },
    { id: 5, nom: "Développement Mobile React Native", ville: "ariana", domaine: "mobile", description: "Créez des applications mobiles iOS et Android avec React Native et déployez-les sur les stores.", prix: 0, gratuit: true, duree: "2 mois", nbEtudiants: 142, rating: 4.5, formateur: "Ines Ben Amor", niveau: "Intermédiaire" },
    { id: 6, nom: "Réseaux & Cybersécurité", ville: "bizerte", domaine: "reseaux", description: "Apprenez la configuration réseau, la sécurité informatique et préparez la certification CCNA.", prix: 400, duree: "3 mois", nbEtudiants: 63, rating: 4.4, formateur: "Ali Hammami", niveau: "Intermédiaire" },
  ];

  var getImage = function (domaine) {
    var images = {
      informatique: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80",
      marketing: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
      data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80",
      mobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80",
      ia: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&q=80",
      reseaux: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80",
    };
    return images[domaine] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80";
  };

  var getColor = function (domaine) {
    var colors = { informatique: "#3b82f6", marketing: "#8b5cf6", data: "#10b981", mobile: "#ec4899", ia: "#f59e0b", reseaux: "#ef4444" };
    return colors[domaine] || "#0ea5e9";
  };

  var getIcon = function (domaine) {
    var icons = { informatique: "fas fa-laptop-code", marketing: "fas fa-bullhorn", data: "fas fa-chart-bar", mobile: "fas fa-mobile-alt", ia: "fas fa-robot", reseaux: "fas fa-network-wired" };
    return icons[domaine] || "fas fa-book";
  };

  var getVilleName = function (ville) {
    var names = { tunis: "Tunis", ariana: "Ariana", sfax: "Sfax", sousse: "Sousse", bizerte: "Bizerte", monastir: "Monastir", nabeul: "Nabeul", ben_arous: "Ben Arous", manouba: "Manouba" };
    return names[ville] || ville || "";
  };

  var formationsFiltrees = formations.filter(function (f) {
    return (
      (ville === "" || f.ville === ville) &&
      (domaine === "" || f.domaine === domaine) &&
      f.nom.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <IndexNavbar fixed />

      {/* ===== SECTION 1 - HERO ===== */}
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">
              <h2 className="font-semibold text-4xl text-blueGray-600">
                ForMini - Centralisation des centres de formation en tunisie.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                Une plateforme intelligente qui centralise les centres de formation
                et vous recommande les meilleures options selon votre profil.
              </p>
              <div className="mt-12">
                <Link
                  to="/auth/login"
                  className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/register"
                  className="github-star ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
        <img
          className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860px"
          src={require("assets/img/Backschool.gif").default}
          alt="..."
        />
      </section>

      {/* ===== SECTION 2 ===== */}
      

      {/* ===== SECTION 3 CARDS ===== */}
      

      {/* ===== SECTION FORMATIONS ===== */}
      <section className="py-20 bg-blueGray-200">
        <div className="container mx-auto px-4">
          {/* Titre */}
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase text-lightBlue-500 tracking-wider">
              Explorez nos formations
            </span>
            <h2 className="text-4xl font-semibold text-blueGray-800 mt-2">
              Formations disponibles
            </h2>
            <p className="text-lg text-blueGray-500 mt-4 max-w-xl mx-auto">
              Découvrez toutes les formations professionnelles disponibles à travers la Tunisie
            </p>
          </div>

          {/* Filtres */}
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
                  <option value="mobile">Développement Mobile</option>
                  <option value="marketing">Marketing Digital</option>
                </select>
              </div>

              <div className="w-full md:w-2/12 px-2 mb-4 flex items-end">
                <button
                  onClick={() => {
                    setVille("");
                    setDomaine("");
                    setSearch("");
                  }}
                  className="w-full bg-blueGray-100 text-blueGray-600 font-bold text-sm px-4 py-3 rounded-lg hover:bg-blueGray-200 transition-all"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Reset
                </button>
              </div>
            </div>

            {(ville || domaine || search) && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-blueGray-500">Filtres actifs :</span>
                {search && (
                  <span className="bg-lightBlue-100 text-lightBlue-700 text-xs px-3 py-1 rounded-full flex items-center">
                    "{search}"
                    <button onClick={() => setSearch("")} className="ml-1 hover:text-red-500">×</button>
                  </span>
                )}
                {ville && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full flex items-center">
                    📍 {ville}
                    <button onClick={() => setVille("")} className="ml-1 hover:text-red-500">×</button>
                  </span>
                )}
                {domaine && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full flex items-center">
                    🏷️ {domaine}
                    <button onClick={() => setDomaine("")} className="ml-1 hover:text-red-500">×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Compteur */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-blueGray-800">
              <i className="fas fa-book-open text-lightBlue-500 mr-2"></i>
              Résultats
            </h3>
            <span className="bg-lightBlue-100 text-lightBlue-700 text-sm font-bold px-4 py-2 rounded-full">
              {formationsFiltrees.length} formation{formationsFiltrees.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Grille formations */}
          {formationsFiltrees.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                <h4 className="text-xl font-bold text-blueGray-800 mb-2">
                  Aucune formation trouvée
                </h4>
                <button
                  onClick={() => {
                    setVille("");
                    setDomaine("");
                    setSearch("");
                  }}
                  className="bg-lightBlue-500 text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-lightBlue-600 transition-all"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap">
              {formationsFiltrees.map(function (formation, index) {
                return (
                  <div
                    key={formation.id}
                    className="w-full lg:w-4/12 px-4"
                    style={{
                      animation: "fadeInUp 0.5s ease-out " + index * 0.1 + "s both",
                    }}
                  >
                    <div className="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg ease-linear transition-all duration-150 overflow-hidden group">
                      {/* Titre dans la carte */}
                      <div
                        style={{
                          padding: "14px 16px 10px",
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        <Link
                          to={"/centre/" + formation.id}
                          style={{ textDecoration: "none" }}
                        >
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

                      {/* Image */}
                      <div
                        style={{
                          position: "relative",
                          height: "180px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          alt={formation.nom}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={getImage(formation.domaine)}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                          }}
                        ></div>

                        {/* Badge domaine */}
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            backgroundColor: getColor(formation.domaine),
                            color: "white",
                            fontSize: "10px",
                            fontWeight: "bold",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            textTransform: "uppercase",
                          }}
                        >
                          <i
                            className={getIcon(formation.domaine)}
                            style={{ marginRight: "4px" }}
                          ></i>
                          {formation.domaine}
                        </span>

                        {/* Prix */}
                        <span
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                            backgroundColor:
                              formation.prix === 0 || formation.gratuit
                                ? "#10b981"
                                : "#1e293b",
                            color: "white",
                            fontSize: "13px",
                            fontWeight: "bold",
                            padding: "4px 12px",
                            borderRadius: "20px",
                          }}
                        >
                          {formation.prix === 0 || formation.gratuit
                            ? "Gratuit"
                            : formation.prix + " DT"}
                        </span>

                        {/* Niveau */}
                        {formation.niveau && (
                          <span
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              left: "10px",
                              backgroundColor:
                                formation.niveau === "Débutant"
                                  ? "#10b981"
                                  : formation.niveau === "Intermédiaire"
                                  ? "#f59e0b"
                                  : "#ef4444",
                              color: "white",
                              fontSize: "10px",
                              fontWeight: "bold",
                              padding: "3px 8px",
                              borderRadius: "20px",
                            }}
                          >
                            {formation.niveau}
                          </span>
                        )}
                      </div>

                      {/* Contenu */}
                      <div style={{ padding: "14px 16px" }}>
                        {formation.description && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#94a3b8",
                              marginBottom: "10px",
                              lineHeight: "1.5",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {formation.description}
                          </p>
                        )}

                        {/* Tags */}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "6px",
                            marginBottom: "10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#64748b",
                              backgroundColor: "#f1f5f9",
                              padding: "3px 8px",
                              borderRadius: "20px",
                            }}
                          >
                            📍 {getVilleName(formation.ville)}
                          </span>
                          {formation.duree && (
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#64748b",
                                backgroundColor: "#f1f5f9",
                                padding: "3px 8px",
                                borderRadius: "20px",
                              }}
                            >
                              ⏱ {formation.duree}
                            </span>
                          )}
                          {formation.nbEtudiants && (
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#64748b",
                                backgroundColor: "#f1f5f9",
                                padding: "3px 8px",
                                borderRadius: "20px",
                              }}
                            >
                              👥 {formation.nbEtudiants}
                            </span>
                          )}
                        </div>

                        {/* Note + Formateur */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px",
                            paddingBottom: "10px",
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
                                      color:
                                        star <= Math.floor(formation.rating)
                                          ? "#facc15"
                                          : "#e2e8f0",
                                      fontSize: "11px",
                                    }}
                                  >
                                    ★
                                  </span>
                                );
                              })}
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "#94a3b8",
                                  marginLeft: "4px",
                                }}
                              >
                                {formation.rating}
                              </span>
                            </div>
                          )}
                          {formation.formateur && (
                            <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                              🎓 {formation.formateur}
                            </span>
                          )}
                        </div>

                        {/* Boutons */}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Link
                            to={"/centre/" + formation.id}
                            style={{
                              flex: 1,
                              textAlign: "center",
                              backgroundColor: "#0ea5e9",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "11px",
                              textTransform: "uppercase",
                              padding: "8px",
                              borderRadius: "6px",
                              textDecoration: "none",
                            }}
                          >
                            <i className="fas fa-eye" style={{ marginRight: "4px" }}></i>
                            Détails
                          </Link>
                          <Link
                            to="/auth/register"
                            style={{
                              textAlign: "center",
                              backgroundColor: "#10b981",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "11px",
                              textTransform: "uppercase",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              textDecoration: "none",
                            }}
                          >
                            <i className="fas fa-user-plus" style={{ marginRight: "4px" }}></i>
                            S'inscrire
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== SECTION CTA FINALE ===== */}
      <section className="pb-16 bg-blueGray-200 relative pt-32">
        <div
          className="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>

        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center bg-white shadow-xl rounded-lg -mt-64 py-16 px-12 relative z-10">
            <div className="w-full text-center lg:w-8/12">
              <p className="text-4xl text-center">
                <span role="img" aria-label="love">
                  😍
                </span>
              </p>
              <h3 className="font-semibold text-3xl">
                Prêt à commencer votre formation ?
              </h3>
              <p className="text-blueGray-500 text-lg leading-relaxed mt-4 mb-4">
                Rejoignez des milliers d'étudiants qui ont déjà transformé leur
                carrière grâce à nos formations. Inscrivez-vous gratuitement
                et commencez dès aujourd'hui !
              </p>
              <div className="sm:block flex flex-col mt-10">
                <Link
                  to="/auth/register"
                  className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  <i className="fas fa-rocket mr-2"></i>
                  Créer mon compte
                </Link>
                <Link
                  to="/auth/login"
                  className="github-star sm:ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Footer />
    </>
  );
}