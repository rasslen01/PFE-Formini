// ═══════════════════════════════════════════════
// 📁 src/components/Cards/CardBadges.js
// ═══════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getAllUsersWithBadges,
  addBadgeToUser,
  removeBadgeFromUser,
} from "../../Services/ApiBadges.js";

export default function CardBadges({ color }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newBadge, setNewBadge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─────────────────────────────────────────
  // Badges disponibles
  // ─────────────────────────────────────────
  const availableBadges = [
    { name: "🏆 Top Learner", color: "bg-amber-100 text-amber-700" },
    { name: "🚀 Fast Starter", color: "bg-lightBlue-100 text-lightBlue-700" },
    { name: "⭐ Star Student", color: "bg-yellow-100 text-yellow-700" },
    { name: "🔥 Streak Master", color: "bg-orange-100 text-orange-700" },
    { name: "💎 Premium", color: "bg-purple-100 text-purple-700" },
    { name: "🎯 Goal Achiever", color: "bg-emerald-100 text-emerald-700" },
    { name: "📚 Bookworm", color: "bg-indigo-100 text-indigo-700" },
    { name: "🛡️ Certified", color: "bg-teal-100 text-teal-700" },
    { name: "👑 Elite", color: "bg-red-100 text-red-700" },
    { name: "💡 Innovator", color: "bg-pink-100 text-pink-700" },
    { name: "🤝 Team Player", color: "bg-cyan-100 text-cyan-700" },
    { name: "🏅 Champion", color: "bg-amber-100 text-amber-800" },
  ];

  // ─────────────────────────────────────────
  // Charger les utilisateurs depuis l'API
  // ─────────────────────────────────────────
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUsersWithBadges();
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Erreur chargement utilisateurs:", err);
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Get badge style
  // ─────────────────────────────────────────
  const getBadgeStyle = (badgeName) => {
    const badge = availableBadges.find((b) => b.name === badgeName);
    return badge ? badge.color : "bg-blueGray-100 text-blueGray-700";
  };

  // ─────────────────────────────────────────
  // Open modal
  // ─────────────────────────────────────────
  const openBadgeModal = (user) => {
    setSelectedUser({ ...user });
    setNewBadge("");
    setShowModal(true);
  };

  // ─────────────────────────────────────────
  // Add badge (API)
  // ─────────────────────────────────────────
  const handleAddBadge = async () => {
    if (!newBadge || selectedUser.badges.includes(newBadge)) return;

    try {
      await addBadgeToUser(selectedUser._id, newBadge);

      const updatedUser = {
        ...selectedUser,
        badges: [...selectedUser.badges, newBadge],
      };
      setSelectedUser(updatedUser);
      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
      setNewBadge("");
    } catch (err) {
      console.error("❌ Erreur ajout badge:", err);
      alert("Erreur lors de l'ajout du badge");
    }
  };

  // ─────────────────────────────────────────
  // Remove badge from modal (API)
  // ─────────────────────────────────────────
  const handleRemoveBadge = async (badgeName) => {
    try {
      await removeBadgeFromUser(selectedUser._id, badgeName);

      const updatedUser = {
        ...selectedUser,
        badges: selectedUser.badges.filter((b) => b !== badgeName),
      };
      setSelectedUser(updatedUser);
      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
    } catch (err) {
      console.error("❌ Erreur suppression badge:", err);
      alert("Erreur lors de la suppression du badge");
    }
  };

  // ─────────────────────────────────────────
  // Remove badge directly from table (API)
  // ─────────────────────────────────────────
  const handleRemoveBadgeFromTable = async (userId, badgeName) => {
    if (!window.confirm(`Supprimer le badge "${badgeName}" ?`)) return;

    try {
      await removeBadgeFromUser(userId, badgeName);

      setUsers(
        users.map((u) =>
          u._id === userId
            ? { ...u, badges: u.badges.filter((b) => b !== badgeName) }
            : u
        )
      );
    } catch (err) {
      console.error("❌ Erreur suppression badge:", err);
      alert("Erreur lors de la suppression du badge");
    }
  };

  // ─────────────────────────────────────────
  // Quick add badge from modal (API)
  // ─────────────────────────────────────────
  const handleQuickAddBadge = async (badgeName) => {
    if (selectedUser.badges.includes(badgeName)) return;

    try {
      await addBadgeToUser(selectedUser._id, badgeName);

      const updatedUser = {
        ...selectedUser,
        badges: [...selectedUser.badges, badgeName],
      };
      setSelectedUser(updatedUser);
      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
    } catch (err) {
      console.error("❌ Erreur ajout rapide badge:", err);
      alert("Erreur lors de l'ajout du badge");
    }
  };

  // ─────────────────────────────────────────
  // Filter
  // ─────────────────────────────────────────
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // ─────────────────────────────────────────
  // Badges not yet assigned to selected user
  // ─────────────────────────────────────────
  const availableForUser = selectedUser
    ? availableBadges.filter((b) => !selectedUser.badges.includes(b.name))
    : [];

  // ─────────────────────────────────────────
  // Loading state
  // ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative flex flex-col w-full mb-6 shadow-lg rounded bg-white">
        <div className="flex justify-center items-center py-16">
          <i className="fas fa-spinner fa-spin text-3xl text-lightBlue-500 mr-3"></i>
          <span className="text-blueGray-500 text-lg">Chargement des badges...</span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Error state
  // ─────────────────────────────────────────
  if (error) {
    return (
      <div className="relative flex flex-col w-full mb-6 shadow-lg rounded bg-white">
        <div className="flex flex-col justify-center items-center py-16">
          <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-3"></i>
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-lightBlue-500 text-white font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg transition-all"
          >
            <i className="fas fa-redo mr-2"></i>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          "relative flex flex-col w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        {/* ══════════════════════════════════════
            HEADER
           ══════════════════════════════════════ */}
        <div className="px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <h3 className="font-semibold text-lg">
            <i className="fas fa-award text-amber-500 mr-2"></i>
            Gestion des Badges
          </h3>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Refresh */}
            <button
              onClick={fetchUsers}
              className="bg-blueGray-100 text-blueGray-600 px-3 py-2 rounded text-sm hover:bg-blueGray-200 transition-all"
              title="Rafraîchir"
            >
              <i className="fas fa-sync-alt"></i>
            </button>

            {/* Search */}
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
          </div>
        </div>

        {/* ══════════════════════════════════════
            STATS
           ══════════════════════════════════════ */}
        <div className="px-4 pb-3 flex flex-wrap gap-4">
          <span className="text-xs text-blueGray-400">
            <i className="fas fa-users mr-1"></i>
            {users.length} utilisateur(s)
          </span>
          <span className="text-xs text-blueGray-400">
            <i className="fas fa-award mr-1"></i>
            {users.reduce((acc, u) => acc + u.badges.length, 0)} badge(s) total
          </span>
          <span className="text-xs text-blueGray-400">
            <i className="fas fa-user-slash mr-1"></i>
            {users.filter((u) => u.badges.length === 0).length} sans badge
          </span>
        </div>

        {/* ══════════════════════════════════════
            TABLE
           ══════════════════════════════════════ */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Utilisateur", "Rôle", "Badges", "Nb", "Actions"].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100 border-b">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-lightBlue-200 flex items-center justify-center">
                          <span className="font-bold text-lightBlue-700 text-sm">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-blueGray-700">
                            {user.name}
                          </p>
                          <p className="text-xs text-blueGray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
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

                    {/* Badges */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.badges.length > 0 ? (
                          user.badges.map((badge, i) => (
                            <span
                              key={i}
                              className={`text-xs font-bold px-2 py-1 rounded-full inline-flex items-center gap-1 ${getBadgeStyle(
                                badge
                              )}`}
                            >
                              {badge}
                              <button
                                onClick={() =>
                                  handleRemoveBadgeFromTable(user._id, badge)
                                }
                                className="ml-1 hover:text-red-500 text-xs"
                                title="Supprimer ce badge"
                              >
                                ×
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-blueGray-300 italic">
                            Aucun badge
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Count */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-blueGray-700">
                        {user.badges.length}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openBadgeModal(user)}
                        className="bg-lightBlue-500 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg transition-all"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Gérer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-blueGray-400"
                  >
                    <i className="fas fa-user-slash text-2xl mb-2 block"></i>
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ══════════════════════════════════════
            FOOTER
           ══════════════════════════════════════ */}
        <div className="px-4 py-2 text-sm text-blueGray-400 border-t">
          {filteredUsers.length} résultat(s) sur {users.length} utilisateur(s)
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MODAL GÉRER BADGES
         ══════════════════════════════════════════════════ */}
      {showModal && selectedUser && (
        <>
          <div className="modal-backdrop"></div>
          <div className="modal-container">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                <i className="fas fa-award text-amber-500 mr-2"></i>
                Gérer les Badges
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-blueGray-400 hover:text-red-500"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* User Info */}
            <div className="bg-blueGray-50 rounded-lg p-4 mb-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-lightBlue-200 flex items-center justify-center">
                <span className="font-bold text-lightBlue-700">
                  {selectedUser.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-bold text-blueGray-700">{selectedUser.name}</p>
                <p className="text-xs text-blueGray-400">{selectedUser.email}</p>
              </div>
              <span
                className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${
                  selectedUser.role === "ADMIN"
                    ? "bg-orange-100 text-orange-700"
                    : selectedUser.role === "CENTRE"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-lightBlue-100 text-lightBlue-700"
                }`}
              >
                {selectedUser.role}
              </span>
            </div>

            {/* Current Badges */}
            <div className="mb-4">
              <label className="block text-blueGray-600 text-sm font-bold mb-2">
                Badges actuels ({selectedUser.badges.length})
              </label>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {selectedUser.badges.length > 0 ? (
                  selectedUser.badges.map((badge, i) => (
                    <span
                      key={i}
                      className={`text-xs font-bold px-3 py-2 rounded-full inline-flex items-center gap-2 ${getBadgeStyle(
                        badge
                      )}`}
                    >
                      {badge}
                      <button
                        onClick={() => handleRemoveBadge(badge)}
                        className="w-4 h-4 rounded-full bg-red-200 text-red-600 flex items-center justify-center hover:bg-red-300 text-xs"
                        title="Supprimer"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-blueGray-300 italic py-2">
                    Aucun badge assigné
                  </span>
                )}
              </div>
            </div>

            {/* Add Badge (Select) */}
            <div className="mb-4">
              <label className="block text-blueGray-600 text-sm font-bold mb-2">
                Ajouter un badge
              </label>
              <div className="flex gap-2">
                <select
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="border rounded px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
                >
                  <option value="">-- Sélectionner un badge --</option>
                  {availableForUser.map((badge) => (
                    <option key={badge.name} value={badge.name}>
                      {badge.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddBadge}
                  disabled={!newBadge}
                  className={`px-4 py-2 rounded font-bold text-sm shadow transition-all ${
                    newBadge
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg"
                      : "bg-blueGray-200 text-blueGray-400 cursor-not-allowed"
                  }`}
                >
                  <i className="fas fa-plus mr-1"></i>
                  Ajouter
                </button>
              </div>
            </div>

            {/* Available Badges Quick Add */}
            <div className="mb-4">
              <label className="block text-blueGray-600 text-sm font-bold mb-2">
                Badges disponibles (cliquer pour ajouter)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableForUser.map((badge) => (
                  <button
                    key={badge.name}
                    onClick={() => handleQuickAddBadge(badge.name)}
                    className={`text-xs font-bold px-3 py-2 rounded-full ${badge.color} hover:opacity-80 transition-all cursor-pointer`}
                  >
                    <i className="fas fa-plus text-xs mr-1"></i>
                    {badge.name}
                  </button>
                ))}
                {availableForUser.length === 0 && (
                  <span className="text-xs text-blueGray-300 italic py-2">
                    Tous les badges sont assignés ✅
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
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

CardBadges.defaultProps = {
  color: "light",
};

CardBadges.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};