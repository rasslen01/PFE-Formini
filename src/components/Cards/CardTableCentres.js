// ═══════════════════════════════════════════════
// 📁 src/components/Cards/CardTableCentres.js
// ═══════════════════════════════════════════════

import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getAllCentres,
  addCentre as addCentreApi,
  updateCentre as updateCentreApi,
  deleteCentre as deleteCentreApi,
  acceptCentre as acceptCentreApi,
} from "Services/ApiCentre";

export default function CardTableCentres({ color }) {
  const [centres, setCentres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("edit");
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useLocalMode, setUseLocalMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Fake data fallback
  const fakeCentres = [
    { _id: "1", name: "Centre IT", email: "it@centre.com", status: "pending", logo: "https://via.placeholder.com/80" },
    { _id: "2", name: "Centre Design", email: "design@centre.com", status: "accepted", logo: "https://via.placeholder.com/80" },
    { _id: "3", name: "Centre Marketing", email: "marketing@centre.com", status: "pending", logo: "https://via.placeholder.com/80" },
    { _id: "4", name: "Centre Data", email: "data@centre.com", status: "rejected", logo: "https://via.placeholder.com/80" },
  ];

  // ─────────────────────────────────────────
  // Helper: normalize backend response
  // ─────────────────────────────────────────
  const extractCentresArray = (data) => {
    // backend might return:
    // 1) { centresList: [...] }
    // 2) { centres: [...] }
    // 3) [...] (array directly)
    if (Array.isArray(data)) return data;
    if (data?.centresList && Array.isArray(data.centresList)) return data.centresList;
    if (data?.centres && Array.isArray(data.centres)) return data.centres;
    return [];
  };

  // ─────────────────────────────────────────
  // Save to local
  // ─────────────────────────────────────────
  const saveToLocal = (updatedCentres) => {
    setCentres(updatedCentres);
    localStorage.setItem("localCentres", JSON.stringify(updatedCentres));
  };

  // ─────────────────────────────────────────
  // Fetch centres (API or Local)
  // ─────────────────────────────────────────
  const fetchCentres = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getAllCentres();
      const centresArray = extractCentresArray(res.data);

      setCentres(centresArray);
      setUseLocalMode(false);
    } catch (err) {
      console.warn("⚠️ Centres: Backend non disponible, mode local activé", err?.response?.status);

      setUseLocalMode(true);

      const saved = localStorage.getItem("localCentres");
      if (saved) {
        setCentres(JSON.parse(saved));
      } else {
        setCentres(fakeCentres);
        localStorage.setItem("localCentres", JSON.stringify(fakeCentres));
      }
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchCentres();
  }, [fetchCentres]);

  // ─────────────────────────────────────────
  // Open Add Modal
  // ─────────────────────────────────────────
  const openAddModal = () => {
    setModalType("add");
    setSelectedCentre({
      _id: "",
      name: "",
      email: "",
      logo: "https://via.placeholder.com/80",
      status: "pending",
    });
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Open Edit Modal
  // ─────────────────────────────────────────
  const openEditModal = (centre) => {
    setModalType("edit");
    setSelectedCentre({ ...centre });
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Save (Add or Edit)
  // ─────────────────────────────────────────
  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      if (useLocalMode) {
        if (modalType === "add") {
          const newCentre = { ...selectedCentre, _id: Date.now().toString() };
          saveToLocal([...centres, newCentre]);
        } else {
          saveToLocal(
            centres.map((c) => (c._id === selectedCentre._id ? selectedCentre : c))
          );
        }
      } else {
        if (modalType === "add") {
          await addCentreApi(selectedCentre);
        } else {
          await updateCentreApi(selectedCentre._id, selectedCentre);
        }
        await fetchCentres();
      }

      setShowModal(false);
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
      console.error("Save error:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Delete
  // ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce centre ?")) return;

    setLoading(true);
    setError("");

    try {
      if (useLocalMode) {
        saveToLocal(centres.filter((c) => c._id !== id));
      } else {
        await deleteCentreApi(id);
        await fetchCentres();
      }
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error("Delete error:", err?.response?.data || err.message);
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
          centres.map((c) => (c._id === id ? { ...c, status: "accepted" } : c))
        );
      } else {
        await acceptCentreApi(id);
        await fetchCentres();
      }
    } catch (err) {
      setError("Erreur lors de l'acceptation");
      console.error("Accept error:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Reject
  // ─────────────────────────────────────────
  const handleReject = async (id) => {
    if (!window.confirm("Rejeter ce centre ?")) return;

    setLoading(true);
    setError("");

    try {
      if (useLocalMode) {
        saveToLocal(
          centres.map((c) => (c._id === id ? { ...c, status: "rejected" } : c))
        );
      } else {
        await updateCentreApi(id, { status: "rejected" });
        await fetchCentres();
      }
    } catch (err) {
      setError("Erreur lors du rejet");
      console.error("Reject error:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Filter
  // ─────────────────────────────────────────
  const filteredCentres = centres.filter((c) => {
    const name = (c?.name || "").toLowerCase();
    const email = (c?.email || "").toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchSearch = name.includes(q) || email.includes(q);

    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
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

  // Counts
  const pendingCount = centres.filter((c) => c.status === "pending").length;
  const acceptedCount = centres.filter((c) => c.status === "accepted").length;
  const rejectedCount = centres.filter((c) => c.status === "rejected").length;

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        {/* Mode local indicator */}
        {useLocalMode && (
          <div className="bg-amber-100 border-b border-amber-200 text-amber-700 px-4 py-2 text-xs flex justify-between items-center">
            <span>
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Mode local activé (backend non disponible)
            </span>
            <button onClick={fetchCentres} className="font-bold hover:text-amber-900">
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
            Total: {centres.length}
          </span>
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold">
            <i className="fas fa-clock mr-1"></i>Pending: {pendingCount}
          </span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">
            <i className="fas fa-check mr-1"></i>Acceptés: {acceptedCount}
          </span>
          <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
            <i className="fas fa-times mr-1"></i>Rejetés: {rejectedCount}
          </span>
        </div>

        {/* Header */}
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3
              className={`font-semibold text-lg ${
                color === "light" ? "text-blueGray-700" : "text-white"
              }`}
            >
              Gestion des Centres
              {useLocalMode && (
                <span className="ml-2 text-xs font-normal text-amber-500">(local)</span>
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
                <option value="accepted">✅ Accepté</option>
                <option value="rejected">❌ Rejeté</option>
              </select>

              {/* Add button */}
              <button
                onClick={openAddModal}
                className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-600"
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
                {["Logo", "Nom", "Email", "Statut", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-3 text-xs uppercase font-semibold text-left border-b ${
                      color === "light"
                        ? "bg-blueGray-50 text-blueGray-500"
                        : "bg-lightBlue-800 text-lightBlue-300"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCentres.length > 0 ? (
                filteredCentres.map((centre) => (
                  <tr key={centre._id} className="hover:bg-blueGray-50 border-b">
                    <td className="px-6 py-4">
                      <img
                        src={centre.logo || "https://via.placeholder.com/80"}
                        alt="logo"
                        className="h-10 w-10 rounded-full border"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">{centre.name}</td>
                    <td className="px-6 py-4 text-sm">{centre.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyle(
                          centre.status
                        )}`}
                      >
                        {centre.status === "pending" && "⏳ "}
                        {centre.status === "accepted" && "✅ "}
                        {centre.status === "rejected" && "❌ "}
                        {centre.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {centre.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAccept(centre._id)}
                              disabled={loading}
                              className="bg-emerald-500 text-white font-bold uppercase text-xs px-3 py-1 rounded shadow hover:shadow-lg transition-all"
                            >
                              <i className="fas fa-check mr-1"></i>Accepter
                            </button>
                            <button
                              onClick={() => handleReject(centre._id)}
                              disabled={loading}
                              className="bg-orange-500 text-white font-bold uppercase text-xs px-3 py-1 rounded shadow hover:shadow-lg transition-all"
                            >
                              <i className="fas fa-times mr-1"></i>Rejeter
                            </button>
                          </>
                        )}

                        {centre.status === "rejected" && (
                          <button
                            onClick={() => handleAccept(centre._id)}
                            disabled={loading}
                            className="bg-emerald-100 text-emerald-700 font-bold uppercase text-xs px-3 py-1 rounded hover:bg-emerald-200 transition-all"
                          >
                            <i className="fas fa-undo mr-1"></i>Accepter
                          </button>
                        )}

                        <button
                          onClick={() => openEditModal(centre)}
                          disabled={loading}
                          className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-3 py-1 rounded shadow hover:shadow-lg transition-all"
                        >
                          <i className="fas fa-edit mr-1"></i>Modifier
                        </button>

                        <button
                          onClick={() => handleDelete(centre._id)}
                          disabled={loading}
                          className="bg-red-500 text-white font-bold uppercase text-xs px-3 py-1 rounded shadow hover:shadow-lg transition-all"
                        >
                          <i className="fas fa-trash mr-1"></i>Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-blueGray-400">
                    <i className="fas fa-building text-2xl mb-2 block"></i>
                    Aucun centre trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-sm text-blueGray-400 border-t flex justify-between items-center">
          <span>
            {filteredCentres.length} résultat(s) sur {centres.length} centre(s)
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

      {/* Modal Add/Edit */}
      {showModal && selectedCentre && (
        <>
          <div className="modal-backdrop"></div>
          <div className="modal-container">
            <h3 className="text-xl font-semibold mb-4">
              {modalType === "add" ? "Ajouter Centre" : "Modifier Centre"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Logo URL */}
              <div className="col-span-2">
                <label className="block text-xs font-bold mb-1">URL du logo</label>
                <input
                  type="text"
                  value={selectedCentre.logo}
                  onChange={(e) =>
                    setSelectedCentre({ ...selectedCentre, logo: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-sm"
                />
                <img
                  src={selectedCentre.logo || "https://via.placeholder.com/80"}
                  alt="preview"
                  className="h-16 w-16 rounded-full border mt-2"
                />
              </div>

              {/* Nom */}
              <input
                type="text"
                placeholder="Nom du centre"
                value={selectedCentre.name}
                onChange={(e) =>
                  setSelectedCentre({ ...selectedCentre, name: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={selectedCentre.email}
                onChange={(e) =>
                  setSelectedCentre({ ...selectedCentre, email: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />

              {/* Status */}
              <select
                value={selectedCentre.status}
                onChange={(e) =>
                  setSelectedCentre({ ...selectedCentre, status: e.target.value })
                }
                className="border rounded px-3 py-2 w-full col-span-2"
              >
                <option value="pending">⏳ Pending</option>
                <option value="accepted">✅ Accepté</option>
                <option value="rejected">❌ Rejeté</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                  </>
                ) : modalType === "add" ? (
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

CardTableCentres.defaultProps = { color: "light" };
CardTableCentres.propTypes = { color: PropTypes.oneOf(["light", "dark"]) };