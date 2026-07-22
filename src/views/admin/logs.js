// src/views/admin/logs.js
// Page logs admin — affiche toutes les actions du site en temps réel

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API     = "http://localhost:5000/logs";
const authCfg = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

// ─── Config couleurs / icônes ─────────────────────────
const LEVEL_STYLES = {
  INFO:    { text: "text-lightBlue-600", bg: "bg-lightBlue-100",  icon: "fas fa-info-circle"           },
  WARNING: { text: "text-amber-600",     bg: "bg-amber-100",      icon: "fas fa-exclamation-triangle"  },
  ERROR:   { text: "text-red-600",       bg: "bg-red-100",        icon: "fas fa-times-circle"          },
};

const STATUS_STYLES = {
  SUCCESS: { text: "text-emerald-700", bg: "bg-emerald-100", label: "Succès"  },
  FAILED:  { text: "text-red-700",     bg: "bg-red-100",     label: "Échec"   },
  BLOCKED: { text: "text-orange-700",  bg: "bg-orange-100",  label: "Bloqué"  },
};

const CATEGORY_ICONS = {
  AUTH:        "fas fa-key",
  USER:        "fas fa-user",
  FORMATION:   "fas fa-book-open",
  CENTRE:      "fas fa-building",
  INSCRIPTION: "fas fa-clipboard-list",
  BADGE:       "fas fa-award",
  SYSTEM:      "fas fa-cog",
};

const CATEGORY_COLORS = {
  AUTH:        "bg-purple-100 text-purple-700",
  USER:        "bg-lightBlue-100 text-lightBlue-700",
  FORMATION:   "bg-emerald-100 text-emerald-700",
  CENTRE:      "bg-indigo-100 text-indigo-700",
  INSCRIPTION: "bg-amber-100 text-amber-700",
  BADGE:       "bg-yellow-100 text-yellow-700",
  SYSTEM:      "bg-blueGray-100 text-blueGray-700",
};

// ─── Composant principal ──────────────────────────────
export default function Logs() {
  const [logs,       setLogs]       = useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);

  // Filtres
  const [category, setCategory] = useState("ALL");
  const [level,    setLevel]    = useState("ALL");
  const [status,   setStatus]   = useState("ALL");
  const [search,   setSearch]   = useState("");

  const LIMIT = 50;

  // ── Charger les logs ─────────────────────────────────
  const fetchLogs = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, page: p };
      if (category !== "ALL") params.category = category;
      if (level    !== "ALL") params.level    = level;
      if (status   !== "ALL") params.status   = status;
      if (search.trim())      params.search   = search.trim();

      const res = await axios.get(API, { ...authCfg(), params });
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
      setPage(p);
    } catch (err) {
      console.error("Erreur logs:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [category, level, status, search]);

  // ── Charger les stats ────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/stats`, authCfg());
      setStats(res.data);
    } catch {}
  }, []);

  useEffect(() => { fetchLogs(1); fetchStats(); }, [fetchLogs, fetchStats]);

  // ── Vider les logs ────────────────────────────────────
  const handleClear = async () => {
    if (!window.confirm("Supprimer tous les logs ? Cette action est irréversible.")) return;
    await axios.delete(`${API}/clear`, authCfg());
    fetchLogs(1);
    fetchStats();
  };

  // ── Formater la date ──────────────────────────────────
  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR") + " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">

        {/* ── Stats rapides ───────────────────────────── */}
        {stats && (
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center gap-3">
              <i className="fas fa-list text-blueGray-400 text-lg" />
              <div>
                <p className="text-xs text-blueGray-400 uppercase font-bold">Total</p>
                <p className="text-xl font-bold text-blueGray-700">{stats.total?.toLocaleString()}</p>
              </div>
            </div>
            {stats.byLevel?.map(l => {
              const style = LEVEL_STYLES[l._id] || {};
              return (
                <div key={l._id} className={`rounded-xl shadow-sm px-4 py-3 flex items-center gap-3 ${style.bg || "bg-white"}`}>
                  <i className={`${style.icon} ${style.text} text-lg`} />
                  <div>
                    <p className={`text-xs uppercase font-bold ${style.text}`}>{l._id}</p>
                    <p className={`text-xl font-bold ${style.text}`}>{l.count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Carte principale ────────────────────────── */}
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-xl">

          {/* Header */}
          <div className="px-5 py-4 border-b border-blueGray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <i className="fas fa-history text-lightBlue-500 text-lg" />
              <h3 className="font-semibold text-lg text-blueGray-700">Journal d'activité</h3>
              <span className="bg-blueGray-100 text-blueGray-500 text-xs font-bold px-2 py-0.5 rounded-full">
                {total.toLocaleString()} entrées
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { fetchLogs(1); fetchStats(); }}
                className="bg-blueGray-100 text-blueGray-600 px-3 py-2 rounded-lg text-sm hover:bg-blueGray-200 transition-all"
                title="Rafraîchir">
                <i className="fas fa-sync-alt" />
              </button>
              <button onClick={handleClear}
                className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all">
                <i className="fas fa-trash mr-1" /> Vider
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="px-5 py-3 border-b border-blueGray-50 flex flex-wrap gap-2 items-center">
            {/* Recherche */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                <i className="fas fa-search text-xs" />
              </span>
              <input type="text" placeholder="Rechercher..." value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchLogs(1)}
                className="border rounded-lg px-3 py-2 pl-8 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-lightBlue-400" />
            </div>

            {/* Filtre catégorie */}
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-400">
              <option value="ALL">Toutes catégories</option>
              {["AUTH","USER","FORMATION","CENTRE","INSCRIPTION","BADGE","SYSTEM"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Filtre level */}
            <select value={level} onChange={e => setLevel(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-400">
              <option value="ALL">Tous niveaux</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
            </select>

            {/* Filtre statut */}
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-400">
              <option value="ALL">Tous statuts</option>
              <option value="SUCCESS">Succès</option>
              <option value="FAILED">Échec</option>
              <option value="BLOCKED">Bloqué</option>
            </select>

            {/* Reset */}
            {(category !== "ALL" || level !== "ALL" || status !== "ALL" || search) && (
              <button onClick={() => { setCategory("ALL"); setLevel("ALL"); setStatus("ALL"); setSearch(""); }}
                className="text-sm text-blueGray-400 hover:text-red-500 transition-all">
                <i className="fas fa-times mr-1" /> Reset
              </button>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <i className="fas fa-spinner fa-spin text-3xl text-lightBlue-400 mr-3" />
              <span className="text-blueGray-400">Chargement...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-blueGray-300">
              <i className="fas fa-inbox text-5xl mb-3 opacity-30" />
              <p className="text-sm">Aucun log trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blueGray-50">
                    {["Date & heure", "Catégorie", "Action", "Utilisateur", "Détails", "Niveau", "Statut"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-blueGray-400 text-xs uppercase font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => {
                    const lvl = LEVEL_STYLES[log.level]  || {};
                    const sts = STATUS_STYLES[log.status] || {};
                    const cat = CATEGORY_COLORS[log.category] || "bg-blueGray-100 text-blueGray-600";
                    const catIcon = CATEGORY_ICONS[log.category] || "fas fa-circle";
                    return (
                      <tr key={log._id} className={`border-b transition-colors ${i % 2 === 0 ? "" : "bg-blueGray-50 bg-opacity-40"} hover:bg-lightBlue-50`}>

                        {/* Date */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-mono text-xs text-blueGray-500">{formatDate(log.createdAt)}</span>
                        </td>

                        {/* Catégorie */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${cat}`}>
                            <i className={`${catIcon} text-xs`} />
                            {log.category}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-semibold text-blueGray-700">{log.action}</span>
                        </td>

                        {/* Utilisateur */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-lightBlue-100 flex items-center justify-center text-xs font-bold text-lightBlue-700 flex-shrink-0">
                              {(log.userName || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-blueGray-700">{log.userName || "Anonyme"}</p>
                              {log.userRole && (
                                <p className="text-xs text-blueGray-400">{log.userRole}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Détails */}
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-xs text-blueGray-500 truncate" title={log.details}>
                            {log.details || "—"}
                          </p>
                        </td>

                        {/* Niveau */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${lvl.bg} ${lvl.text}`}>
                            <i className={`${lvl.icon} text-xs`} />
                            {log.level}
                          </span>
                        </td>

                        {/* Statut */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${sts.bg} ${sts.text}`}>
                            {sts.label || log.status}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t flex items-center justify-between">
              <span className="text-xs text-blueGray-400">
                Page {page} / {totalPages} — {total} entrées
              </span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => fetchLogs(page - 1)}
                  className="px-3 py-1.5 text-sm rounded-lg border hover:bg-blueGray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <i className="fas fa-chevron-left" />
                </button>
                <button disabled={page >= totalPages} onClick={() => fetchLogs(page + 1)}
                  className="px-3 py-1.5 text-sm rounded-lg border hover:bg-blueGray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-2 border-t text-xs text-blueGray-400 flex justify-between">
            <span>Affichage de {Math.min(logs.length, LIMIT)} sur {total} entrées</span>
            <span>Mis à jour automatiquement à chaque action</span>
          </div>
        </div>

      </div>
    </div>
  );
}