// ═══════════════════════════════════════════════
// 📁 src/views/Centre/CentreStudents.js
// ═══════════════════════════════════════════════

import React, { useState } from "react";

export default function CentreStudents() {
  const [students, setStudents] = useState([
    { _id: "1", name: "Ali Ben Ahmed", email: "ali@test.com", phone: "+216 22 111 111", formation: "React Advanced", enrollDate: "2025-01-15", status: "Pending" },
    { _id: "2", name: "Sara Mansouri", email: "sara@test.com", phone: "+216 22 222 222", formation: "Node.js API", enrollDate: "2025-01-10", status: "Accepted" },
    { _id: "3", name: "Mohamed Karim", email: "mohamed@test.com", phone: "+216 22 333 333", formation: "Python ML", enrollDate: "2025-02-01", status: "Pending" },
    { _id: "4", name: "Fatima Zahra", email: "fatima@test.com", phone: "+216 22 444 444", formation: "React Advanced", enrollDate: "2025-02-15", status: "Pending" },
    { _id: "5", name: "Youssef Alami", email: "youssef@test.com", phone: "+216 22 555 555", formation: "Docker DevOps", enrollDate: "2025-01-20", status: "Accepted" },
    { _id: "6", name: "Amira Trabelsi", email: "amira@test.com", phone: "+216 22 666 666", formation: "React Advanced", enrollDate: "2025-02-20", status: "Pending" },
    { _id: "7", name: "Khalil Jaziri", email: "khalil@test.com", phone: "+216 22 777 777", formation: "Node.js API", enrollDate: "2025-02-25", status: "Rejected" },
    { _id: "8", name: "Nour Sassi", email: "nour@test.com", phone: "+216 22 888 888", formation: "Python ML", enrollDate: "2025-03-01", status: "Pending" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterFormation, setFilterFormation] = useState("ALL");

  // ─────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────
  const handleAccept = (id) => {
    setStudents(
      students.map((s) =>
        s._id === id ? { ...s, status: "Accepted" } : s
      )
    );
  };

  const handleReject = (id) => {
    if (window.confirm("Rejeter cette inscription ?")) {
      setStudents(
        students.map((s) =>
          s._id === id ? { ...s, status: "Rejected" } : s
        )
      );
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette inscription ?")) {
      setStudents(students.filter((s) => s._id !== id));
    }
  };

  const handleAcceptAll = () => {
    if (window.confirm("Accepter toutes les inscriptions en attente ?")) {
      setStudents(
        students.map((s) =>
          s.status === "Pending" ? { ...s, status: "Accepted" } : s
        )
      );
    }
  };

  // ─────────────────────────────────────────
  // Status styles
  // ─────────────────────────────────────────
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Accepted":
        return "bg-emerald-100 text-emerald-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blueGray-100 text-blueGray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "fas fa-clock";
      case "Accepted":
        return "fas fa-check-circle";
      case "Rejected":
        return "fas fa-times-circle";
      default:
        return "fas fa-question-circle";
    }
  };

  // ─────────────────────────────────────────
  // Formations list (pour le filtre)
  // ─────────────────────────────────────────
  const formations = [...new Set(students.map((s) => s.formation))];

  // ─────────────────────────────────────────
  // Filter
  // ─────────────────────────────────────────
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "ALL" || s.status === filterStatus;
    const matchFormation = filterFormation === "ALL" || s.formation === filterFormation;
    return matchSearch && matchStatus && matchFormation;
  });

  // ─────────────────────────────────────────
  // Counts
  // ─────────────────────────────────────────
  const pendingCount = students.filter((s) => s.status === "Pending").length;
  const acceptedCount = students.filter((s) => s.status === "Accepted").length;
  const rejectedCount = students.filter((s) => s.status === "Rejected").length;

  return (
    <div className="pb-8">

      {/* ══════════════════════════════
          Stats Cards
         ══════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-blueGray-700">{students.length}</p>
          <p className="text-xs text-blueGray-400 font-bold uppercase">Total Inscriptions</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border-b-4 border-amber-500">
          <p className="text-2xl font-bold text-amber-500">{pendingCount}</p>
          <p className="text-xs text-blueGray-400 font-bold uppercase">
            <i className="fas fa-clock mr-1"></i>En Attente
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border-b-4 border-emerald-500">
          <p className="text-2xl font-bold text-emerald-500">{acceptedCount}</p>
          <p className="text-xs text-blueGray-400 font-bold uppercase">
            <i className="fas fa-check mr-1"></i>Acceptés
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border-b-4 border-red-500">
          <p className="text-2xl font-bold text-red-500">{rejectedCount}</p>
          <p className="text-xs text-blueGray-400 font-bold uppercase">
            <i className="fas fa-times mr-1"></i>Rejetés
          </p>
        </div>
      </div>

      {/* ══════════════════════════════
          Table
         ══════════════════════════════ */}
      <div className="bg-white rounded-lg shadow-lg">

        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
            <h3 className="font-bold text-xl text-blueGray-700">
              <i className="fas fa-user-graduate text-lightBlue-500 mr-2"></i>
              Inscriptions des Étudiants
            </h3>

            {/* Accept All Button */}
            {pendingCount > 0 && (
              <button
                onClick={handleAcceptAll}
                className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-600 transition-all shadow"
              >
                <i className="fas fa-check-double mr-1"></i>
                Accepter tout ({pendingCount})
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Rechercher étudiant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded px-3 py-2 pl-9 w-56 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="Pending">⏳ En Attente</option>
              <option value="Accepted">✅ Accepté</option>
              <option value="Rejected">❌ Rejeté</option>
            </select>

            {/* Formation Filter */}
            <select
              value={filterFormation}
              onChange={(e) => setFilterFormation(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            >
              <option value="ALL">Toutes les formations</option>
              {formations.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {[
                  "Étudiant",
                  "Formation",
                  "Date inscription",
                  "Status",
                  "Actions",
                ].map((h) => (
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
              {filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-blueGray-50 border-b">

                  {/* Étudiant */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-lightBlue-200 flex items-center justify-center">
                        <span className="font-bold text-lightBlue-700 text-sm">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-blueGray-700">
                          {student.name}
                        </p>
                        <p className="text-xs text-blueGray-400">{student.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Formation */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-blueGray-700">
                      {student.formation}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-blueGray-400">
                    <i className="fas fa-calendar mr-1"></i>
                    {student.enrollDate}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 ${getStatusStyle(
                        student.status
                      )}`}
                    >
                      <i className={getStatusIcon(student.status)}></i>
                      {student.status === "Pending" && "En Attente"}
                      {student.status === "Accepted" && "Accepté"}
                      {student.status === "Rejected" && "Rejeté"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {/* Si Pending → Accepter ou Rejeter */}
                      {student.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleAccept(student._id)}
                            className="bg-emerald-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-lg hover:bg-emerald-600 transition-all"
                          >
                            <i className="fas fa-check mr-1"></i>
                            Accepter
                          </button>
                          <button
                            onClick={() => handleReject(student._id)}
                            className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-lg hover:bg-red-600 transition-all"
                          >
                            <i className="fas fa-times mr-1"></i>
                            Rejeter
                          </button>
                        </>
                      )}

                      {/* Si Accepted → Badge + Supprimer */}
                      {student.status === "Accepted" && (
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="bg-red-100 text-red-700 font-bold uppercase text-xs px-4 py-2 rounded hover:bg-red-200 transition-all"
                        >
                          <i className="fas fa-trash mr-1"></i>
                          Supprimer
                        </button>
                      )}

                      {/* Si Rejected → Accepter quand même ou Supprimer */}
                      {student.status === "Rejected" && (
                        <>
                          <button
                            onClick={() => handleAccept(student._id)}
                            className="bg-emerald-100 text-emerald-700 font-bold uppercase text-xs px-4 py-2 rounded hover:bg-emerald-200 transition-all"
                          >
                            <i className="fas fa-undo mr-1"></i>
                            Accepter
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="bg-red-100 text-red-700 font-bold uppercase text-xs px-4 py-2 rounded hover:bg-red-200 transition-all"
                          >
                            <i className="fas fa-trash mr-1"></i>
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-blueGray-400"
                  >
                    <i className="fas fa-users-slash text-3xl mb-3 block"></i>
                    Aucun étudiant trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t text-sm text-blueGray-400 flex justify-between items-center">
          <span>{filteredStudents.length} inscription(s) trouvée(s)</span>
          {pendingCount > 0 && (
            <span className="text-amber-500 font-bold">
              <i className="fas fa-exclamation-circle mr-1"></i>
              {pendingCount} en attente de validation
            </span>
          )}
        </div>
      </div>
    </div>
  );
}