// ═══════════════════════════════════════════════
// src/components/Cards/CardTable.js
// Gestion des utilisateurs — données 100% depuis l'API
// ═══════════════════════════════════════════════

import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  getAllUsers,
  addUser    as addUserApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
} from "Services/ApiUser";

export default function CardTable({ color }) {
  const [users,        setUsers]        = useState([]);
  const [roleFilter,   setRoleFilter]   = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formUser,  setFormUser]  = useState({
    _id: "", name: "", email: "", role: "STUDENT",
    xp: 0, isActive: true, password: "",
  });

  // ─── Charger les users depuis l'API ─────────
  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez vous connecter (token manquant).");
      setUsers([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await getAllUsers();
      // Le backend retourne { usersList: [...] }
      setUsers(res.data?.usersList || res.data || []);
    } catch (err) {
      const status = err?.response?.status;
      const msg    = err?.response?.data?.error;

      if (status === 401) { setError("Session expirée. Reconnectez-vous."); }
      else if (status === 403) { setError("Accès refusé (ADMIN uniquement)."); }
      else { setError(msg || "Erreur lors du chargement des utilisateurs."); }

      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ─── Ouvrir modal ───────────────────────────
  const openAddModal = () => {
    setModalType("add");
    setFormUser({ _id: "", name: "", email: "", role: "STUDENT", xp: 0, isActive: true, password: "" });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalType("edit");
    setFormUser({ ...user, password: "" });
    setShowModal(true);
  };

  // ─── Sauvegarder (add ou edit) ──────────────
  const handleSave = async () => {
    if (!formUser.name?.trim())  { setError("Le nom est obligatoire.");   return; }
    if (!formUser.email?.trim()) { setError("L'email est obligatoire.");  return; }
    if (modalType === "add" && !formUser.password) {
      setError("Le mot de passe est obligatoire."); return;
    }

    setLoading(true);
    setError("");

    try {
      if (modalType === "add") {
        const res = await addUserApi(formUser);
        // Le backend retourne { message, user: {...} }
        const newUser = res.data?.user || res.data;
        setUsers((prev) => [...prev, newUser]);
      } else {
        const res = await updateUserApi(formUser._id, formUser);
        const updated = res.data?.user || res.data;
        setUsers((prev) => prev.map((u) => u._id === formUser._id ? updated : u));
      }
      setShowModal(false);
    } catch (err) {
      setError(err?.response?.data?.error || "Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Supprimer ──────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    setLoading(true);
    setError("");
    try {
      await deleteUserApi(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err?.response?.data?.error || "Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Filtres ────────────────────────────────
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return (users || []).filter((u) => {
      const matchSearch = (u.name || "").toLowerCase().includes(q) ||
                          (u.email || "").toLowerCase().includes(q);
      const matchRole   = roleFilter   === "ALL" || u.role === roleFilter;
      const matchStatus = statusFilter === "ALL" ||
        (statusFilter === "ACTIVE"    &&  u.isActive) ||
        (statusFilter === "SUSPENDED" && !u.isActive);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const hasFilters = searchQuery || roleFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <>
      <div className={"relative flex flex-col w-full mb-6 shadow-lg rounded " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}>

        {/* Erreur */}
        {error && (
          <div className="bg-red-100 border-b border-red-200 text-red-700 px-4 py-2 text-xs flex justify-between items-center">
            <span><i className="fas fa-exclamation-circle mr-2" />{error}</span>
            <button onClick={() => setError("")}><i className="fas fa-times" /></button>
          </div>
        )}

        {/* Header */}
        <div className="px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <h3 className="font-semibold text-lg">Gestion des utilisateurs</h3>
          <div className="flex flex-wrap gap-2 items-center">

            {/* Recherche */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                <i className="fas fa-search" />
              </span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded px-3 py-2 pl-9 w-56 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blueGray-400 hover:text-red-500">
                  <i className="fas fa-times" />
                </button>
              )}
            </div>

            {/* Filtre rôle */}
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="border px-3 py-2 rounded text-sm">
              <option value="ALL">Tous les rôles</option>
              <option value="ADMIN">Admin</option>
              <option value="CENTRE">Centre</option>
              <option value="STUDENT">Student</option>
            </select>

            {/* Filtre statut */}
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded text-sm">
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIVE">✅ Actif</option>
              <option value="SUSPENDED">🔴 Suspendu</option>
            </select>

            {/* Reset filtres */}
            {hasFilters && (
              <button onClick={() => { setSearchQuery(""); setRoleFilter("ALL"); setStatusFilter("ALL"); }}
                className="bg-blueGray-200 text-blueGray-700 px-3 py-2 rounded text-sm hover:bg-blueGray-300">
                <i className="fas fa-undo mr-1" /> Reset
              </button>
            )}

            {/* Refresh */}
            <button onClick={fetchUsers}
              className="bg-blueGray-100 text-blueGray-600 px-3 py-2 rounded text-sm hover:bg-blueGray-200"
              title="Rafraîchir">
              <i className="fas fa-sync-alt" />
            </button>

            {/* Ajouter */}
            <button onClick={openAddModal}
              className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-600">
              <i className="fas fa-plus mr-1" /> Ajouter
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="px-4 py-2 text-center text-lightBlue-500 text-sm">
            <i className="fas fa-spinner fa-spin mr-2" /> Chargement...
          </div>
        )}

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Nom", "Email", "Rôle", "XP", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 border-b">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-lightBlue-100 flex items-center justify-center font-bold text-lightBlue-700 text-sm flex-shrink-0">
                          {(user.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-blueGray-700">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-blueGray-500 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        user.role === "ADMIN"   ? "bg-orange-100 text-orange-700"  :
                        user.role === "CENTRE"  ? "bg-purple-100 text-purple-700"  :
                                                  "bg-lightBlue-100 text-lightBlue-700"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-amber-500">{user.xp || 0}</span>
                      <span className="text-xs text-blueGray-400 ml-1">XP</span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive
                        ? <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">✅ Actif</span>
                        : <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">🔴 Suspendu</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(user)} disabled={loading}
                          className="bg-lightBlue-500 text-white font-bold text-xs px-3 py-2 rounded shadow hover:shadow-md transition-all">
                          <i className="fas fa-edit mr-1" /> Modifier
                        </button>
                        <button onClick={() => handleDelete(user._id)} disabled={loading}
                          className="bg-red-500 text-white font-bold text-xs px-3 py-2 rounded shadow hover:shadow-md transition-all">
                          <i className="fas fa-trash mr-1" /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-blueGray-400">
                    {loading ? "" : (
                      <>
                        <i className="fas fa-users text-3xl mb-3 block opacity-30" />
                        {error ? "Vérifiez votre connexion." : "Aucun utilisateur trouvé."}
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-sm text-blueGray-400 border-t">
          {filteredUsers.length} résultat(s) sur {users.length} utilisateur(s)
        </div>
      </div>

      {/* Modal Ajouter / Modifier */}
      {showModal && (
        <>
          <div className="modal-backdrop" />
          <div className="modal-container">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold">
                {modalType === "add" ? "➕ Ajouter un utilisateur" : "✏️ Modifier l'utilisateur"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-blueGray-400 hover:text-red-500">
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 text-sm px-3 py-2 rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-blueGray-600 uppercase mb-1">Nom complet *</label>
                <input type="text" placeholder="Nom complet" value={formUser.name}
                  onChange={(e) => setFormUser({ ...formUser, name: e.target.value })}
                  className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-400" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-blueGray-600 uppercase mb-1">Email *</label>
                <input type="email" placeholder="Email" value={formUser.email}
                  onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                  className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-400" />
              </div>

              <div>
                <label className="block text-xs font-bold text-blueGray-600 uppercase mb-1">Rôle</label>
                <select value={formUser.role}
                  onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}
                  className="border rounded px-3 py-2 w-full text-sm">
                  <option value="STUDENT">Student</option>
                  <option value="ADMIN">Admin</option>
                  <option value="CENTRE">Centre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-blueGray-600 uppercase mb-1">XP</label>
                <input type="number" placeholder="XP" value={formUser.xp} min="0"
                  onChange={(e) => setFormUser({ ...formUser, xp: Number(e.target.value) })}
                  className="border rounded px-3 py-2 w-full text-sm" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-blueGray-600 uppercase mb-1">Statut</label>
                <select value={formUser.isActive ? "true" : "false"}
                  onChange={(e) => setFormUser({ ...formUser, isActive: e.target.value === "true" })}
                  className="border rounded px-3 py-2 w-full text-sm">
                  <option value="true">✅ Actif</option>
                  <option value="false">🔴 Suspendu</option>
                </select>
              </div>

              {modalType === "add" && (
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-blueGray-600 uppercase mb-1">Mot de passe *</label>
                  <input type="password" placeholder="Mot de passe (min. 6 caractères)"
                    value={formUser.password || ""}
                    onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
                    className="border rounded px-3 py-2 w-full text-sm" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} disabled={loading}
                className="bg-blueGray-200 text-blueGray-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all">
                Annuler
              </button>
              <button onClick={handleSave} disabled={loading}
                className="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all">
                {loading ? <><i className="fas fa-spinner fa-spin mr-2" />Saving...</> : "Enregistrer"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

CardTable.defaultProps = { color: "light" };
CardTable.propTypes    = { color: PropTypes.oneOf(["light", "dark"]) };