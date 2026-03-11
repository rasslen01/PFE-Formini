// ═══════════════════════════════════════════════
// 📁 src/components/Cards/CardTableFormations.js
// Gestion des formations (API) + Modal avec backdrop (même style que CardTable)
// + Select Centres (depuis backend) + Select Domaine
// ═══════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  getAllFormations,
  addFormation,
  updateFormation,
  deleteFormation,
  acceptFormation,
} from "Services/ApiFormation";

import { getAcceptedCentres } from "Services/ApiCentre";

// ─────────────────────────────────────────
// Domaine options
// ─────────────────────────────────────────
const DOMAIN_OPTIONS = [
  "informatique",
  "marketing",
  "data",
  "mobile",
  "ia",
  "reseaux",
  "gestion",
  "finance",
  "langues",
  "sante",
  "tourisme",
];

// ─────────────────────────────────────────
// Template vide pour une nouvelle formation
// ─────────────────────────────────────────
const emptyFormation = {
  _id: "",
  name: "",
  instructor: "",
  centre: "",
  centreLogo: "",
  location: "",
  price: 0,
  date: "",
  time: "",
  status: "pending",
  domain: "",
};

export default function CardTableFormations({ color = "light" }) {
  // ─────────────────────────────────────────
  // États
  // ─────────────────────────────────────────
  const [formations, setFormations] = useState([]);
  const [centres, setCentres] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ─────────────────────────────────────────
  // Fetch formations (backend)
  // ─────────────────────────────────────────
  const fetchFormations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllFormations();
      const list = res.data?.formationsList || [];
      setFormations(list);
    } catch (err) {
      console.error("❌ fetchFormations error:", err);
      setError(err?.response?.data?.error || "Erreur lors du chargement");
      setFormations([]);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Fetch centres acceptés (backend)
  // IMPORTANT: backend doit renvoyer { centres: [...] }
  // ─────────────────────────────────────────
  const fetchCentres = async () => {
    try {
      const res = await getAcceptedCentres();
      setCentres(res.data?.centres || []);
    } catch (err) {
      console.error("❌ fetchCentres error:", err);
      setCentres([]);
      // On ne bloque pas l'app si centres fail
    }
  };

  useEffect(() => {
    fetchFormations();
    fetchCentres();
  }, []);

  // ─────────────────────────────────────────
  // Bloquer scroll du body quand modal ouverte
  // ─────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // ─────────────────────────────────────────
  // Open Add Modal
  // ─────────────────────────────────────────
  const openAddModal = () => {
    setIsAdding(true);
    setSelectedFormation({ ...emptyFormation });
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Open Edit Modal
  // ─────────────────────────────────────────
  const openEditModal = (formation) => {
    setIsAdding(false);

    const safeDate = formation?.date
      ? new Date(formation.date).toISOString().slice(0, 10)
      : "";

    setSelectedFormation({
      ...formation,
      date: safeDate,
      time: formation?.time || "",
      domain: formation?.domain || "",
      centre: formation?.centre || "",
    });

    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Handle Field Change
  // ─────────────────────────────────────────
  const handleFieldChange = (field, value) => {
    setSelectedFormation((prev) => ({ ...prev, [field]: value }));
  };

  // ─────────────────────────────────────────
  // Save (Add or Edit)
  // ─────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedFormation?.name?.trim()) return alert("Le nom de la formation est obligatoire.");
    if (!selectedFormation?.instructor?.trim()) return alert("Le formateur est obligatoire.");
    if (!selectedFormation?.centre?.trim()) return alert("Le centre est obligatoire.");

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: selectedFormation.name,
        instructor: selectedFormation.instructor,
        centre: selectedFormation.centre, // String (name)
        location: selectedFormation.location,
        price: Number(selectedFormation.price) || 0,
        date: selectedFormation.date ? new Date(selectedFormation.date) : null,
        time: selectedFormation.time || "",
        status: selectedFormation.status || "pending",
        domain: selectedFormation.domain || "",
        centreLogo: { type: String, default: "" },
      };

      if (isAdding) {
        await addFormation(payload);
      } else {
        await updateFormation(selectedFormation._id, payload);
      }

      setShowModal(false);
      setSelectedFormation(null);

      await fetchFormations();
      alert(isAdding ? "✅ Formation ajoutée !" : "✅ Formation mise à jour !");
    } catch (err) {
      console.error("❌ Save error:", err);
      setError(err?.response?.data?.error || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Delete
  // ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette formation ?")) return;

    setLoading(true);
    setError("");
    try {
      await deleteFormation(id);
      await fetchFormations();
      alert("✅ Formation supprimée !");
    } catch (err) {
      console.error("❌ Delete error:", err);
      setError(err?.response?.data?.error || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Accept
  // ─────────────────────────────────────────
  const handleAccept = async (id) => {
    setLoading(true);
    setError("");
    try {
      await acceptFormation(id);
      await fetchFormations();
      alert("✅ Formation acceptée !");
    } catch (err) {
      console.error("❌ Accept error:", err);
      setError(err?.response?.data?.error || "Erreur lors de l'acceptation");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Reject (update status)
  // ─────────────────────────────────────────
  const handleReject = async (id) => {
    if (!window.confirm("Rejeter cette formation ?")) return;

    setLoading(true);
    setError("");
    try {
      await updateFormation(id, { status: "rejected" });
      await fetchFormations();
      alert("✅ Formation rejetée !");
    } catch (err) {
      console.error("❌ Reject error:", err);
      setError(err?.response?.data?.error || "Erreur lors du rejet");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Cancel Modal
  // ─────────────────────────────────────────
  const handleCancel = () => {
    setShowModal(false);
    setSelectedFormation(null);
  };

  // ─────────────────────────────────────────
  // Filter
  // ─────────────────────────────────────────
  const filteredFormations = formations.filter((f) => {
    const name = (f?.name || "").toLowerCase();
    const matchSearch = name.includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "ALL" || f?.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ─────────────────────────────────────────
  // Status styles
  // ─────────────────────────────────────────
  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blueGray-100 text-blueGray-700";
    }
  };

  // ─────────────────────────────────────────
  // Counts
  // ─────────────────────────────────────────
  const pendingCount = formations.filter((f) => f.status === "pending").length;
  const acceptedCount = formations.filter((f) => f.status === "accepted").length;
  const rejectedCount = formations.filter((f) => f.status === "rejected").length;

  // ─────────────────────────────────────────
  // Styles
  // ─────────────────────────────────────────
  const isLight = color === "light";
  const headerCellClass =
    "px-6 py-3 text-xs uppercase font-semibold text-left border-b " +
    (isLight
      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700");

  const headers = ["Nom", "Formateur", "Centre", "Lieu", "Prix", "Date", "Heure", "Statut", "Actions"];

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (isLight ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        {/* Error */}
        {error && (
          <div className="bg-red-100 border-b border-red-200 text-red-700 px-4 py-2 text-xs flex justify-between items-center">
            <span>
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </span>
            <button onClick={() => setError("")}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="px-4 pt-3 flex flex-wrap gap-3">
          <span className="text-xs bg-blueGray-100 text-blueGray-600 px-3 py-1 rounded-full font-bold">
            Total: {formations.length}
          </span>
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold">
            <i className="fas fa-clock mr-1"></i>Pending: {pendingCount}
          </span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">
            <i className="fas fa-check mr-1"></i>Acceptées: {acceptedCount}
          </span>
          <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
            <i className="fas fa-times mr-1"></i>Rejetées: {rejectedCount}
          </span>
        </div>

        {/* Header */}
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className={`font-semibold text-lg ${isLight ? "text-blueGray-700" : "text-white"}`}>
              Gestion des Formations
            </h3>

            <div className="flex flex-wrap gap-2 items-center">
              {/* Search */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border rounded px-3 py-2 pl-9 w-48 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border px-3 py-2 rounded text-sm"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="pending">⏳ Pending</option>
                <option value="accepted">✅ Acceptée</option>
                <option value="rejected">❌ Rejetée</option>
              </select>

              {/* Reload */}
              <button
                onClick={fetchFormations}
                disabled={loading}
                className="bg-blueGray-100 text-blueGray-700 px-3 py-2 rounded text-sm font-bold hover:bg-blueGray-200 disabled:opacity-50"
                title="Rafraîchir"
              >
                <i className="fas fa-sync-alt"></i>
              </button>

              {/* Add button */}
              <button
                onClick={openAddModal}
                disabled={loading}
                className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-600 disabled:opacity-50"
              >
                <i className="fas fa-plus mr-1"></i>Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="px-4 py-2 text-center text-lightBlue-500 text-sm">
            <i className="fas fa-spinner fa-spin mr-2"></i>Chargement...
          </div>
        )}

        {/* Table */}
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h} className={headerCellClass}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFormations.length > 0 ? (
                filteredFormations.map((f) => (
                  <tr key={f._id} className="hover:bg-blueGray-50 border-b">
                    <td className="px-6 py-4 text-sm font-semibold">{f.name}</td>
                    <td className="px-6 py-4 text-sm">{f.instructor}</td>
                    <td className="px-6 py-4 text-sm">{f.centre}</td>
                    <td className="px-6 py-4 text-sm">{f.location}</td>
                    <td className="px-6 py-4 text-sm">
                      {Number(f.price) === 0 ? (
                        <span className="text-emerald-500 font-semibold">Gratuit</span>
                      ) : (
                        `${f.price} DT`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {f.date ? new Date(f.date).toISOString().slice(0, 10) : ""}
                    </td>
                    <td className="px-6 py-4 text-sm">{f.time || ""}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyle(f.status)}`}>
                        {f.status === "pending" && "⏳ "}
                        {f.status === "accepted" && "✅ "}
                        {f.status === "rejected" && "❌ "}
                        {f.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {f.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAccept(f._id)}
                              disabled={loading}
                              className="bg-emerald-500 text-white font-bold uppercase text-xs px-3 py-1 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
                            >
                              <i className="fas fa-check mr-1"></i>Accepter
                            </button>
                            <button
                              onClick={() => handleReject(f._id)}
                              disabled={loading}
                              className="bg-orange-500 text-white font-bold uppercase text-xs px-3 py-1 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
                            >
                              <i className="fas fa-times mr-1"></i>Rejeter
                            </button>
                          </>
                        )}

                        {f.status === "rejected" && (
                          <button
                            onClick={() => handleAccept(f._id)}
                            disabled={loading}
                            className="bg-emerald-100 text-emerald-700 font-bold uppercase text-xs px-3 py-1 rounded hover:bg-emerald-200 transition-all disabled:opacity-50"
                          >
                            <i className="fas fa-undo mr-1"></i>Accepter
                          </button>
                        )}

                        <button
                          onClick={() => openEditModal(f)}
                          disabled={loading}
                          className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-3 py-1 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          <i className="fas fa-edit mr-1"></i>Modifier
                        </button>

                        <button
                          onClick={() => handleDelete(f._id)}
                          disabled={loading}
                          className="bg-red-500 text-white font-bold uppercase text-xs px-3 py-1 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          <i className="fas fa-trash mr-1"></i>Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-8 text-center text-blueGray-400">
                    <i className="fas fa-graduation-cap text-2xl mb-2 block"></i>
                    Aucune formation trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-sm text-blueGray-400 border-t flex justify-between items-center">
          <span>
            {filteredFormations.length} résultat(s) sur {formations.length} formation(s)
          </span>
          <span className="text-xs">
            <i className="fas fa-circle mr-1 text-emerald-500"></i>API
          </span>
        </div>
      </div>

      {/* ═══════════════ MODAL AVEC BACKDROP (comme CardTable users) ═══════════════ */}
      {showModal && selectedFormation && (
        <>
          {/* Backdrop */}
          <div className="modal-backdrop" onClick={handleCancel}></div>

          {/* Modal */}
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">
              {isAdding ? "Ajouter Formation" : "Modifier Formation"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div>
                <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={selectedFormation.name || ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="border rounded px-3 py-2 w-full text-sm"
                />
              </div>

              {/* Prix */}
              <div>
                <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
                  Prix (DT)
                </label>
                <input
                  type="number"
                  min="0"
                  value={selectedFormation.price ?? 0}
                  onChange={(e) => handleFieldChange("price", Number(e.target.value) || 0)}
                  className="border rounded px-3 py-2 w-full text-sm"
                />
              </div>

              {/* Formateur */}
              <div>
                <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
                  Formateur *
                </label>
                <input
                  type="text"
                  value={selectedFormation.instructor || ""}
                  onChange={(e) => handleFieldChange("instructor", e.target.value)}
                  className="border rounded px-3 py-2 w-full text-sm"
                />
              </div>

              {/* Lieu */}
              <div>
                <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
                  Lieu
                </label>
                <input
                  type="text"
                  value={selectedFormation.location || ""}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  className="border rounded px-3 py-2 w-full text-sm"
                />
              </div>

              {/* Domaine (NEW) */}
              <div>
                <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
                  Domaine
                </label>
                <select
                  value={selectedFormation.domain || ""}
                  onChange={(e) => handleFieldChange("domain", e.target.value)}
                  className="border rounded px-3 py-2 w-full text-sm bg-white"
                >
                  <option value="">-- Choisir un domaine --</option>
                  {DOMAIN_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedFormation.date || ""}
                  onChange={(e) => handleFieldChange("date", e.target.value)}
                  className="border rounded px-3 py-2 w-full text-sm"
                />
              </div>

              {/* Heure */}
              <div>
                <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
                  Heure
                </label>
                <input
                  type="time"
                  value={selectedFormation.time || ""}
                  onChange={(e) => handleFieldChange("time", e.target.value)}
                  className="border rounded px-3 py-2 w-full text-sm"
                />
              </div>

              {/* Centre (NEW: select centres backend) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
                  Centre *
                </label>

                <select
                  value={selectedFormation.centre || ""}
                  onChange={(e) => handleFieldChange("centre", e.target.value)}
                  className="border rounded px-3 py-2 w-full text-sm bg-white"
                >
                  <option value="">-- Choisir un centre --</option>

                  {/* إذا backend رجّع centres */}
                  {centres.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* fallback صغيرة إذا ما ثماش centres */}
                {centres.length === 0 && (
                  <p className="text-xs text-blueGray-400 mt-1">
                    Aucun centre disponible (vérifie l'API / status=accepted).
                  </p>
                )}
              </div>

              {/* Status (edit only) */}
              {!isAdding && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
                    Statut
                  </label>
                  <select
                    value={selectedFormation.status || "pending"}
                    onChange={(e) => handleFieldChange("status", e.target.value)}
                    className="border rounded px-3 py-2 w-full text-sm"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="accepted">✅ Acceptée</option>
                    <option value="rejected">❌ Rejetée</option>
                  </select>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="bg-red-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                  </>
                ) : isAdding ? (
                  "Ajouter"
                ) : (
                  "Enregistrer"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

CardTableFormations.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};