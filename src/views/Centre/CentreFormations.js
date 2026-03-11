// ═══════════════════════════════════════════════
// 📁 src/views/Centre/CentreFormations.js
// ═══════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import {
  getFormationsByCentre,
  addFormation,
  updateFormation,
  deleteFormation,
} from "Services/ApiFormation";

export default function CentreFormations() {
  const [formations, setFormations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedFormation, setSelectedFormation] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [centreName, setCentreName] = useState("");

  const emptyFormation = {
    _id: "",
    name: "",
    price: "",
    instructor: "",
    location: "",
    date: "",
    time: "",
    centre: "",
    domain: "",
    status: "pending",
  };

  // ─────────────────────────────────────────
  // Charger centre connecté + formations
  // ─────────────────────────────────────────
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const connectedCentre =
      user?.centreName ||
      user?.centerName ||
      user?.centre ||
      user?.name ||
      "";

    setCentreName(connectedCentre);

    if (connectedCentre) {
      fetchFormations(connectedCentre);
    } else {
      setError("Centre connecté introuvable.");
    }
  }, []);

  // ─────────────────────────────────────────
  // Bloquer le scroll quand modal ouverte
  // ─────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // ─────────────────────────────────────────
  // Fetch formations du centre connecté
  // ─────────────────────────────────────────
  const fetchFormations = async (currentCentre = centreName) => {
    if (!currentCentre) return;

    setLoading(true);
    setError("");

    try {
      const res = await getFormationsByCentre(currentCentre);
      setFormations(res.data?.formationsList || []);
    } catch (err) {
      console.error("❌ fetchFormations error:", err);
      setError(err.response?.data?.error || "Erreur lors du chargement des formations.");
      setFormations([]);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Open Add Modal
  // ─────────────────────────────────────────
  const openAddModal = () => {
    setModalType("add");
    setSelectedFormation({
      ...emptyFormation,
      centre: centreName,
    });
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Open Edit Modal
  // ─────────────────────────────────────────
  const openEditModal = (formation) => {
    setModalType("edit");

    const safeDate = formation.date
      ? new Date(formation.date).toISOString().slice(0, 10)
      : "";

    setSelectedFormation({
      ...formation,
      date: safeDate,
      centre: formation.centre || centreName,
      domain: formation.domain || "",
      time: formation.time || "",
      price: formation.price ?? "",
    });

    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Fermer modal
  // ─────────────────────────────────────────
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFormation(null);
  };

  // ─────────────────────────────────────────
  // Save
  // ─────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedFormation?.name?.trim()) {
      alert("Le nom de la formation est obligatoire.");
      return;
    }

    if (!selectedFormation?.instructor?.trim()) {
      alert("Le formateur est obligatoire.");
      return;
    }

    if (!selectedFormation?.location?.trim()) {
      alert("La localisation est obligatoire.");
      return;
    }

    if (!centreName) {
      alert("Centre connecté introuvable.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: selectedFormation.name,
        instructor: selectedFormation.instructor,
        centre: centreName,
        location: selectedFormation.location,
        price: Number(selectedFormation.price) || 0,
        date: selectedFormation.date || null,
        time: selectedFormation.time || "",
        domain: selectedFormation.domain || "",
        status: selectedFormation.status || "pending",
      };

      if (modalType === "add") {
        await addFormation(payload);
      } else {
        await updateFormation(selectedFormation._id, payload);
      }

      handleCloseModal();
      await fetchFormations();
      alert(
        modalType === "add"
          ? "✅ Formation ajoutée avec succès !"
          : "✅ Formation mise à jour avec succès !"
      );
    } catch (err) {
      console.error("❌ save error:", err);
      setError(err.response?.data?.error || "Erreur lors de la sauvegarde.");
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
      alert("✅ Formation supprimée avec succès !");
    } catch (err) {
      console.error("❌ delete error:", err);
      setError(err.response?.data?.error || "Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Filter
  // ─────────────────────────────────────────
  const filteredFormations = formations.filter((f) => {
    const matchSearch = (f.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchStatus =
      filterStatus === "ALL" || (f.status || "").toLowerCase() === filterStatus.toLowerCase();

    return matchSearch && matchStatus;
  });

  // ─────────────────────────────────────────
  // Style status
  // ─────────────────────────────────────────
  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "accepted":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blueGray-100 text-blueGray-500";
    }
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="px-6 py-4">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <div>
              <h3 className="font-bold text-xl text-blueGray-700">
                <i className="fas fa-book text-lightBlue-500 mr-2"></i>
                Formations du centre
              </h3>
              {centreName && (
                <p className="text-sm text-blueGray-400 mt-1">
                  Centre connecté : <span className="font-semibold">{centreName}</span>
                </p>
              )}
            </div>

            <button
              onClick={openAddModal}
              disabled={loading || !centreName}
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all shadow hover:shadow-lg disabled:opacity-50"
            >
              <i className="fas fa-plus mr-2"></i>
              Ajouter Formation
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm flex justify-between items-center">
              <span>
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </span>
              <button onClick={() => setError("")}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Rechercher formations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded px-3 py-2 pl-9 w-56 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="pending">Pending</option>
              <option value="accepted">Acceptée</option>
              <option value="rejected">Rejetée</option>
            </select>

            <button
              onClick={() => fetchFormations()}
              disabled={loading}
              className="bg-blueGray-100 text-blueGray-700 px-3 py-2 rounded text-sm font-bold hover:bg-blueGray-200 disabled:opacity-50"
            >
              <i className="fas fa-sync-alt mr-1"></i>
              Rafraîchir
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-lg shadow px-6 py-4 text-center text-lightBlue-500 text-sm mb-4">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Chargement...
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Nom", "Prix", "Formateur", "Lieu", "Date", "Domaine", "Statut", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase font-bold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredFormations.map((formation) => (
                <tr key={formation._id} className="hover:bg-blueGray-50 border-b">
                  <td className="px-6 py-4 font-semibold text-sm">{formation.name}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                    {Number(formation.price) === 0 ? "Gratuit" : `${formation.price} DT`}
                  </td>
                  <td className="px-6 py-4 text-sm">{formation.instructor}</td>
                  <td className="px-6 py-4 text-sm">{formation.location}</td>
                  <td className="px-6 py-4 text-sm">
                    {formation.date ? new Date(formation.date).toISOString().slice(0, 10) : ""}
                  </td>
                  <td className="px-6 py-4 text-sm">{formation.domain || "-"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusClass(
                        formation.status
                      )}`}
                    >
                      {formation.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(formation)}
                      disabled={loading}
                      className="bg-lightBlue-500 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(formation._id)}
                      disabled={loading}
                      className="bg-red-500 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}

              {filteredFormations.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-blueGray-400">
                    <i className="fas fa-book-open text-3xl mb-3 block"></i>
                    Aucune formation trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t text-sm text-blueGray-400">
          {filteredFormations.length} formation(s) trouvée(s)
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedFormation && (
        <>
          <div className="modal-backdrop" onClick={handleCloseModal}></div>

          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">
              {modalType === "add" ? "Ajouter Formation" : "Modifier Formation"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom de formation"
                value={selectedFormation.name || ""}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    name: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              <input
                type="number"
                placeholder="Prix"
                min="0"
                value={selectedFormation.price}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    price: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              <input
                type="text"
                placeholder="Formateur"
                value={selectedFormation.instructor || ""}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    instructor: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              <input
                type="text"
                placeholder="Localisation"
                value={selectedFormation.location || ""}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    location: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              <input
                type="date"
                value={selectedFormation.date || ""}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    date: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              <input
                type="time"
                value={selectedFormation.time || ""}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    time: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              <input
                type="text"
                value={centreName}
                disabled
                className="border rounded px-3 py-2 w-full bg-blueGray-100 text-blueGray-500 cursor-not-allowed"
              />

              <select
                value={selectedFormation.domain || ""}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    domain: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">-- Domaine --</option>
                <option value="informatique">Informatique</option>
                <option value="web">Développement Web</option>
                <option value="mobile">Mobile</option>
                <option value="data">Data Science</option>
                <option value="ia">Intelligence Artificielle</option>
                <option value="reseaux">Réseaux</option>
                <option value="marketing">Marketing</option>
                <option value="gestion">Gestion</option>
                <option value="finance">Finance</option>
                <option value="langues">Langues</option>
                <option value="sante">Santé</option>
                <option value="tourisme">Tourisme</option>
              </select>

              <select
                value={selectedFormation.status || "pending"}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    status: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full md:col-span-2"
              >
                <option value="pending">⏳ Pending</option>
                <option value="accepted">✅ Acceptée</option>
                <option value="rejected">❌ Rejetée</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all"
              >
                Annuler
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all disabled:opacity-50"
              >
                {modalType === "add" ? "Ajouter" : "Enregistrer"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}