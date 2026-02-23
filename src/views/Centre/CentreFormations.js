// ═══════════════════════════════════════════════
// 📁 src/views/Centre/CentreFormations.js
// ═══════════════════════════════════════════════

import React, { useState } from "react";

export default function CentreFormations() {
  const [formations, setFormations] = useState([
    { _id: "1", name: "React Advanced", price: 80, instructor: "Ahmed Ali", location: "Tunis", date: "2025-02-01", time: "09:00", center: "TechCentre", category: "Web Development", status: "Active" },
    { _id: "2", name: "Node.js API", price: 60, instructor: "Sara Ben", location: "Sfax", date: "2025-01-15", time: "14:00", center: "TechCentre", category: "Backend", status: "Active" },
    { _id: "3", name: "Python ML", price: 90, instructor: "Mohamed K", location: "Sousse", date: "2025-03-01", time: "10:00", center: "TechCentre", category: "Data Science", status: "Active" },
    { _id: "4", name: "JavaScript Basics", price: 40, instructor: "Fatima Z", location: "Tunis", date: "2025-04-01", time: "08:00", center: "TechCentre", category: "Web Development", status: "Draft" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const emptyFormation = {
    _id: "",
    name: "",
    price: "",
    instructor: "",
    location: "",
    date: "",
    time: "",
    center: "",
    category: "",
    status: "Draft",
  };

  // ─────────────────────────────────────────
  // Open Add Modal
  // ─────────────────────────────────────────
  const openAddModal = () => {
    setModalType("add");
    setSelectedFormation({ ...emptyFormation });
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Open Edit Modal
  // ─────────────────────────────────────────
  const openEditModal = (formation) => {
    setModalType("edit");
    setSelectedFormation({ ...formation });
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Save (Add or Edit)
  // ─────────────────────────────────────────
  const handleSave = () => {
    if (modalType === "add") {
      const newFormation = {
        ...selectedFormation,
        _id: Date.now().toString(),
      };
      setFormations([...formations, newFormation]);
    } else {
      setFormations(
        formations.map((f) =>
          f._id === selectedFormation._id ? selectedFormation : f
        )
      );
    }
    setShowModal(false);
    setSelectedFormation(null);
  };

  // ─────────────────────────────────────────
  // Delete
  // ─────────────────────────────────────────
  const handleDelete = (id) => {
    if (window.confirm("Delete this formation?")) {
      setFormations(formations.filter((f) => f._id !== id));
    }
  };

  // ─────────────────────────────────────────
  // Filter
  // ─────────────────────────────────────────
  const filteredFormations = formations.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "ALL" || f.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="pb-8">

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-blueGray-700">
              <i className="fas fa-book text-lightBlue-500 mr-2"></i>
              Formations Management
            </h3>

            {/* ══════════════════════════════
                BOUTON ADD FORMATION
               ══════════════════════════════ */}
            <button
              onClick={openAddModal}
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all shadow hover:shadow-lg"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Formation
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search formations..."
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
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Name", "Price", "Instructor", "Location", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFormations.map((formation) => (
                <tr key={formation._id} className="hover:bg-blueGray-50 border-b">
                  <td className="px-6 py-4 font-semibold text-sm">{formation.name}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formation.price}€</td>
                  <td className="px-6 py-4 text-sm">{formation.instructor}</td>
                  <td className="px-6 py-4 text-sm">{formation.location}</td>
                  <td className="px-6 py-4 text-sm">{formation.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      formation.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blueGray-100 text-blueGray-500"
                    }`}>
                      {formation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(formation)}
                      className="bg-lightBlue-500 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg transition-all"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(formation._id)}
                      className="bg-red-500 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg transition-all"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}

              {filteredFormations.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-blueGray-400">
                    <i className="fas fa-book-open text-3xl mb-3 block"></i>
                    No formations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t text-sm text-blueGray-400">
          {filteredFormations.length} formation(s) found
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MODAL ADD / EDIT (même style que votre code)
         ══════════════════════════════════════════════════ */}
      {showModal && selectedFormation && (
        <>
          <div className="modal-backdrop"></div>
          <div className="modal-container">
            <h3 className="text-xl font-semibold mb-4">
              {modalType === "add" ? "Ajouter Formation" : "Modifier Formation"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Nom */}
              <input
                type="text"
                placeholder="Nom de formation"
                value={selectedFormation.name}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    name: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              {/* Prix */}
              <input
                type="number"
                placeholder="Prix"
                value={selectedFormation.price}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    price: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              {/* Formateur */}
              <input
                type="text"
                placeholder="Formateur"
                value={selectedFormation.instructor}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    instructor: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              {/* Localisation */}
              <input
                type="text"
                placeholder="Localisation"
                value={selectedFormation.location}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    location: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              {/* Date */}
              <input
                type="date"
                value={selectedFormation.date}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    date: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              {/* Heure */}
              <input
                type="time"
                value={selectedFormation.time}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    time: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              {/* Centre */}
              <input
                type="text"
                placeholder="Nom du centre"
                value={selectedFormation.center}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    center: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              />

              {/* Category */}
              <select
                value={selectedFormation.category}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    category: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">-- Category --</option>
                <option value="Web Development">Web Development</option>
                <option value="Backend">Backend</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile">Mobile</option>
                <option value="DevOps">DevOps</option>
                <option value="Design">Design</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>

              {/* Status */}
              <select
                value={selectedFormation.status}
                onChange={(e) =>
                  setSelectedFormation({
                    ...selectedFormation,
                    status: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 w-full md:col-span-2"
              >
                <option value="Draft">📝 Draft</option>
                <option value="Active">✅ Active</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFormation(null);
                }}
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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