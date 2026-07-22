// ═══════════════════════════════════════════════
// src/views/admin/Leaderboard.js
// Classement des étudiants par XP
// ═══════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../../Services/ApiBadges";

const MEDALS = ["🥇", "🥈", "🥉"];

const LEVEL_COLORS = {
  1: "bg-blueGray-100 text-blueGray-600",
  2: "bg-lightBlue-100 text-lightBlue-700",
  3: "bg-teal-100 text-teal-700",
  4: "bg-green-100 text-green-700",
  5: "bg-emerald-100 text-emerald-700",
  6: "bg-yellow-100 text-yellow-700",
  7: "bg-orange-100 text-orange-700",
  8: "bg-red-100 text-red-700",
  9: "bg-purple-100 text-purple-700",
  10: "bg-amber-100 text-amber-800",
};

export default function Leaderboard() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getLeaderboard()
      .then((r) => setUsers(r.data))
      .catch(() => setError("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  const getLevelColor = (level) =>
    LEVEL_COLORS[Math.min(level, 10)] || LEVEL_COLORS[10];

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">

        {/* ── Podium Top 3 ────────────────────────── */}
        {!loading && users.length >= 3 && (
          <div className="flex justify-center items-end gap-4 mb-8">
            {/* 2ème place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blueGray-200 flex items-center justify-center text-3xl shadow border-4 border-blueGray-300 mb-2">
                {users[1]?.name?.charAt(0)}
              </div>
              <p className="text-sm font-bold text-blueGray-700 truncate max-w-24 text-center">
                {users[1]?.name}
              </p>
              <p className="text-xs text-blueGray-400">{users[1]?.xp?.toLocaleString()} XP</p>
              <div className="w-20 h-20 bg-blueGray-300 rounded-t-lg flex items-center justify-center mt-2">
                <span className="text-3xl">🥈</span>
              </div>
            </div>
            {/* 1ère place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-amber-200 flex items-center justify-center text-4xl shadow-lg border-4 border-amber-400 mb-2">
                {users[0]?.name?.charAt(0)}
              </div>
              <p className="text-sm font-bold text-blueGray-700 truncate max-w-24 text-center">
                {users[0]?.name}
              </p>
              <p className="text-xs text-amber-500 font-bold">{users[0]?.xp?.toLocaleString()} XP</p>
              <div className="w-20 h-28 bg-amber-400 rounded-t-lg flex items-center justify-center mt-2">
                <span className="text-3xl">🥇</span>
              </div>
            </div>
            {/* 3ème place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-3xl shadow border-4 border-orange-300 mb-2">
                {users[2]?.name?.charAt(0)}
              </div>
              <p className="text-sm font-bold text-blueGray-700 truncate max-w-24 text-center">
                {users[2]?.name}
              </p>
              <p className="text-xs text-blueGray-400">{users[2]?.xp?.toLocaleString()} XP</p>
              <div className="w-20 h-14 bg-orange-300 rounded-t-lg flex items-center justify-center mt-2">
                <span className="text-3xl">🥉</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Tableau complet ──────────────────────── */}
        <div className="relative flex flex-col w-full mb-6 shadow-lg rounded bg-white">
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <h3 className="font-semibold text-xl text-blueGray-700">
                Classement des Étudiants
              </h3>
            </div>
            <span className="text-xs text-blueGray-400 bg-blueGray-100 px-3 py-1 rounded-full">
              Top {users.length}
            </span>
          </div>

          {/* Corps */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <i className="fas fa-spinner fa-spin text-3xl text-lightBlue-500 mr-3" />
              <span className="text-blueGray-400">Chargement...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center py-10 text-red-500">
              <i className="fas fa-exclamation-triangle mr-2" /> {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blueGray-50">
                    {["Rang", "Étudiant", "Niveau", "XP", "Badges"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-blueGray-500 text-xs uppercase font-semibold tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr
                      key={user._id}
                      className={`border-b transition-colors ${
                        i === 0
                          ? "bg-amber-50 hover:bg-amber-100"
                          : i === 1
                          ? "bg-blueGray-50 hover:bg-blueGray-100"
                          : i === 2
                          ? "bg-orange-50 hover:bg-orange-100"
                          : "hover:bg-blueGray-50"
                      }`}
                    >
                      {/* Rang */}
                      <td className="px-6 py-4 text-xl font-bold">
                        {MEDALS[i] ? (
                          <span>{MEDALS[i]}</span>
                        ) : (
                          <span className="text-sm text-blueGray-400 font-bold">
                            #{i + 1}
                          </span>
                        )}
                      </td>

                      {/* Étudiant */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                              i === 0
                                ? "bg-amber-200 text-amber-800"
                                : "bg-lightBlue-100 text-lightBlue-700"
                            }`}
                          >
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-semibold text-blueGray-700">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* Niveau */}
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${getLevelColor(
                            user.level || 1
                          )}`}
                        >
                          Niv. {user.level || 1}
                        </span>
                      </td>

                      {/* XP */}
                      <td className="px-6 py-4">
                        <span
                          className={`font-bold ${
                            i === 0 ? "text-amber-500 text-lg" : "text-blueGray-700"
                          }`}
                        >
                          {(user.xp || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-blueGray-400 ml-1">XP</span>
                      </td>

                      {/* Badges */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-1">
                          {(user.badges || []).slice(0, 5).map((b) => (
                            <span
                              key={b._id}
                              title={b.name}
                              className="text-xl leading-none"
                            >
                              {b.icon || "🏅"}
                            </span>
                          ))}
                          {(user.badges?.length || 0) > 5 && (
                            <span className="text-xs text-blueGray-400 bg-blueGray-100 px-2 py-0.5 rounded-full">
                              +{user.badges.length - 5}
                            </span>
                          )}
                          {(user.badges?.length || 0) === 0 && (
                            <span className="text-xs text-blueGray-300 italic">
                              Aucun badge
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && (
            <div className="px-6 py-3 border-t text-xs text-blueGray-400">
              {users.length} étudiant(s) classé(s) · Mise à jour en temps réel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}