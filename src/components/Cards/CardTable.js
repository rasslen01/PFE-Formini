// ═══════════════════════════════════════════════
// 📁 src/components/Cards/CardTable.js
// Mode hybride : API si backend dispo, sinon local
// ═══════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getAllUsers,
  addUser as addUserApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
} from "Services/ApiUser";

export default function CardTable({ color }) {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useLocalMode, setUseLocalMode] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formUser, setFormUser] = useState({
    _id: "",
    name: "",
    email: "",
    role: "STUDENT",
    xp: 0,
    isActive: true,
  });

  // ─────────────────────────────────────────
  // Fake data (fallback si pas de backend)
  // ─────────────────────────────────────────
  const fakeUsers = [
    { _id: "1", name: "Ali Ben Ahmed", email: "ali@test.com", role: "ADMIN", xp: 120, isActive: true },
    { _id: "2", name: "Sara Mansouri", email: "sara@test.com", role: "STUDENT", xp: 50, isActive: false },
    { _id: "3", name: "Mohamed Karim", email: "mohamed@test.com", role: "CENTRE", xp: 80, isActive: true },
    { _id: "4", name: "Fatima Zahra", email: "fatima@test.com", role: "STUDENT", xp: 30, isActive: false },
    { _id: "5", name: "Youssef Alami", email: "youssef@test.com", role: "ADMIN", xp: 200, isActive: true },
  ];

  // ─────────────────────────────────────────
  // Fetch users (API ou Local)
  // ─────────────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllUsers();
      setUsers(res.data.usersList);
      setUseLocalMode(false);
    } catch (err) {
      console.warn("⚠️ Backend non disponible, mode local activé");
      setUseLocalMode(true);
      const saved = localStorage.getItem("localUsers");
      if (saved) {
        setUsers(JSON.parse(saved));
      } else {
        setUsers(fakeUsers);
        localStorage.setItem("localUsers", JSON.stringify(fakeUsers));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ─────────────────────────────────────────
  // Sauvegarder en local
  // ─────────────────────────────────────────
  const saveToLocal = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem("localUsers", JSON.stringify(updatedUsers));
  };

  // ─────────────────────────────────────────
  // Open Modals
  // ─────────────────────────────────────────
  const openAddModal = () => {
    setModalType("add");
    setFormUser({
      _id: "",
      name: "",
      email: "",
      role: "STUDENT",
      xp: 0,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalType("edit");
    setFormUser({ ...user });
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Save (API ou Local)
  // ─────────────────────────────────────────
  const handleSave = async () => {
  setLoading(true);
  setError("");

  try {
    if (useLocalMode) {
      // MODE LOCAL
      if (modalType === "add") {
        const newUser = { ...formUser, _id: Date.now().toString() };
        saveToLocal([...users, newUser]);
      } else {
        const updatedUsers = users.map((u) =>
          u._id === formUser._id ? formUser : u
        );
        saveToLocal(updatedUsers);
      }
    } else {
      // MODE API
      if (modalType === "add") {
        const res = await addUserApi(formUser);
        setUsers(prev => [...prev, res.data.user]); // ajouter directement
      } else {
        const res = await updateUserApi(formUser._id, formUser);
        // mettre à jour le state local directement
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === formUser._id ? res.data.user : u
          )
        );
      }
    }

    setShowModal(false);
  } catch (err) {
    setError("Erreur lors de la sauvegarde");
    console.error("Save error:", err);
  } finally {
    setLoading(false);
  }
};

  // ─────────────────────────────────────────
  // Delete (API ou Local)
  // ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;

    setLoading(true);
    setError("");

    try {
      if (useLocalMode) {
        saveToLocal(users.filter((u) => u._id !== id));
      } else {
        await deleteUserApi(id);
        // 🔹 Correction : mettre à jour state immédiatement
        const res = await getAllUsers();
        setUsers(res.data.usersList);
      }
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Filtres
  // ─────────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && u.isActive === true) ||
      (statusFilter === "SUSPENDED" && u.isActive === false);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  const hasActiveFilters =
    searchQuery !== "" || roleFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <>
      <div
        className={
          "relative flex flex-col w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        {/* Mode Indicator */}
        {useLocalMode && (
          <div className="bg-amber-100 border-b border-amber-200 text-amber-700 px-4 py-2 text-xs flex items-center justify-between">
            <span>
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Mode local activé (backend non disponible). Les données sont sauvegardées dans le navigateur.
            </span>
            <button
              onClick={fetchUsers}
              className="text-amber-700 hover:text-amber-900 font-bold"
            >
              <i className="fas fa-sync-alt mr-1"></i>
              Réessayer
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-b border-red-200 text-red-700 px-4 py-2 text-xs flex justify-between items-center">
            <span>
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </span>
            <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <h3 className="font-semibold text-lg">
            Gestion des utilisateurs
            {useLocalMode && (
              <span className="ml-2 text-xs font-normal text-amber-500">
                (local)
              </span>
            )}
          </h3>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded px-3 py-2 pl-9 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blueGray-400 hover:text-red-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            >
              <option value="ALL">Tous les rôles</option>
              <option value="ADMIN">Admin</option>
              <option value="CENTRE">Centre</option>
              <option value="STUDENT">Student</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIVE">✅ Actif</option>
              <option value="SUSPENDED">🔴 Suspendu</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="bg-blueGray-200 text-blueGray-700 px-3 py-2 rounded text-sm hover:bg-blueGray-300"
              >
                <i className="fas fa-undo mr-1"></i>
                Réinitialiser
              </button>
            )}

            <button
              onClick={openAddModal}
              className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-600"
            >
              + Ajouter
            </button>
          </div>
        </div>

        {/* Filter Badges */}
        {hasActiveFilters && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="bg-lightBlue-100 text-lightBlue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <i className="fas fa-search text-xs"></i>
                Nom : "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-red-500">×</button>
              </span>
            )}
            {roleFilter !== "ALL" && (
              <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                Rôle : {roleFilter}
                <button onClick={() => setRoleFilter("ALL")} className="ml-1 hover:text-red-500">×</button>
              </span>
            )}
            {statusFilter !== "ALL" && (
              <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                statusFilter === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              }`}>
                Status : {statusFilter === "ACTIVE" ? "Actif" : "Suspendu"}
                <button onClick={() => setStatusFilter("ALL")} className="ml-1 hover:text-red-500">×</button>
              </span>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="px-4 py-2 text-center text-lightBlue-500 text-sm">
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Chargement...
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Nom", "Email", "Rôle", "XP", "Status", "Actions"].map((h, i) => (
                  <th key={i} className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100 border-b">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        user.role === "ADMIN" ? "bg-orange-100 text-orange-700"
                        : user.role === "CENTRE" ? "bg-purple-100 text-purple-700"
                        : "bg-lightBlue-100 text-lightBlue-700"
                      }`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4">{user.xp}</td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">✅ Actif</span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">🔴 Suspendu</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        disabled={loading}
                        className="bg-lightBlue-500 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg transition-all"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={loading}
                        className="bg-red-500 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg transition-all"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-blueGray-400">
                    <i className="fas fa-user-slash text-2xl mb-2 block"></i>
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-sm text-blueGray-400 border-t flex justify-between items-center">
          <span>{filteredUsers.length} résultat(s) sur {users.length} utilisateur(s)</span>
          <span className="text-xs">
            <i className={`fas fa-circle mr-1 ${useLocalMode ? "text-amber-500" : "text-emerald-500"}`}></i>
            {useLocalMode ? "Local" : "API"}
          </span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
  <>
    <div className="modal-backdrop"></div>
    <div className="modal-container">
      <h3 className="text-xl font-semibold mb-4">
        {modalType === "add" ? "Ajouter utilisateur" : "Modifier utilisateur"}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nom"
          value={formUser.name}
          onChange={(e) => setFormUser({ ...formUser, name: e.target.value })}
          className="border rounded px-3 py-2 w-full md:col-span-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={formUser.email}
          onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
          className="border rounded px-3 py-2 w-full md:col-span-2"
        />
        <select
          value={formUser.role}
          onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="ADMIN">Admin</option>
          <option value="CENTRE">Centre</option>
          <option value="STUDENT">Student</option>
        </select>
        <input
          type="number"
          placeholder="XP"
          value={formUser.xp}
          onChange={(e) => setFormUser({ ...formUser, xp: Number(e.target.value) })}
          min="0"
          className="border rounded px-3 py-2 w-full"
        />
        <select
          value={formUser.isActive ? "true" : "false"}
          onChange={(e) =>
            setFormUser({ ...formUser, isActive: e.target.value === "true" })
          }
          className="border rounded px-3 py-2 w-full md:col-span-2"
        >
          <option value="true">✅ Actif</option>
          <option value="false">🔴 Suspendu</option>
        </select>

        {/* ───── Nouveau champ mot de passe ───── */}
        {modalType === "add" && (
          <input
            type="password"
            placeholder="Mot de passe"
            value={formUser.password || ""}
            onChange={(e) =>
              setFormUser({ ...formUser, password: e.target.value })
            }
            className="border rounded px-3 py-2 w-full md:col-span-2"
          />
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowModal(false)}
          disabled={loading}
          className="bg-red-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
            </>
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

CardTable.defaultProps = { color: "light" };
CardTable.propTypes = { color: PropTypes.oneOf(["light", "dark"]) };