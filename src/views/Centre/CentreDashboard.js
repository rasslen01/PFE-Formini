// ═══════════════════════════════════════════════
// 📁 src/views/centre/CentreDashboard.js
// Données réelles calculées depuis les formations
// ═══════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { getFormationsByCentre } from "Services/ApiFormation";

const BACKEND_URL = "http://localhost:5000";

const buildImageUrl = (img) => {
  if (!img || img === "" || img === "default-formation.png") return null;
  if (img.startsWith("http") || img.startsWith("data:")) return img;
  return `${BACKEND_URL}${img.startsWith("/") ? img : "/" + img}`;
};

const DOMAIN_IMAGES = {
  informatique: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=80&q=60",
  marketing:    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&q=60",
  data:         "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&q=60",
  mobile:       "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=80&q=60",
  ia:           "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=80&q=60",
  reseaux:      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=80&q=60",
};
const getDomainImage = (domain) =>
  DOMAIN_IMAGES[(domain || "").toLowerCase()] ||
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&q=60";

export default function CentreDashboard() {
  const [centre, setCentre]       = useState({});
  const [formations, setFormations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) setCentre(user);

    const centreName =
      user?.centreName || user?.centerName || user?.centre || user?.name || "";

    if (centreName) {
      loadFormations(centreName);
    } else {
      setError("Centre introuvable.");
      setLoading(false);
    }
  }, []);

  const loadFormations = async (centreName) => {
    setLoading(true);
    try {
      const res = await getFormationsByCentre(centreName);
      setFormations(res.data?.formationsList || []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  // ── Calcul stats réelles ──
  const total      = formations.length;
  const accepted   = formations.filter((f) => f.status === "accepted").length;
  const pending    = formations.filter((f) => f.status === "pending").length;
  const rejected   = formations.filter((f) => f.status === "rejected").length;
  const totalRevenuePotentiel = formations.reduce((sum, f) => sum + (Number(f.price) || 0), 0);
  const freeCount  = formations.filter((f) => Number(f.price) === 0).length;
  const paidCount  = formations.filter((f) => Number(f.price) > 0).length;

  // Top 4 formations par prix décroissant
  const topFormations = [...formations]
    .filter((f) => f.status === "accepted")
    .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    .slice(0, 4);

  // Répartition par domaine
  const domainMap = {};
  formations.forEach((f) => {
    const d = (f.domain || "autre").toLowerCase();
    domainMap[d] = (domainMap[d] || 0) + 1;
  });
  const domainEntries = Object.entries(domainMap).sort((a, b) => b[1] - a[1]);

  // Formations à venir (date future)
  const now = new Date();
  const upcoming = formations
    .filter((f) => f.date && new Date(f.date) > now && f.status === "accepted")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const statCards = [
    {
      label: "Total Formations",
      value: total,
      sub: `${accepted} acceptée${accepted > 1 ? "s" : ""}`,
      subColor: "text-emerald-500",
      icon: "fas fa-book",
      bg: "bg-lightBlue-100",
      iconColor: "text-lightBlue-500",
    },
    {
      label: "En attente",
      value: pending,
      sub: "Attente validation admin",
      subColor: "text-amber-500",
      icon: "fas fa-hourglass-half",
      bg: "bg-amber-100",
      iconColor: "text-amber-500",
    },
    {
      label: "Formations payantes",
      value: paidCount,
      sub: `${freeCount} gratuite${freeCount > 1 ? "s" : ""}`,
      subColor: "text-purple-500",
      icon: "fas fa-tag",
      bg: "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      label: "Revenu potentiel",
      value: totalRevenuePotentiel + " DT",
      sub: "Somme des prix formations",
      subColor: "text-emerald-500",
      icon: "fas fa-coins",
      bg: "bg-emerald-100",
      iconColor: "text-emerald-500",
    },
    {
      label: "Formations rejetées",
      value: rejected,
      sub: "Rejetées par l'admin",
      subColor: "text-red-400",
      icon: "fas fa-times-circle",
      bg: "bg-red-100",
      iconColor: "text-red-500",
    },
    {
      label: "À venir",
      value: upcoming.length,
      sub: "Formations planifiées",
      subColor: "text-lightBlue-500",
      icon: "fas fa-calendar-alt",
      bg: "bg-lightBlue-100",
      iconColor: "text-lightBlue-500",
    },
  ];

  return (
    <div className="pb-8">
      <style>{`
        @keyframes cf-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cf-animate { animation: cf-fade-up 0.45s ease both; }
        .cf-animate-1 { animation-delay: 0.05s; }
        .cf-animate-2 { animation-delay: 0.10s; }
        .cf-animate-3 { animation-delay: 0.15s; }
      `}</style>

      {/* Welcome Banner */}
      <div className="cf-animate bg-gradient-to-r from-lightBlue-600 to-lightBlue-800 rounded-xl shadow-lg p-6 mb-8 text-white" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, opacity: 0.08, fontSize: 160 }}>
          <i className="fas fa-building"></i>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Bienvenue, {centre.name || "Centre de Formation"} ! 🏫
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem" }}>
              Voici un aperçu de vos formations en temps réel.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "5px 14px", fontSize: "0.78rem", fontWeight: 700 }}>
                <i className="fas fa-check-circle mr-1"></i>{accepted} acceptées
              </span>
              <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "5px 14px", fontSize: "0.78rem", fontWeight: 700 }}>
                <i className="fas fa-hourglass-half mr-1"></i>{pending} en attente
              </span>
              <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "5px 14px", fontSize: "0.78rem", fontWeight: 700 }}>
                <i className="fas fa-layer-group mr-1"></i>{total} au total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm">
          <i className="fas fa-exclamation-circle mr-2"></i>{error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-8 text-center text-blueGray-400 mb-6">
          <i className="fas fa-spinner fa-spin mr-2 text-lightBlue-500 text-xl"></i>
          <span className="text-sm">Chargement des données...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Stat Cards */}
          <div className="cf-animate cf-animate-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6" style={{ border: "1px solid rgba(226,232,240,0.8)" }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blueGray-400 text-xs font-bold uppercase mb-1">{card.label}</p>
                    <p className="text-3xl font-bold text-blueGray-700">{card.value}</p>
                    <p className={`text-sm mt-1 ${card.subColor}`}>
                      <i className="fas fa-info-circle mr-1" style={{ fontSize: "0.7rem" }}></i>
                      {card.sub}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center flex-shrink-0`}>
                    <i className={`${card.icon} ${card.iconColor} text-xl`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="cf-animate cf-animate-2 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Top formations */}
            <div className="bg-white rounded-xl shadow-lg" style={{ border: "1px solid rgba(226,232,240,0.8)" }}>
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-blueGray-700">
                  <i className="fas fa-trophy text-amber-500 mr-2"></i>Top formations (par prix)
                </h3>
                <span className="text-xs text-blueGray-400 bg-blueGray-100 px-3 py-1 rounded-full">
                  Acceptées uniquement
                </span>
              </div>
              <div className="p-6">
                {topFormations.length === 0 ? (
                  <div className="text-center py-8 text-blueGray-400">
                    <i className="fas fa-book-open text-3xl mb-2 block"></i>
                    <span className="text-sm">Aucune formation acceptée</span>
                  </div>
                ) : (
                  topFormations.map((f, i) => (
                    <div key={f._id} className="flex items-center gap-3 py-3 border-b last:border-0">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                        i === 0 ? "bg-amber-500" : i === 1 ? "bg-blueGray-400" : i === 2 ? "bg-orange-400" : "bg-blueGray-300"
                      }`}>{i + 1}</span>
                      <img
                        src={buildImageUrl(f.image) || getDomainImage(f.domain)}
                        alt={f.name}
                        onError={(e) => { e.target.src = getDomainImage(f.domain); }}
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="font-semibold text-sm text-blueGray-700 truncate">{f.name}</p>
                        <p className="text-xs text-blueGray-400">
                          {f.domain || "—"} • {f.location || "—"}
                        </p>
                      </div>
                      <span className="text-emerald-500 font-bold text-sm flex-shrink-0">
                        {Number(f.price) === 0 ? "Gratuit" : `${f.price} DT`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Répartition par domaine */}
            <div className="bg-white rounded-xl shadow-lg" style={{ border: "1px solid rgba(226,232,240,0.8)" }}>
              <div className="px-6 py-4 border-b">
                <h3 className="font-bold text-blueGray-700">
                  <i className="fas fa-chart-pie text-lightBlue-500 mr-2"></i>Répartition par domaine
                </h3>
              </div>
              <div className="p-6">
                {domainEntries.length === 0 ? (
                  <div className="text-center py-8 text-blueGray-400">
                    <i className="fas fa-layer-group text-3xl mb-2 block"></i>
                    <span className="text-sm">Aucune formation</span>
                  </div>
                ) : (
                  domainEntries.map(([domain, count]) => {
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    const colors = {
                      informatique: "#3b82f6", marketing: "#8b5cf6", data: "#10b981",
                      mobile: "#ec4899", ia: "#f59e0b", reseaux: "#ef4444",
                    };
                    const color = colors[domain] || "#0ea5e9";
                    return (
                      <div key={domain} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", textTransform: "capitalize" }}>
                            {domain}
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 700 }}>
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div style={{ height: 8, backgroundColor: "#f1f5f9", borderRadius: 50, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, backgroundColor: color, borderRadius: 50, transition: "width 0.6s ease" }}></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Formations à venir */}
          <div className="cf-animate cf-animate-3 bg-white rounded-xl shadow-lg" style={{ border: "1px solid rgba(226,232,240,0.8)" }}>
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-blueGray-700">
                <i className="fas fa-calendar-alt text-lightBlue-500 mr-2"></i>
                Formations à venir
              </h3>
              <span className="text-xs text-blueGray-400 bg-blueGray-100 px-3 py-1 rounded-full">
                {upcoming.length} planifiée{upcoming.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="p-6">
              {upcoming.length === 0 ? (
                <div className="text-center py-8 text-blueGray-400">
                  <i className="fas fa-calendar-times text-3xl mb-2 block"></i>
                  <span className="text-sm">Aucune formation planifiée</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcoming.map((f) => (
                    <div key={f._id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
                      <img
                        src={buildImageUrl(f.image) || getDomainImage(f.domain)}
                        alt={f.name}
                        onError={(e) => { e.target.src = getDomainImage(f.domain); }}
                        style={{ width: "100%", height: 80, objectFit: "cover" }}
                      />
                      <div style={{ padding: "10px 12px" }}>
                        <p style={{ fontWeight: 700, fontSize: "0.83rem", color: "#0f172a", marginBottom: 4 }}>{f.name}</p>
                        <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                          <i className="fas fa-calendar mr-1"></i>
                          {new Date(f.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                          {f.time ? ` à ${f.time}` : ""}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 2 }}>
                          <i className="fas fa-map-marker-alt mr-1"></i>{f.location || "—"}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                          <span style={{ fontSize: "0.7rem", backgroundColor: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: 50, padding: "2px 8px", fontWeight: 600 }}>
                            {f.domain || "—"}
                          </span>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: Number(f.price) === 0 ? "#10b981" : "#0ea5e9" }}>
                            {Number(f.price) === 0 ? "Gratuit" : `${f.price} DT`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}