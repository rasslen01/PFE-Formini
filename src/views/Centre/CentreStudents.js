// src/views/Centre/CentreStudents.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API   = "http://localhost:5000/inscriptions";
const auth  = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export default function CentreStudents() {
  const [inscriptions,  setInscriptions]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [actionId,      setActionId]      = useState("");

  // Filtres
  const [searchQuery,     setSearchQuery]     = useState("");
  const [filterStatus,    setFilterStatus]    = useState("ALL");
  const [filterFormation, setFilterFormation] = useState("ALL");

  // Nom du centre depuis localStorage
  const centreName = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.centreName || u.centerName || u.centre || u.name || "";
    } catch { return ""; }
  })();

  // ── Charger les inscriptions depuis l'API ──────────
  const load = useCallback(async () => {
    if (!centreName) { setError("Nom du centre introuvable."); setLoading(false); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/byCentre/${encodeURIComponent(centreName)}`, auth());
      setInscriptions(res.data || []);
    } catch (e) {
      setError(e.response?.data?.error || "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }, [centreName]);

  useEffect(() => { load(); }, [load]);

  // ── Accepter ───────────────────────────────────────
  const handleAccept = async (id) => {
    setActionId(id);
    try {
      await axios.put(`${API}/acceptInscription/${id}`, {}, auth());
      setInscriptions(prev => prev.map(i => i._id === id ? { ...i, status: "accepted" } : i));
    } catch (e) { alert(e.response?.data?.error || "Erreur"); }
    finally { setActionId(""); }
  };

  // ── Rejeter ────────────────────────────────────────
  const handleReject = async (id) => {
    if (!window.confirm("Rejeter cette inscription ?")) return;
    setActionId(id);
    try {
      await axios.put(`${API}/rejectInscription/${id}`, {}, auth());
      setInscriptions(prev => prev.map(i => i._id === id ? { ...i, status: "rejected" } : i));
    } catch (e) { alert(e.response?.data?.error || "Erreur"); }
    finally { setActionId(""); }
  };

  // ── Supprimer ──────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette inscription ?")) return;
    setActionId(id);
    try {
      await axios.delete(`${API}/delete/${id}`, auth());
      setInscriptions(prev => prev.filter(i => i._id !== id));
    } catch (e) { alert(e.response?.data?.error || "Erreur"); }
    finally { setActionId(""); }
  };

  // ── Accepter tout ──────────────────────────────────
  const handleAcceptAll = async () => {
    if (!window.confirm("Accepter toutes les inscriptions en attente ?")) return;
    const pending = inscriptions.filter(i => i.status === "pending");
    for (const ins of pending) {
      try {
        await axios.put(`${API}/acceptInscription/${ins._id}`, {}, auth());
      } catch {}
    }
    await load();
  };

  // ── Helpers styles ─────────────────────────────────
  const statusStyle = { pending: "bg-amber-100 text-amber-700", accepted: "bg-emerald-100 text-emerald-700", rejected: "bg-red-100 text-red-700", cancelled: "bg-blueGray-100 text-blueGray-500" };
  const statusIcon  = { pending: "fas fa-clock", accepted: "fas fa-check-circle", rejected: "fas fa-times-circle", cancelled: "fas fa-ban" };
  const statusLabel = { pending: "En attente", accepted: "Accepté", rejected: "Rejeté", cancelled: "Annulé" };

  // ── Formations uniques pour filtre ─────────────────
  const formations = [...new Set(inscriptions.map(i => i.formationId?.name).filter(Boolean))];

  // ── Filtrage ───────────────────────────────────────
  const filtered = inscriptions.filter(i => {
    const name  = i.studentId?.name  || "";
    const email = i.studentId?.email || "";
    const fname = i.formationId?.name || "";
    const matchSearch    = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus    = filterStatus    === "ALL" || i.status === filterStatus;
    const matchFormation = filterFormation === "ALL" || fname === filterFormation;
    return matchSearch && matchStatus && matchFormation;
  });

  // ── Comptages ──────────────────────────────────────
  const counts = {
    total:    inscriptions.length,
    pending:  inscriptions.filter(i => i.status === "pending").length,
    accepted: inscriptions.filter(i => i.status === "accepted").length,
    rejected: inscriptions.filter(i => i.status === "rejected").length,
  };

  // ── Rendu ──────────────────────────────────────────
  return (
    <div className="pb-8">

      {/* ── Stats Cards ─────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-blueGray-700">{counts.total}</p>
          <p className="text-xs text-blueGray-400 font-bold uppercase">Total</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border-b-4 border-amber-500">
          <p className="text-2xl font-bold text-amber-500">{counts.pending}</p>
          <p className="text-xs text-blueGray-400 font-bold uppercase"><i className="fas fa-clock mr-1" />En attente</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border-b-4 border-emerald-500">
          <p className="text-2xl font-bold text-emerald-500">{counts.accepted}</p>
          <p className="text-xs text-blueGray-400 font-bold uppercase"><i className="fas fa-check mr-1" />Acceptés</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border-b-4 border-red-500">
          <p className="text-2xl font-bold text-red-500">{counts.rejected}</p>
          <p className="text-xs text-blueGray-400 font-bold uppercase"><i className="fas fa-times mr-1" />Rejetés</p>
        </div>
      </div>

      {/* ── Table ───────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-lg">

        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
            <h3 className="font-bold text-xl text-blueGray-700">
              <i className="fas fa-user-graduate text-lightBlue-500 mr-2" />
              Inscriptions des Étudiants
            </h3>
            <div className="flex gap-2">
              <button onClick={load}
                className="bg-blueGray-100 text-blueGray-600 px-3 py-2 rounded text-sm hover:bg-blueGray-200 transition-all"
                title="Rafraîchir">
                <i className="fas fa-sync-alt" />
              </button>
              {counts.pending > 0 && (
                <button onClick={handleAcceptAll}
                  className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-600 transition-all shadow">
                  <i className="fas fa-check-double mr-1" />Accepter tout ({counts.pending})
                </button>
              )}
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                <i className="fas fa-search" />
              </span>
              <input type="text" placeholder="Rechercher étudiant..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="border rounded px-3 py-2 pl-9 w-56 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500" />
            </div>

            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="border px-3 py-2 rounded text-sm">
              <option value="ALL">Tous les statuts</option>
              <option value="pending">⏳ En attente</option>
              <option value="accepted">✅ Accepté</option>
              <option value="rejected">❌ Rejeté</option>
              <option value="cancelled">🚫 Annulé</option>
            </select>

            <select value={filterFormation} onChange={e => setFilterFormation(e.target.value)}
              className="border px-3 py-2 rounded text-sm">
              <option value="ALL">Toutes les formations</option>
              {formations.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <i className="fas fa-spinner fa-spin text-3xl text-lightBlue-400 mr-3" />
            <span className="text-blueGray-400">Chargement...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-red-400">
            <i className="fas fa-exclamation-triangle text-3xl mb-3" />
            <p>{error}</p>
            <button onClick={load} className="mt-3 text-sm text-lightBlue-500 hover:underline">
              Réessayer
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {["Étudiant", "Formation", "Date inscription", "Statut", "Actions"].map(h => (
                    <th key={h} className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(ins => (
                  <tr key={ins._id} className="hover:bg-blueGray-50 border-b">

                    {/* Étudiant */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-lightBlue-100 flex items-center justify-center font-bold text-lightBlue-700 text-sm flex-shrink-0">
                          {(ins.studentId?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-blueGray-700">{ins.studentId?.name || "—"}</p>
                          <p className="text-xs text-blueGray-400">{ins.studentId?.email || "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Formation */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-blueGray-700">
                        {ins.formationId?.name || "—"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-blueGray-400">
                      <i className="fas fa-calendar mr-1" />
                      {ins.createdAt ? new Date(ins.createdAt).toLocaleDateString("fr-FR") : "—"}
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 ${statusStyle[ins.status] || "bg-blueGray-100 text-blueGray-500"}`}>
                        <i className={statusIcon[ins.status] || "fas fa-circle"} />
                        {statusLabel[ins.status] || ins.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {ins.status === "pending" && (
                          <>
                            <button onClick={() => handleAccept(ins._id)}
                              disabled={actionId === ins._id}
                              className="bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded shadow hover:bg-emerald-600 transition-all disabled:opacity-50">
                              {actionId === ins._id ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-check mr-1" />Accepter</>}
                            </button>
                            <button onClick={() => handleReject(ins._id)}
                              disabled={actionId === ins._id}
                              className="bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded shadow hover:bg-red-600 transition-all disabled:opacity-50">
                              <i className="fas fa-times mr-1" />Rejeter
                            </button>
                          </>
                        )}
                        {(ins.status === "accepted" || ins.status === "rejected" || ins.status === "cancelled") && (
                          <>
                            {ins.status !== "accepted" && (
                              <button onClick={() => handleAccept(ins._id)}
                                disabled={actionId === ins._id}
                                className="bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded hover:bg-emerald-200 transition-all">
                                <i className="fas fa-undo mr-1" />Accepter
                              </button>
                            )}
                            <button onClick={() => handleDelete(ins._id)}
                              disabled={actionId === ins._id}
                              className="bg-red-100 text-red-700 font-bold text-xs px-3 py-1.5 rounded hover:bg-red-200 transition-all">
                              <i className="fas fa-trash mr-1" />Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-blueGray-400">
                      <i className="fas fa-users-slash text-3xl mb-3 block opacity-40" />
                      {searchQuery || filterStatus !== "ALL" || filterFormation !== "ALL"
                        ? "Aucun résultat pour ces filtres"
                        : "Aucune inscription pour vos formations"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t text-sm text-blueGray-400 flex justify-between items-center">
          <span>{filtered.length} résultat(s) sur {inscriptions.length} inscription(s)</span>
          {counts.pending > 0 && (
            <span className="text-amber-500 font-bold">
              <i className="fas fa-exclamation-circle mr-1" />
              {counts.pending} en attente de validation
            </span>
          )}
        </div>
      </div>
    </div>
  );
}