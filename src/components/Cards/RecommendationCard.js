import React from "react";

export default function RecommendationCard({ formation }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-black p-4 rounded-lg shadow-lg">
      <h4 className="font-bold text-lg">
        {formation.nom}
      </h4>

      <p className="text-sm">
        📍 {formation.ville} — {formation.domaine}
      </p>

      <p className="mt-2 font-semibold">
        Compatibilité IA : {formation.score}%
      </p>
    </div>
  );
}
