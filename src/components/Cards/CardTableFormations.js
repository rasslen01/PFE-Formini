// ═══════════════════════════════════════════════
// 📁 src/components/Cards/CardTableFormations.js
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

// ─────────────────────────────────────────
// Template vide pour une nouvelle formation
// ─────────────────────────────────────────
const emptyFormation = {
  id: null,
  name: "",
  instructor: "",
  centre: "",
  location: "",
  price: 0,
  date: "",
  time: "",
  status: "pending",
};

export default function CardTableFormations({ color = "light" }) {
  // ─────────────────────────────────────────
  // États
  // ─────────────────────────────────────────
  const [formations, setFormations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useLocalMode, setUseLocalMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ─────────────────────────────────────────
  // Fake data fallback
  // ─────────────────────────────────────────
  const fakeFormations = [
    {
      _id: "1",
      name: "React Avancé",
      instructor: "Ali Ben Salah",
      centre: "Centre IT",
      location: "Tunis",
      price: 200,
      date: "2026-02-20",
      time: "10:00",
      status: "accepted",
    },
    {
      _id: "2",
      name: "UI/UX Design",
      instructor: "Sara Trabelsi",
      centre: "Design Lab",
      location: "Sfax",
      price: 0,
      date: "2026-03-05",
      time: "14:00",
      status: "pending",
    },
    {
      _id: "3",
      name: "Node.js Backend",
      instructor: "Mohamed Karray",
      centre: "Centre IT",
      location: "Sousse",
      price: 150,
      date: "2026-04-10",
      time: "09:00",
      status: "pending",
    },
    {
      _id: "4",
      name: "Python Data Science",
      instructor: "Fatma Bouaziz",
      centre: "Data Lab",
      location: "Tunis",
      price: 300,
      date: "2026-05-15",
      time: "11:00",
      status: "rejected",
    },
  ];

  // ─────────────────────────────────────────
  // Fetch formations
  // ─────────────────────────────────────────
  const fetchFormations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllFormations();
      setFormations(res.data);
      setUseLocalMode(false);
    } catch (err) {
      console.warn("⚠️ Backend non disponible, mode local activé");
      setUseLocalMode(true);
      const saved = localStorage.getItem("localFormations");
      if (saved) {
        setFormations(JSON.parse(saved));
      } else {
        setFormations(fakeFormations);
        localStorage.setItem("localFormations", JSON.stringify(fakeFormations));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
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
  // Save to local
  // ─────────────────────────────────────────
  const saveToLocal = (updatedFormations) => {
    setFormations(updatedFormations);
    localStorage.setItem("localFormations", JSON.stringify(updatedFormations));
  };

  // ─────────────────────────────────────────
  // Open Add Modal
  // ─────────────────────────────────────────
  const openAddModal = () => {
    setIsAdding(true);
    setSelectedFormation({ ...emptyFormation, _id: "" });
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Open Edit Modal
  // ─────────────────────────────────────────
  const openEditModal = (formation) => {
    setIsAdding(false);
    setSelectedFormation({ ...formation });
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
    // Validation
    if (!selectedFormation.name.trim()) {
      alert("Le nom de la formation est obligatoire.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (useLocalMode) {
        if (isAdding) {
          const newFormation = { ...selectedFormation, _id: Date.now().toString() };
          saveToLocal([...formations, newFormation]);
        } else {
          saveToLocal(
            formations.map((f) =>
              f._id === selectedFormation._id ? selectedFormation : f
            )
          );
        }
      } else {
        if (isAdding) {
          await addFormation(selectedFormation);
        } else {
          await updateFormation(selectedFormation._id, selectedFormation);
        }
        await fetchFormations();
      }
      setShowModal(false);
      setSelectedFormation(null);
      alert(isAdding ? "Formation ajoutée avec succès !" : "Formation mise à jour avec succès !");
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
      console.error("Save error:", err);
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
      if (useLocalMode) {
        saveToLocal(formations.filter((f) => f._id !== id));
      } else {
        await deleteFormation(id);
        await fetchFormations();
      }
      alert("Formation supprimée avec succès !");
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error("Delete error:", err);
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
      if (useLocalMode) {
        saveToLocal(
          formations.map((f) =>
            f._id === id ? { ...f, status: "accepted" } : f
          )
        );
      } else {
        await acceptFormation(id);
        await fetchFormations();
      }
      alert("Formation acceptée avec succès !");
    } catch (err) {
      setError("Erreur lors de l'acceptation");
      console.error("Accept error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Reject
  // ─────────────────────────────────────────
  const handleReject = async (id) => {
    if (!window.confirm("Rejeter cette formation ?")) return;
    setLoading(true);
    try {
      if (useLocalMode) {
        saveToLocal(
          formations.map((f) =>
            f._id === id ? { ...f, status: "rejected" } : f
          )
        );
      } else {
        await updateFormation(id, { status: "rejected" });
        await fetchFormations();
      }
      alert("Formation rejetée !");
    } catch (err) {
      setError("Erreur lors du rejet");
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
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "ALL" || f.status === statusFilter;
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

  const headers = [
    "Nom",
    "Formateur",
    "Centre",
    "Lieu",
    "Prix",
    "Date",
    "Heure",
    "Statut",
    "Actions",
  ];

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (isLight ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        {/* Mode local indicator */}
        {useLocalMode && (
          <div className="bg-amber-100 border-b border-amber-200 text-amber-700 px-4 py-2 text-xs flex justify-between items-center">
            <span>
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Mode local activé (backend non disponible)
            </span>
            <button
              onClick={fetchFormations}
              className="font-bold hover:text-amber-900"
            >
              <i className="fas fa-sync-alt mr-1"></i>Réessayer
            </button>
          </div>
        )}

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
            <h3
              className={`font-semibold text-lg ${
                isLight ? "text-blueGray-700" : "text-white"
              }`}
            >
              Gestion des Formations
              {useLocalMode && (
                <span className="ml-2 text-xs font-normal text-amber-500">
                  (local)
                </span>
              )}
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
                      {f.price === 0 ? (
                        <span className="text-emerald-500 font-semibold">
                          Gratuit
                        </span>
                      ) : (
                        `${f.price} DT`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{f.date}</td>
                    <td className="px-6 py-4 text-sm">{f.time}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyle(
                          f.status
                        )}`}
                      >
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
                  <td
                    colSpan={headers.length}
                    className="px-6 py-8 text-center text-blueGray-400"
                  >
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
            {filteredFormations.length} résultat(s) sur {formations.length}{" "}
            formation(s)
          </span>
          <span className="text-xs">
            <i
              className={`fas fa-circle mr-1 ${
                useLocalMode ? "text-amber-500" : "text-emerald-500"
              }`}
            ></i>
            {useLocalMode ? "Local" : "API"}
          </span>
        </div>
      </div>

      {/* ═══════════════ MODAL AVEC BACKDROP ═══════════════ */}
      {/* ═══════════════ MODAL FORMATIONS ═══════════════ */}
{showModal && selectedFormation && (
  <>
    <div 
      className="modal-backdrop" 
      onClick={() => setShowModal(false)}
    ></div>
    <div className="modal-container">
      <h3 className="text-xl font-semibold mb-4">
        {isAdding ? "Ajouter Formation" : "Modifier Formation"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Nom */}
        <div>
          <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
            Nom *
          </label>
          <input
            type="text"
            placeholder="Nom de la formation"
            value={selectedFormation.name}
            onChange={(e) =>
              setSelectedFormation({ ...selectedFormation, name: e.target.value })
            }
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
            placeholder="Prix"
            value={selectedFormation.price}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                price: parseFloat(e.target.value) || 0,
              })
            }
            className="border rounded px-3 py-2 w-full text-sm"
          />
        </div>

        {/* Formateur */}
        <div>
          <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
            Formateur
          </label>
          <input
            type="text"
            placeholder="Nom du formateur"
            value={selectedFormation.instructor}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                instructor: e.target.value,
              })
            }
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
            placeholder="Lieu de la formation"
            value={selectedFormation.location}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                location: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full text-sm"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
            Date
          </label>
          <input
            type="date"
            value={selectedFormation.date}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                date: e.target.value,
              })
            }
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
            value={selectedFormation.time}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                time: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full text-sm"
          />
        </div>

        {/* Centre */}
        <div className="col-span-2">
          <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
            Centre
          </label>
          <input
            type="text"
            placeholder="Nom du centre"
            value={selectedFormation.centre}
            onChange={(e) =>
              setSelectedFormation({
                ...selectedFormation,
                centre: e.target.value,
              })
            }
            className="border rounded px-3 py-2 w-full text-sm"
          />
        </div>

        {/* Status (uniquement en édition) */}
        {!isAdding && (
          <div className="col-span-2">
            <label className="block text-xs font-bold text-blueGray-500 uppercase mb-1">
              Statut
            </label>
            <select
              value={selectedFormation.status}
              onChange={(e) =>
                setSelectedFormation({
                  ...selectedFormation,
                  status: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full text-sm"
            >
              <option value="pending">⏳ Pending</option>
              <option value="accepted">✅ Acceptée</option>
              <option value="rejected">❌ Rejetée</option>
            </select>
          </div>
        )}
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowModal(false)}
          disabled={loading}
          className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
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