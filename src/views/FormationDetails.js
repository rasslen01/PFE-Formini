/*eslint-disable*/
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StudentNavbar from "components/Navbars/StudentNavbar";
import Footer from "components/Footers/Footer";
import { getFormationById } from "Services/ApiFormation";
import EvaluationSection from "components/Cards/EvaluationSection";

const iconMap = {
  Competences: "⚡",
  Jours: "📅",
  NiveauRequis: "🎯",
  TypeContenu: "📦",
  Domaine: "🧩",
  DateDebut: "🗓️",
  Heure: "🕐",
  Duree: "⏱️",
  Methode: "🛠️",
  Engagement: "🔥",
  Langue: "🌍",
  Emplacement: "📍",
  Centre: "🏫",
};

const labelMap = {
  Competences: "Compétences",
  Jours: "Jours",
  NiveauRequis: "Niveau requis",
  TypeContenu: "Type de contenu",
  Domaine: "Domaine",
  DateDebut: "Date de début",
  Heure: "Heure",
  Duree: "Durée",
  Methode: "Méthode",
  Engagement: "Engagement",
  Langue: "Langue",
  Emplacement: "Emplacement",
  Centre: "Centre",
};

export default function FormationDetails() {
  const { id } = useParams();

  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageHeight, setImageHeight] = useState("auto");

  const normalize = (v) => (v || "").toString().trim();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getFormationById(id);
        const f = res.data?.formation || res.data?.data || res.data;
        if (!f || !f._id) throw new Error("Formation introuvable");
        setFormation(f);
      } catch (err) {
        console.error("Formation details error:", err);
        setError(err.response?.data?.error || err.message || "Erreur lors du chargement");
        setFormation(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const safeDateStart = useMemo(() => {
    if (!formation?.date) return "";
    try {
      return new Date(formation.date).toLocaleDateString("fr-FR", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
    } catch { return ""; }
  }, [formation]);

  const BACKEND_URL = "http://localhost:5000";

  const imageUrl = useMemo(() => {
    const fallback = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80";
    if (!formation) return fallback;
    const img = formation.imageUrl || formation.image || "";
    if (!img || img === "default-formation.png" || img === "") return fallback;
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    const cleanPath = img.startsWith("/") ? img : `/${img}`;
    return `${BACKEND_URL}${cleanPath}`;
  }, [formation]);

  // ✅ Gérer le chargement de l'image et ajuster la hauteur
  const handleImageLoad = (e) => {
    const img = e.target;
    const naturalHeight = img.naturalHeight;
    const naturalWidth = img.naturalWidth;
    const ratio = naturalHeight / naturalWidth;
    
    // Ajuster la hauteur selon le ratio et la taille de l'écran
    const screenWidth = window.innerWidth;
    let calculatedHeight;
    
    if (screenWidth < 640) {
      // Mobile
      calculatedHeight = Math.min(250, Math.max(150, 200 * ratio));
    } else if (screenWidth < 1024) {
      // Tablette
      calculatedHeight = Math.min(350, Math.max(200, 280 * ratio));
    } else {
      // Desktop
      calculatedHeight = Math.min(450, Math.max(250, 320 * ratio));
    }
    
    setImageHeight(calculatedHeight);
    setImageLoaded(true);
  };

  const caracteristiques = {
    Competences: Array.isArray(formation?.skills) && formation.skills.length > 0 ? formation.skills.join(", ") : normalize(formation?.competences) || "React, HTML, CSS, JavaScript",
    Jours: normalize(formation?.days) || "—",
    NiveauRequis: normalize(formation?.requiredLevel) || "—",
    TypeContenu: normalize(formation?.typeContenu) || "—",
    Domaine: normalize(formation?.domain) || "—",
    DateDebut: safeDateStart || "—",
    Heure: normalize(formation?.time) || "—",
    Duree: normalize(formation?.duration || formation?.duree) || "—",
    Methode: normalize(formation?.method) || "—",
    Engagement: normalize(formation?.engagement) || "—",
    Langue: normalize(formation?.language) || "—",
    Emplacement: normalize(formation?.location) || "—",
    Centre: normalize(formation?.centre) || "—",
  };

  const statusConfig = {
    accepted: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Acceptée" },
    pending:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   label: "En attente" },
    default:  { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     label: formation?.status || "pending" },
  };
  const sc = statusConfig[formation?.status] || statusConfig.default;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        .fd-root { font-family: 'DM Sans', sans-serif; }
        .fd-heading { font-family: 'Syne', sans-serif; }

        .fd-hero-img {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        .fd-hero-img::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
          pointer-events: none;
        }

        .fd-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06);
        }

        .fd-sidebar {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06);
          position: sticky;
          top: 88px;
        }

        .fd-stat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 50px;
          padding: 6px 14px;
        }

        .fd-char-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px dashed #f1f5f9;
        }
        .fd-char-row:last-child { border-bottom: none; }

        .fd-enroll-btn {
          display: block;
          text-align: center;
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 14px 20px;
          border-radius: 14px;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 20px rgba(14,165,233,0.35);
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .fd-enroll-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(14,165,233,0.45);
          background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
          color: #fff;
        }

        .fd-icon-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
        }
        .fd-icon-btn:hover {
          background: #0ea5e9;
          color: #fff;
          border-color: #0ea5e9;
          transform: scale(1.08);
        }

        .fd-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 50px;
          letter-spacing: 0.2px;
        }

        .fd-instructor {
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
        }

        .fd-avatar {
          width: 52px; height: 52px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
          flex-shrink: 0;
        }

        .fd-price {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .fd-stars span { letter-spacing: -2px; }

        .fd-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #64748b;
          padding: 7px 14px;
          border-radius: 50px;
          background: #fff;
          border: 1px solid #e2e8f0;
          text-decoration: none;
          transition: all 0.2s;
        }
        .fd-back-link:hover {
          color: #0ea5e9;
          border-color: #bae6fd;
          background: #f0f9ff;
        }

        .fd-bg {
          min-height: 100vh;
          background: #f1f5f9;
          background-image:
            radial-gradient(ellipse 80% 50% at 10% 0%, rgba(14,165,233,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 100%, rgba(2,132,199,0.05) 0%, transparent 60%);
        }

        @keyframes fd-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fd-animate { animation: fd-fade-up 0.5s ease both; }
        .fd-animate-delay-1 { animation-delay: 0.08s; }
        .fd-animate-delay-2 { animation-delay: 0.16s; }
        .fd-animate-delay-3 { animation-delay: 0.24s; }
      `}</style>

      <StudentNavbar transparent />

      <main className="fd-root fd-bg pt-20">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 80px" }}>

          {/* Top bar */}
          <div className="fd-animate" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <Link to="/landing" className="fd-back-link">
              <i className="fas fa-arrow-left" style={{ fontSize: "0.75rem" }}></i>
              Retour
            </Link>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 50, padding: "5px 14px", letterSpacing: "0.5px" }}>
              Formation #{id}
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="fd-card" style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: 10, fontSize: "1.1rem" }}></i>
              <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>Chargement...</span>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 16, padding: 28, color: "#dc2626" }}>
              <div style={{ fontWeight: 700, marginBottom: 6, fontSize: "0.95rem" }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>Erreur
              </div>
              <div style={{ fontSize: "0.88rem", color: "#ef4444" }}>{error}</div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && formation && (
            <>
              {/* Title */}
              <div className="fd-animate fd-animate-delay-1" style={{ marginBottom: 18 }}>
                <h1 className="fd-heading" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: 16 }}>
                  {formation.name || "Sans titre"}
                </h1>

                {/* Stats row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  <div className="fd-stat-pill">
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Avis</span>
                    <span className="fd-stars" style={{ color: "#f59e0b" }}>★★★★★</span>
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>({formation.rating ?? 0})</span>
                  </div>
                  <div className="fd-stat-pill">
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Inscriptions</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0ea5e9" }}>
                      {formation.studentsCount ?? formation.nbEtudiants ?? 0}
                    </span>
                  </div>

                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <button className="fd-icon-btn"><i className="far fa-star" style={{ fontSize: "0.8rem" }}></i></button>
                    <button className="fd-icon-btn"><i className="far fa-bookmark" style={{ fontSize: "0.8rem" }}></i></button>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="fd-animate fd-animate-delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 24 }}>

                {/* LEFT — main card */}
                <div style={{ gridColumn: "span 8" }}>
                  <div className="fd-card" style={{ overflow: "hidden" }}>

                    {/* ✅ Hero image - Version adaptative corrigée */}
                    <div 
                      className="fd-hero-img" 
                      style={{ 
                        height: imageHeight === "auto" ? "320px" : `${imageHeight}px`,
                        minHeight: "180px",
                        maxHeight: "500px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8fafc",
                        transition: "height 0.3s ease"
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={formation.name}
                        style={{ 
                          maxWidth: "100%",
                          maxHeight: "100%",
                          width: "auto",
                          height: "auto",
                          objectFit: "contain",
                          display: "block"
                        }}
                        onLoad={handleImageLoad}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80";
                          setImageLoaded(true);
                          setImageHeight(280);
                        }}
                      />
                      
                      {/* Loading spinner */}
                      {!imageLoaded && (
                        <div style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "#94a3b8"
                        }}>
                          <i className="fas fa-spinner fa-spin"></i>
                        </div>
                      )}
                    </div>

                    <div style={{ padding: "28px 32px" }}>
                      {/* Badges */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
                        <span className="fd-badge" style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" }}>
                          📍 {normalize(formation.location) || "—"}
                        </span>
                        <span className="fd-badge" style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                          🏷️ {normalize(formation.domain) || "—"}
                        </span>
                        <span className={`fd-badge ${sc.bg} ${sc.text}`} style={{ border: `1px solid currentColor` }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }}></span>
                          {sc.label || formation.status}
                        </span>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: "0.93rem", color: "#475569", lineHeight: 1.8, margin: 0 }}>
                        {normalize(formation.description) || "Cette formation vous permettra de développer vos compétences avec un contenu complet et des projets pratiques."}
                      </p>

                      {/* Divider */}
                      <div style={{ height: 1, background: "linear-gradient(to right, #e2e8f0, transparent)", margin: "24px 0" }}></div>

                      {/* Instructor */}
                      <div className="fd-instructor">
                        <div className="fd-avatar">
                          <img alt="Instructor" src="https://i.pravatar.cc/100?img=12" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="fd-heading" style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
                            {normalize(formation.instructor) || "Formateur"}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 500 }}>
                            {normalize(formation.instructorTitle) || "Expert / Formateur"}
                          </div>
                        </div>
                        <button style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0ea5e9", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 50, padding: "6px 14px", cursor: "pointer" }}>
                          Contacter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — sidebar */}
                <div style={{ gridColumn: "span 4" }}>
                  <div className="fd-sidebar" style={{ padding: "24px" }}>

                    {/* Section title */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                      <div style={{ width: 4, height: 18, background: "linear-gradient(180deg, #0ea5e9, #0284c7)", borderRadius: 4 }}></div>
                      <h3 className="fd-heading" style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        Caractéristiques du cours
                      </h3>
                    </div>

                    {/* Characteristics list */}
                    <div>
                      {Object.entries(caracteristiques).map(([k, v]) => (
                        <div key={k} className="fd-char-row">
                          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
                            <span style={{ fontSize: "0.8rem" }}>{iconMap[k]}</span>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                              {labelMap[k] || k}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155", textAlign: "right" }}>
                            {v || "—"}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price & CTA */}
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748b" }}>Prix du cours</span>
                        <span className="fd-price">
                          {Number(formation.price) === 0 ? "Gratuit" : `${formation.price} DT`}
                        </span>
                      </div>

                      <Link to={"/inscription/" + formation._id} className="fd-enroll-btn">
                        <i className="fas fa-pen" style={{ marginRight: 8, fontSize: "0.78rem" }}></i>
                        S'inscrire maintenant
                      </Link>

                      <div style={{ marginTop: 12, textAlign: "center", fontSize: "0.72rem", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                        <span>🔒 Paiement sécurisé</span>
                        <span style={{ color: "#cbd5e1" }}>•</span>
                        <span>💬 Support 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ── Section Évaluations ── */}
              <div className="px-4 md:px-8 pb-12">
                <EvaluationSection formationId={id} />
              </div>

            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}