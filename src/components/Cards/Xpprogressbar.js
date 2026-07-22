// ═══════════════════════════════════════════════
// src/components/Cards/XPProgressBar.js
// Barre XP + niveau affichée sur le profil étudiant
// ═══════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import { getMyXP } from "../../Services/ApiBadges";

export default function XPProgressBar({ compact = false }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyXP()
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="animate-pulse h-6 bg-blueGray-100 rounded-full w-full" />
    );

  if (!data) return null;

  const { xp, level, levelName, progress, nextLevelXP } = data;

  // ── Version compacte (dans la navbar ou sidebar) ──
  if (compact)
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        <span className="text-xs font-bold text-lightBlue-600 whitespace-nowrap">
          Niv. {level}
        </span>
        <div className="flex-1 bg-blueGray-200 rounded-full h-2 min-w-0">
          <div
            className="bg-lightBlue-500 h-2 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-blueGray-500 whitespace-nowrap">
          {xp.toLocaleString()} XP
        </span>
      </div>
    );

  // ── Version complète (profil) ──────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blueGray-100 p-5">
      {/* Header niveau */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lightBlue-400 to-lightBlue-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">{level}</span>
          </div>
          <div>
            <p className="font-bold text-blueGray-700 text-lg leading-tight">
              Niveau {level}
            </p>
            <p className="text-sm text-lightBlue-500 font-semibold">{levelName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-500">
            {xp.toLocaleString()}
          </p>
          <p className="text-xs text-blueGray-400 uppercase tracking-wide">XP Total</p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="relative h-5 bg-blueGray-100 rounded-full overflow-hidden border border-blueGray-200">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
          }}
        >
          {/* Reflet lumineux */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white opacity-20 rounded-full" />
        </div>
        {/* Texte % centré */}
        <span
          className="absolute inset-0 flex items-center justify-center text-xs font-bold"
          style={{ color: progress > 45 ? "white" : "#64748b" }}
        >
          {progress}%
        </span>
      </div>

      {/* Légende sous la barre */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-blueGray-400">Niveau {level}</span>
        {nextLevelXP ? (
          <span className="text-xs text-blueGray-400">
            encore{" "}
            <span className="font-semibold text-lightBlue-500">
              {(nextLevelXP - xp).toLocaleString()} XP
            </span>{" "}
            → Niveau {level + 1}
          </span>
        ) : (
          <span className="text-xs text-amber-500 font-semibold">
            🏆 Niveau max atteint !
          </span>
        )}
      </div>
    </div>
  );
}