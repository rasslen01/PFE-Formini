// ═══════════════════════════════════════════════
// 📁 src/components/Cards/CardTable.js
// Gestion des utilisateurs (API + fallback local si backend down)
// ═══════════════════════════════════════════════

import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  getAllUsers,
  addUser as addUserApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
} from "Services/ApiUser";

// ✅ IMPORTANT: fake data خارج component باش ما يعاودش يتبدّل كل render
const FAKE_USERS = [
  { _id: "1", name: "Ali Ben Ahmed", email: "ali@test.com", role: "ADMIN", xp: 120, isActive: true },
  { _id: "2", name: "Sara Mansouri", email: "sara@test.com", role: "STUDENT", xp: 50, isActive: false },
  { _id: "3", name: "Mohamed Karim", email: "mohamed@test.com", role: "CENTRE", xp: 80, isActive: true },
  { _id: "4", name: "Fatima Zahra", email: "fatima@test.com", role: "STUDENT", xp: 30, isActive: false },
  { _id: "5", name: "Youssef Alami", email: "youssef@test.com", role: "ADMIN", xp: 200, isActive: true },
];

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
    password: "",
  });

  // ─────────────────────────────────────────
  // Helpers local
  // ─────────────────────────────────────────
  const saveToLocal = useCallback((updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem("localUsers", JSON.stringify(updatedUsers));
  }, []);

  const loadFromLocal = useCallback(() => {
    const saved = localStorage.getItem("localUsers");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("localUsers", JSON.stringify(FAKE_USERS));
    return FAKE_USERS;
  }, []);

  // ─────────────────────────────────────────
  // Fetch users
  // ─────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("token");

    // ✅ إذا ما ثماش token => موش backend down => لازم login
    if (!token) {
      setError("Vous devez vous connecter (token manquant).");
      setUseLocalMode(false);
      setUsers([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await getAllUsers();

      // Debug utile
      // console.log("✅ getAllUsers response:", res.data);

      setUsers(res.data.usersList || []);
      setUseLocalMode(false);
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      console.log("❌ API ERROR getAllUsers:", status, data);

      // ✅ Auth/Role errors => لا تروحش local mode
      if (status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        setUseLocalMode(false);
        setUsers([]);
        return;
      }

      if (status === 403) {
        setError("Accès refusé (ADMIN uniquement). Connectez-vous en ADMIN.");
        setUseLocalMode(false);
        setUsers([]);
        return;
      }

      // بعض middleware يرجّع 400 token invalid
      if (status === 400 && (data?.error || "").toLowerCase().includes("token")) {
        setError("Token invalide. Veuillez vous reconnecter.");
        setUseLocalMode(false);
        setUsers([]);
        return;
      }

      // ✅ هنا فقط: backend down / network error (no response)
      if (!err.response) {
        console.warn("⚠️ Backend down, fallback local.");
        setUseLocalMode(true);
        setUsers(loadFromLocal());
        return;
      }

      // أي error آخر: لا نعتبره backend down مباشرة، نعطي message
      setError(data?.error || "Erreur serveur lors du chargement des utilisateurs.");
      setUseLocalMode(false);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [loadFromLocal]);

  // ✅ call once on mount (correct deps)
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ─────────────────────────────────────────
  // Modals
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
      password: "",
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalType("edit");
    setFormUser({ ...user, password: "" }); // password pas modifié ici
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Save
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
          const updatedUsers = users.map((u) => (u._id === formUser._id ? formUser : u));
          saveToLocal(updatedUsers);
        }
      } else {
        // MODE API
        if (modalType === "add") {
          const res = await addUserApi(formUser);
          setUsers((prev) => [...prev, res.data.user]);
        } else {
          const res = await updateUserApi(formUser._id, formUser);
          setUsers((prev) => prev.map((u) => (u._id === formUser._id ? res.data.user : u)));
        }
      }

      setShowModal(false);
    } catch (err) {
      console.error("Save error:", err?.response?.status, err?.response?.data);
      setError(err?.response?.data?.error || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Delete
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
        await fetchUsers(); // refresh from backend
      }
    } catch (err) {
      console.error("Delete error:", err?.response?.status, err?.response?.data);
      setError(err?.response?.data?.error || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Filters (safe)
  // ─────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return (users || []).filter((u) => {
      const name = (u.name || "").toLowerCase();
      const matchesSearch = name.includes(q);

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

      const isActive = u.isActive === true; // safe
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && isActive) ||
        (statusFilter === "SUSPENDED" && !isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  const hasActiveFilters = searchQuery !== "" || roleFilter !== "ALL" || statusFilter !== "ALL";

  // ─────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────
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
              Mode local activé (backend indisponible). Données sauvegardées dans le navigateur.
            </span>
            <button onClick={fetchUsers} className="text-amber-700 hover:text-amber-900 font-bold">
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
            {useLocalMode && <span className="ml-2 text-xs font-normal text-amber-500">(local)</span>}
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
                  <th
                    key={i}
                    className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase"
                  >
                    {h}
                  </th>
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
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-orange-100 text-orange-700"
                            : user.role === "CENTRE"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-lightBlue-100 text-lightBlue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.xp}</td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          ✅ Actif
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">
                          🔴 Suspendu
                        </span>
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
          <span>
            {filteredUsers.length} résultat(s) sur {users.length} utilisateur(s)
          </span>
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
                onChange={(e) => setFormUser({ ...formUser, isActive: e.target.value === "true" })}
                className="border rounded px-3 py-2 w-full md:col-span-2"
              >
                <option value="true">✅ Actif</option>
                <option value="false">🔴 Suspendu</option>
              </select>

              {modalType === "add" && (
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={formUser.password || ""}
                  onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
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