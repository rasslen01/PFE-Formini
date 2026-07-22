// ═══════════════════════════════════════════════
// src/components/Cards/CardBadges.js
// Gestion admin des badges — badges sont des objets {_id, name, icon, color}
// ═══════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getAllUsersWithBadges,
  addBadgeToUser,
  removeBadgeFromUser,
  getAvailableBadges,
} from "../../Services/ApiBadges.js";

export default function CardBadges({ color }) {
  const [users, setUsers]               = useState([]);
  const [allBadges, setAllBadges]       = useState([]);
  const [searchQuery, setSearchQuery]   = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newBadgeName, setNewBadgeName] = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  // ── Chargement initial ──────────────────────
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, badgesRes] = await Promise.all([
        getAllUsersWithBadges(),
        getAvailableBadges(),
      ]);
      setUsers(usersRes.data?.users || []);
      setAllBadges(badgesRes.data?.badges || []);
    } catch (err) {
      console.error("❌ Erreur chargement:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers badges ──────────────────────────
  // Retourne true si l'utilisateur possède déjà ce badge (comparaison par _id ou name)
  const userHasBadge = (user, badgeName) =>
    (user.badges || []).some((b) =>
      typeof b === "object" ? b.name === badgeName : b === badgeName
    );

  // Récupère le nom d'affichage d'un badge (objet ou string)
  const getBadgeName = (badge) =>
    typeof badge === "object" ? badge.name : badge;

  const getBadgeIcon = (badge) =>
    typeof badge === "object" ? badge.icon || "🏅" : "🏅";

  // Couleur depuis la liste allBadges
  const getBadgeStyle = (badgeName) => {
    const found = allBadges.find((b) => b.name === badgeName);
    if (found?.color) {
      return { backgroundColor: found.color + "22", color: found.color, border: `1px solid ${found.color}55` };
    }
    return {};
  };

  // ── Ouvrir modal ────────────────────────────
  const openBadgeModal = (user) => {
    setSelectedUser({ ...user, badges: [...(user.badges || [])] });
    setNewBadgeName("");
    setShowModal(true);
  };

  // ── Ajouter badge (API) ─────────────────────
  const handleAddBadge = async () => {
    if (!newBadgeName || userHasBadge(selectedUser, newBadgeName)) return;
    try {
      await addBadgeToUser(selectedUser._id, newBadgeName);
      await refreshUser(selectedUser._id);
      setNewBadgeName("");
    } catch (err) {
      alert("Erreur lors de l'ajout du badge");
    }
  };

  // ── Retirer badge (API) ─────────────────────
  const handleRemoveBadge = async (badgeName) => {
    try {
      await removeBadgeFromUser(selectedUser._id, badgeName);
      await refreshUser(selectedUser._id);
    } catch (err) {
      alert("Erreur lors de la suppression du badge");
    }
  };

  const handleRemoveBadgeFromTable = async (userId, badgeName) => {
    if (!window.confirm(`Supprimer le badge "${badgeName}" ?`)) return;
    try {
      await removeBadgeFromUser(userId, badgeName);
      await refreshUserInTable(userId);
    } catch (err) {
      alert("Erreur lors de la suppression du badge");
    }
  };

  // ── Rafraîchir un user dans le state ────────
  const refreshUser = async (userId) => {
    const res = await getAllUsersWithBadges();
    const fresh = (res.data?.users || []).find((u) => u._id === userId);
    if (fresh) {
      setSelectedUser({ ...fresh });
      setUsers((prev) => prev.map((u) => (u._id === userId ? fresh : u)));
    }
  };

  const refreshUserInTable = async (userId) => {
    const res = await getAllUsersWithBadges();
    setUsers(res.data?.users || []);
  };

  // ── Filtrage ────────────────────────────────
  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Badges pas encore attribués à l'utilisateur sélectionné
  const availableForUser = selectedUser
    ? allBadges.filter((b) => !userHasBadge(selectedUser, b.name))
    : [];

  // ── Rendu loading / error ───────────────────
  if (loading)
    return (
      <div className="relative flex flex-col w-full mb-6 shadow-lg rounded bg-white">
        <div className="flex justify-center items-center py-16">
          <i className="fas fa-spinner fa-spin text-3xl text-lightBlue-500 mr-3" />
          <span className="text-blueGray-500 text-lg">Chargement des badges...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="relative flex flex-col w-full mb-6 shadow-lg rounded bg-white">
        <div className="flex flex-col justify-center items-center py-16">
          <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-3" />
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button onClick={fetchAll} className="bg-lightBlue-500 text-white font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all">
            <i className="fas fa-redo mr-2" /> Réessayer
          </button>
        </div>
      </div>
    );

  return (
    <>
      <div className={"relative flex flex-col w-full mb-6 shadow-lg rounded " + (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}>

        {/* ── Header ─────────────────────────── */}
        <div className="px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <h3 className="font-semibold text-lg">
            <i className="fas fa-award text-amber-500 mr-2" />
            Gestion des Badges
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={fetchAll} className="bg-blueGray-100 text-blueGray-600 px-3 py-2 rounded text-sm hover:bg-blueGray-200 transition-all" title="Rafraîchir">
              <i className="fas fa-sync-alt" />
            </button>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blueGray-400">
                <i className="fas fa-search" />
              </span>
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded px-3 py-2 pl-9 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 flex items-center pr-3 text-blueGray-400 hover:text-red-500">
                  <i className="fas fa-times" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats ──────────────────────────── */}
        <div className="px-4 pb-3 flex flex-wrap gap-4">
          <span className="text-xs text-blueGray-400"><i className="fas fa-users mr-1" />{users.length} utilisateur(s)</span>
          <span className="text-xs text-blueGray-400"><i className="fas fa-award mr-1" />{users.reduce((acc, u) => acc + (u.badges?.length || 0), 0)} badge(s) total</span>
          <span className="text-xs text-blueGray-400"><i className="fas fa-user-slash mr-1" />{users.filter((u) => !u.badges?.length).length} sans badge</span>
        </div>

        {/* ── Tableau ────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Utilisateur", "Rôle", "Badges", "Nb", "Actions"].map((h, i) => (
                  <th key={i} className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100 border-b">
                    {/* Utilisateur */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-lightBlue-200 flex items-center justify-center">
                          <span className="font-bold text-lightBlue-700 text-sm">{(user.name || "?").charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-blueGray-700">{user.name}</p>
                          <p className="text-xs text-blueGray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Rôle */}
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${user.role === "ADMIN" ? "bg-orange-100 text-orange-700" : user.role === "CENTRE" ? "bg-purple-100 text-purple-700" : "bg-lightBlue-100 text-lightBlue-700"}`}>
                        {user.role}
                      </span>
                    </td>
                    {/* Badges */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(user.badges || []).length > 0 ? (
                          user.badges.map((badge, i) => (
                            <span
                              key={i}
                              className="text-xs font-bold px-2 py-1 rounded-full inline-flex items-center gap-1"
                              style={getBadgeStyle(getBadgeName(badge))}
                            >
                              {getBadgeIcon(badge)} {getBadgeName(badge)}
                              <button
                                onClick={() => handleRemoveBadgeFromTable(user._id, getBadgeName(badge))}
                                className="ml-1 hover:text-red-500 text-xs"
                                title="Supprimer ce badge"
                              >×</button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-blueGray-300 italic">Aucun badge</span>
                        )}
                      </div>
                    </td>
                    {/* Nb */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-blueGray-700">{user.badges?.length || 0}</span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openBadgeModal(user)}
                        className="bg-lightBlue-500 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg transition-all"
                      >
                        <i className="fas fa-edit mr-1" /> Gérer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-blueGray-400">
                    <i className="fas fa-user-slash text-2xl mb-2 block" />
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ─────────────────────────── */}
        <div className="px-4 py-2 text-sm text-blueGray-400 border-t">
          {filteredUsers.length} résultat(s) sur {users.length} utilisateur(s)
        </div>
      </div>

      {/* ── Modal ──────────────────────────────── */}
      {showModal && selectedUser && (
        <>
          <div className="modal-backdrop" />
          <div className="modal-container">
            {/* Header modal */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                <i className="fas fa-award text-amber-500 mr-2" /> Gérer les Badges
              </h3>
              <button onClick={() => setShowModal(false)} className="text-blueGray-400 hover:text-red-500">
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            {/* Infos user */}
            <div className="bg-blueGray-50 rounded-lg p-4 mb-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-lightBlue-200 flex items-center justify-center">
                <span className="font-bold text-lightBlue-700">{selectedUser.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-bold text-blueGray-700">{selectedUser.name}</p>
                <p className="text-xs text-blueGray-400">{selectedUser.email}</p>
                {selectedUser.xp !== undefined && (
                  <p className="text-xs text-amber-500 font-semibold mt-0.5">
                    ⭐ {selectedUser.xp} XP · Niveau {selectedUser.level || 1}
                  </p>
                )}
              </div>
              <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${selectedUser.role === "ADMIN" ? "bg-orange-100 text-orange-700" : selectedUser.role === "CENTRE" ? "bg-purple-100 text-purple-700" : "bg-lightBlue-100 text-lightBlue-700"}`}>
                {selectedUser.role}
              </span>
            </div>

            {/* Badges actuels */}
            <div className="mb-4">
              <label className="block text-blueGray-600 text-sm font-bold mb-2">
                Badges actuels ({selectedUser.badges?.length || 0})
              </label>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {(selectedUser.badges || []).length > 0 ? (
                  selectedUser.badges.map((badge, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold px-3 py-2 rounded-full inline-flex items-center gap-2"
                      style={getBadgeStyle(getBadgeName(badge))}
                    >
                      {getBadgeIcon(badge)} {getBadgeName(badge)}
                      <button
                        onClick={() => handleRemoveBadge(getBadgeName(badge))}
                        className="w-4 h-4 rounded-full bg-red-200 text-red-600 flex items-center justify-center hover:bg-red-300 text-xs"
                        title="Supprimer"
                      >×</button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-blueGray-300 italic py-2">Aucun badge assigné</span>
                )}
              </div>
            </div>

            {/* Ajouter badge */}
            <div className="mb-4">
              <label className="block text-blueGray-600 text-sm font-bold mb-2">Ajouter un badge</label>
              <div className="flex gap-2">
                <select
                  value={newBadgeName}
                  onChange={(e) => setNewBadgeName(e.target.value)}
                  className="border rounded px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                >
                  <option value="">-- Sélectionner un badge --</option>
                  {availableForUser.map((badge) => (
                    <option key={badge._id} value={badge.name}>
                      {badge.icon} {badge.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddBadge}
                  disabled={!newBadgeName}
                  className={`px-4 py-2 rounded font-bold text-sm shadow transition-all ${newBadgeName ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg" : "bg-blueGray-200 text-blueGray-400 cursor-not-allowed"}`}
                >
                  <i className="fas fa-plus mr-1" /> Ajouter
                </button>
              </div>
            </div>

            {/* Quick add */}
            <div className="mb-4">
              <label className="block text-blueGray-600 text-sm font-bold mb-2">
                Cliquer pour ajouter rapidement
              </label>
              <div className="flex flex-wrap gap-2">
                {availableForUser.length > 0 ? (
                  availableForUser.map((badge) => (
                    <button
                      key={badge._id}
                      onClick={() => { setNewBadgeName(badge.name); }}
                      className="text-xs font-bold px-3 py-2 rounded-full bg-blueGray-100 text-blueGray-700 hover:bg-lightBlue-100 hover:text-lightBlue-700 transition-all"
                    >
                      {badge.icon} {badge.name}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-blueGray-300 italic py-2">Tous les badges sont assignés ✅</span>
                )}
              </div>
            </div>

            {/* Footer modal */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blueGray-200 text-blueGray-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

CardBadges.defaultProps = { color: "light" };
CardBadges.propTypes = { color: PropTypes.oneOf(["light", "dark"]) };