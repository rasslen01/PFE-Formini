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

const BACKEND_URL = "http://localhost:5000";

const isValidImage = (img) =>
  img && img !== "" && img !== "default-formation.png";

export default function CentreFormations() {
  const [formations, setFormations]               = useState([]);
  const [showModal, setShowModal]                 = useState(false);
  const [modalType, setModalType]                 = useState("add");
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [searchQuery, setSearchQuery]             = useState("");
  const [filterStatus, setFilterStatus]           = useState("ALL");
  const [loading, setLoading]                     = useState(false);
  const [error, setError]                         = useState("");
  const [centreName, setCentreName]               = useState("");

  // États image
  const [imageFile, setImageFile]           = useState(null);
  const [imagePreview, setImagePreview]     = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const emptyFormation = {
    _id: "", name: "", price: "", instructor: "", location: "",
    date: "", time: "", centre: "", domain: "", status: "pending", image: "",
  };

  // ─────────────────────────────────────────
  // Helper URL image
  // ─────────────────────────────────────────
  const buildImageUrl = (imagePath) => {
    if (!isValidImage(imagePath)) return null;
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

  // ─────────────────────────────────────────
  // Load centre + formations
  // ─────────────────────────────────────────
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const connectedCentre =
      user?.centreName || user?.centerName || user?.centre || user?.name || "";
    setCentreName(connectedCentre);
    if (connectedCentre) fetchFormations(connectedCentre);
    else setError("Centre connecté introuvable.");
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showModal]);

  // ─────────────────────────────────────────
  // Fetch formations
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
    setSelectedFormation({ ...emptyFormation, centre: centreName });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Open Edit Modal
  // ─────────────────────────────────────────
  const openEditModal = (formation) => {
    setModalType("edit");
    const safeDate = formation.date
      ? new Date(formation.date).toISOString().slice(0, 10) : "";
    setSelectedFormation({
      ...formation,
      date:   safeDate,
      centre: formation.centre || centreName,
      domain: formation.domain || "",
      time:   formation.time   || "",
      price:  formation.price  ?? "",
      image:  formation.image  || "",
    });
    setImageFile(null);
    setImagePreview(isValidImage(formation.image) ? buildImageUrl(formation.image) || "" : "");
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Close Modal
  // ─────────────────────────────────────────
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFormation(null);
    setImageFile(null);
    setImagePreview("");
  };

  // ─────────────────────────────────────────
  // Handle Image Change
  // ─────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Image trop lourde. Maximum 5MB.");
      return;
    }
    const allowed = /jpeg|jpg|png|webp|gif/i;
    if (!allowed.test(file.name.split(".").pop())) {
      alert("❌ Format non supporté. Utilisez JPG, PNG, WEBP ou GIF.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setSelectedFormation((prev) => ({ ...prev, image: "" }));
    const input = document.getElementById("centre-formation-image");
    if (input) input.value = "";
  };

  // ─────────────────────────────────────────
  // Save
  // ─────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedFormation?.name?.trim())       { alert("Le nom est obligatoire.");          return; }
    if (!selectedFormation?.instructor?.trim()) { alert("Le formateur est obligatoire.");    return; }
    if (!selectedFormation?.location?.trim())   { alert("La localisation est obligatoire."); return; }
    if (!centreName)                            { alert("Centre connecté introuvable.");     return; }

    setLoading(true);
    setError("");

    try {
      let imageUrl = selectedFormation.image || "";

      // ── Upload image si nouveau fichier ──
      if (imageFile) {
        setImageUploading(true);
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await fetch(`${BACKEND_URL}/formations/uploadFormationImage`, {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        setImageUploading(false);

        if (!uploadRes.ok) throw new Error(uploadData.error || "Erreur upload image");
        imageUrl = uploadData.imageUrl;
        console.log("✅ image uploadée:", imageUrl);
      }

      const payload = {
        name:       selectedFormation.name,
        instructor: selectedFormation.instructor,
        centre:     centreName,
        location:   selectedFormation.location,
        price:      Number(selectedFormation.price) || 0,
        date:       selectedFormation.date || null,
        time:       selectedFormation.time || "",
        domain:     selectedFormation.domain || "",
        status:     selectedFormation.status || "pending",
        image:      imageUrl,   // ✅ image synchronisée
        centreLogo: "",
      };

      if (modalType === "add") {
        await addFormation(payload);
      } else {
        await updateFormation(selectedFormation._id, payload);
      }

      handleCloseModal();
      await fetchFormations();
      alert(modalType === "add" ? "✅ Formation ajoutée !" : "✅ Formation mise à jour !");
    } catch (err) {
      console.error("❌ save error:", err);
      setImageUploading(false);
      setError(err.response?.data?.error || err.message || "Erreur lors de la sauvegarde.");
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
      setError(err.response?.data?.error || "Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Filter
  // ─────────────────────────────────────────
  const filteredFormations = formations.filter((f) => {
    const matchSearch = (f.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "ALL" || (f.status || "").toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "accepted": return "bg-emerald-100 text-emerald-700";
      case "pending":  return "bg-amber-100 text-amber-700";
      case "rejected": return "bg-red-100 text-red-700";
      default:         return "bg-blueGray-100 text-blueGray-500";
    }
  };

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
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
            <button onClick={openAddModal} disabled={loading || !centreName}
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all shadow hover:shadow-lg disabled:opacity-50">
              <i className="fas fa-plus mr-2"></i>Ajouter Formation
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm flex justify-between items-center">
              <span><i className="fas fa-exclamation-circle mr-2"></i>{error}</span>
              <button onClick={() => setError("")}><i className="fas fa-times"></i></button>
            </div>
          )}

          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                <i className="fas fa-search"></i>
              </span>
              <input type="text" placeholder="Rechercher formations..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded px-3 py-2 pl-9 w-56 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border px-3 py-2 rounded text-sm">
              <option value="ALL">Tous les statuts</option>
              <option value="pending">Pending</option>
              <option value="accepted">Acceptée</option>
              <option value="rejected">Rejetée</option>
            </select>
            <button onClick={() => fetchFormations()} disabled={loading}
              className="bg-blueGray-100 text-blueGray-700 px-3 py-2 rounded text-sm font-bold hover:bg-blueGray-200 disabled:opacity-50">
              <i className="fas fa-sync-alt mr-1"></i>Rafraîchir
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow px-6 py-4 text-center text-lightBlue-500 text-sm mb-4">
          <i className="fas fa-spinner fa-spin mr-2"></i>Chargement...
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Image", "Nom", "Prix", "Formateur", "Lieu", "Date", "Domaine", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFormations.map((formation) => (
                <tr key={formation._id} className="hover:bg-blueGray-50 border-b">
                  {/* ── Miniature image ── */}
                  <td className="px-4 py-3">
                    {isValidImage(formation.image) ? (
                      <img
                        src={buildImageUrl(formation.image)}
                        alt={formation.name}
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling && (e.target.nextSibling.style.display = "flex"); }}
                        style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }}
                      />
                    ) : null}
                    <div style={{
                      width: 44, height: 44, borderRadius: 8, backgroundColor: "#f1f5f9",
                      display: isValidImage(formation.image) ? "none" : "flex",
                      alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 16,
                    }}>
                      <i className="fas fa-image"></i>
                    </div>
                  </td>

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
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusClass(formation.status)}`}>
                      {formation.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(formation)} disabled={loading}
                        className="bg-lightBlue-500 text-white font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-lg transition-all disabled:opacity-50">
                        <i className="fas fa-edit mr-1"></i>Modifier
                      </button>
                      <button onClick={() => handleDelete(formation._id)} disabled={loading}
                        className="bg-red-500 text-white font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-lg transition-all disabled:opacity-50">
                        <i className="fas fa-trash mr-1"></i>Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredFormations.length === 0 && !loading && (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-blueGray-400">
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

      {/* ═══════════════ MODAL ═══════════════ */}
      {showModal && selectedFormation && (
        <>
          <div className="modal-backdrop" onClick={handleCloseModal}></div>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">
              {modalType === "add" ? "➕ Ajouter Formation" : "✏️ Modifier Formation"}
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <input type="text" placeholder="Nom de formation"
                value={selectedFormation.name || ""}
                onChange={(e) => setSelectedFormation({ ...selectedFormation, name: e.target.value })}
                className="border rounded px-3 py-2 w-full" />

              <input type="number" placeholder="Prix" min="0"
                value={selectedFormation.price}
                onChange={(e) => setSelectedFormation({ ...selectedFormation, price: e.target.value })}
                className="border rounded px-3 py-2 w-full" />

              <input type="text" placeholder="Formateur"
                value={selectedFormation.instructor || ""}
                onChange={(e) => setSelectedFormation({ ...selectedFormation, instructor: e.target.value })}
                className="border rounded px-3 py-2 w-full" />

              <input type="text" placeholder="Localisation"
                value={selectedFormation.location || ""}
                onChange={(e) => setSelectedFormation({ ...selectedFormation, location: e.target.value })}
                className="border rounded px-3 py-2 w-full" />

              <input type="date" value={selectedFormation.date || ""}
                onChange={(e) => setSelectedFormation({ ...selectedFormation, date: e.target.value })}
                className="border rounded px-3 py-2 w-full" />

              <input type="time" value={selectedFormation.time || ""}
                onChange={(e) => setSelectedFormation({ ...selectedFormation, time: e.target.value })}
                className="border rounded px-3 py-2 w-full" />

              <input type="text" value={centreName} disabled
                className="border rounded px-3 py-2 w-full bg-blueGray-100 text-blueGray-500 cursor-not-allowed" />

              <select value={selectedFormation.domain || ""}
                onChange={(e) => setSelectedFormation({ ...selectedFormation, domain: e.target.value })}
                className="border rounded px-3 py-2 w-full">
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

              <select value={selectedFormation.status || "pending"}
                onChange={(e) => setSelectedFormation({ ...selectedFormation, status: e.target.value })}
                className="border rounded px-3 py-2 w-full col-span-2">
                <option value="pending">⏳ Pending</option>
                <option value="accepted">✅ Acceptée</option>
                <option value="rejected">❌ Rejetée</option>
              </select>

              {/* ══════════════════════════════════════
                  ── IMAGE DE LA FORMATION ──
              ══════════════════════════════════════ */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-blueGray-500 uppercase mb-2">
                  <i className="fas fa-image mr-1"></i>
                  Image de la formation
                  <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 400, textTransform: "none", marginLeft: 8 }}>
                    (synchronisée avec Landing & Détails)
                  </span>
                </label>

                <div style={{ border: "2px dashed #cbd5e1", borderRadius: 12, padding: 16, backgroundColor: "#f8fafc" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>

                    {/* Preview */}
                    <div style={{ flexShrink: 0 }}>
                      {imagePreview ? (
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <img src={imagePreview} alt="preview"
                            onError={(e) => { e.target.style.display = "none"; }}
                            style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 8, border: "2px solid #e2e8f0", display: "block" }} />
                          <button type="button" onClick={handleRemoveImage}
                            style={{ position: "absolute", top: -8, right: -8, width: 20, height: 20, borderRadius: "50%", backgroundColor: "#ef4444", color: "white", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
                            title="Supprimer l'image">
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <div style={{ width: 90, height: 90, borderRadius: 8, border: "2px dashed #cbd5e1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", backgroundColor: "#f1f5f9", gap: 4 }}>
                          <i className="fas fa-image" style={{ fontSize: 24 }}></i>
                          <span style={{ fontSize: 9 }}>Aucune image</span>
                        </div>
                      )}
                    </div>

                    {/* Zone bouton */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>
                        Choisissez une image — JPG, PNG, WEBP, GIF — Max 5MB<br />
                        <span style={{ color: "#0ea5e9", fontWeight: 600 }}>
                          ✅ Elle s'affichera sur Landing, Détails et Favoris automatiquement.
                        </span>
                      </p>

                      <input type="file" accept="image/*" id="centre-formation-image"
                        style={{ display: "none" }} onChange={handleImageChange} />

                      <label htmlFor="centre-formation-image"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", backgroundColor: "#0ea5e9", color: "white", fontSize: 11, fontWeight: "bold", textTransform: "uppercase", padding: "7px 14px", borderRadius: 6 }}>
                        <i className="fas fa-upload"></i>
                        {imageFile ? "Changer l'image" : "Choisir une image"}
                      </label>

                      {imageFile && (
                        <div style={{ marginTop: 8, padding: "5px 10px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
                          <i className="fas fa-check-circle" style={{ color: "#22c55e", fontSize: 11 }}></i>
                          <span style={{ fontSize: 10, color: "#16a34a" }}>
                            {imageFile.name} — {(imageFile.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      )}

                      {!imageFile && isValidImage(selectedFormation?.image) && (
                        <div style={{ marginTop: 8, padding: "5px 10px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
                          <i className="fas fa-info-circle" style={{ color: "#3b82f6", fontSize: 11 }}></i>
                          <span style={{ fontSize: 10, color: "#1d4ed8" }}>Image actuelle conservée. Choisissez un fichier pour la remplacer.</span>
                        </div>
                      )}

                      {imageUploading && (
                        <div style={{ marginTop: 8, fontSize: 11, color: "#0ea5e9" }}>
                          <i className="fas fa-spinner fa-spin mr-1"></i>Upload en cours...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* ══════════════════════════════════════ */}

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleCloseModal}
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all">
                <i className="fas fa-times mr-2"></i>Annuler
              </button>
              <button onClick={handleSave} disabled={loading || imageUploading}
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all disabled:opacity-50">
                {loading
                  ? <><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>
                  : modalType === "add"
                    ? <><i className="fas fa-plus mr-2"></i>Ajouter</>
                    : <><i className="fas fa-save mr-2"></i>Enregistrer</>
                }
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}