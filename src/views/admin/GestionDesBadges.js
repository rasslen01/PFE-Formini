// ═══════════════════════════════════════════════
// 📁 src/views/admin/Badges.js
// ═══════════════════════════════════════════════

import React from "react";
import CardBadges from "components/Cards/CardBadges.js";

export default function GestionDesBadges() {
  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <CardBadges />
      </div>
    </div>
  );
}