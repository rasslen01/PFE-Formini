import React from "react";
import axios from "axios";
import CardInscriptionsChart from "components/Cards/CardInscriptionsChart.js";
import CardUsersChart        from "components/Cards/CardUsersChart.js";
import CardStats             from "components/Cards/CardStats.js";

export default function Dashboard() {
  const [data,    setData]    = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error,   setError]   = React.useState("");

  React.useEffect(() => {
    axios
      .get("http://localhost:5000/users/admin-stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((r) => {
        console.log("[Dashboard] stats reçues:", r.data.stats);
        setData(r.data);
      })
      .catch((e) => {
        console.error("[Dashboard] erreur:", e.response?.data || e.message);
        setError(e.response?.data?.error || "Erreur de chargement");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats               = data?.stats              || {};
  const inscriptionsByMonth = data?.inscriptionsByMonth || [];

  return (
    <>
      {/* ── Ligne 1 : graphique ligne + doughnut ─────────── */}
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardInscriptionsChart data={inscriptionsByMonth} loading={loading} />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardUsersChart stats={data ? stats : null} loading={loading} />
        </div>
      </div>

      {/* ── Ligne 2 : KPI cards + accès rapides ─────────── */}
      <div className="flex flex-wrap mt-4">

        {/* 4 cards en grille 2×2 */}
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-4 flex items-center gap-2">
              <i className="fas fa-exclamation-circle" />
              {error} — Vérifiez que le backend tourne sur le port 5000.
            </div>
          )}

          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 pr-4 mb-4">
              <CardStats
                statSubtitle="ÉTUDIANTS"
                statTitle={loading ? "..." : String(stats.totalUsers ?? 0)}
                statArrow="up"
                statPercent=""
                statPercentColor="text-emerald-500"
                statDescripiron="inscrits sur la plateforme"
                statIconName="fas fa-user-graduate"
                statIconColor="bg-lightBlue-500"
              />
            </div>
            <div className="w-full lg:w-6/12 mb-4">
              <CardStats
                statSubtitle="FORMATIONS"
                statTitle={loading ? "..." : String(stats.totalFormations ?? 0)}
                statArrow="up"
                statPercent=""
                statPercentColor="text-emerald-500"
                statDescripiron="formations disponibles"
                statIconName="fas fa-book-open"
                statIconColor="bg-emerald-500"
              />
            </div>
            <div className="w-full lg:w-6/12 pr-4">
              <CardStats
                statSubtitle="INSCRIPTIONS"
                statTitle={loading ? "..." : String(stats.totalInscriptions ?? 0)}
                statArrow="up"
                statPercent=""
                statPercentColor="text-emerald-500"
                statDescripiron="inscriptions totales"
                statIconName="fas fa-clipboard-list"
                statIconColor="bg-amber-500"
              />
            </div>
            <div className="w-full lg:w-6/12">
              <CardStats
                statSubtitle="CENTRES"
                statTitle={loading ? "..." : String(stats.totalCentres ?? 0)}
                statArrow={stats.pendingCentres > 0 ? "down" : "up"}
                statPercent={String(stats.pendingCentres ?? 0)}
                statPercentColor={stats.pendingCentres > 0 ? "text-amber-500" : "text-emerald-500"}
                statDescripiron="en attente d'approbation"
                statIconName="fas fa-building"
                statIconColor="bg-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Accès rapides */}
        <div className="w-full xl:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-3 border-b border-blueGray-100">
              <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                Navigation
              </h6>
              <h2 className="text-blueGray-700 text-xl font-semibold">Accès rapides</h2>
            </div>
            <div className="p-4 flex flex-col gap-1">
              {[
                { label: "Utilisateurs",  icon: "fas fa-users",      href: "/admin/GestionDesUtilisateurs", color: "text-lightBlue-600" },
                { label: "Centres",       icon: "fas fa-building",   href: "/admin/GestionDesCentres",      color: "text-purple-600"    },
                { label: "Formations",    icon: "fas fa-book-open",  href: "/admin/GestionDesFormations",   color: "text-emerald-600"   },
                { label: "Badges",        icon: "fas fa-award",      href: "/admin/GestionDesBadges",       color: "text-amber-600"     },
                { label: "Logs",          icon: "fas fa-history",    href: "/admin/logs",                   color: "text-blueGray-500"  },
              ].map(({ label, icon, href, color }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blueGray-50 transition-all group"
                >
                  <i className={`${icon} ${color} text-base w-5 text-center`} />
                  <span className="text-sm font-semibold text-blueGray-600 group-hover:text-blueGray-800">
                    {label}
                  </span>
                  <i className="fas fa-chevron-right text-blueGray-200 text-xs ml-auto group-hover:text-blueGray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}