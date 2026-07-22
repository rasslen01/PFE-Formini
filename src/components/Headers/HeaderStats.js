// ═══════════════════════════════════════════════
// 📁 src/components/Headers/HeaderStats.js
// Stats admin — données réelles depuis le backend
// ═══════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import CardStats from "components/Cards/CardStats.js";
import { getAllFormations } from "Services/ApiFormation";
import { getAllCentres } from "Services/ApiCentre";

export default function HeaderStats() {
  const [stats, setStats] = useState({
    totalFormations:     0,
    acceptedFormations:  0,
    pendingFormations:   0,
    totalCentres:        0,
    acceptedCentres:     0,
    pendingCentres:      0,
    totalRevenu:         0,
    formationsThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [formRes, centreRes] = await Promise.all([
          getAllFormations().catch(() => ({ data: { formationsList: [] } })),
          getAllCentres().catch(() => ({ data: {} })),
        ]);

        const formations = formRes.data?.formationsList || [];

        // ✅ Fix: supporter tous les formats possibles de réponse backend
        const centreData = centreRes.data;
        const centres =
          centreData?.centres       ||   // { centres: [...] }
          centreData?.centresList   ||   // { centresList: [...] }
          centreData?.centersList   ||   // { centersList: [...] }
          centreData?.data          ||   // { data: [...] }
          (Array.isArray(centreData) ? centreData : []);  // réponse directe tableau

        console.log("📦 centreRes.data:", centreData);
        console.log("✅ centres extraits:", centres.length, centres);

        const now = new Date();
        const thisMonth = formations.filter((f) => {
          if (!f.createdAt && !f.date) return false;
          const d = new Date(f.createdAt || f.date);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        });

        setStats({
          totalFormations:     formations.length,
          acceptedFormations:  formations.filter((f) => f.status === "accepted").length,
          pendingFormations:   formations.filter((f) => f.status === "pending").length,
          totalCentres:        centres.length,
          acceptedCentres:     centres.filter((c) => c.status === "accepted").length,
          pendingCentres:      centres.filter((c) => c.status === "pending").length,
          totalRevenu:         formations
            .filter((f) => f.status === "accepted")
            .reduce((s, f) => s + (Number(f.price) || 0), 0),
          formationsThisMonth: thisMonth.length,
        });
      } catch (err) {
        console.error("HeaderStats error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const acceptRate =
    stats.totalFormations > 0
      ? Math.round((stats.acceptedFormations / stats.totalFormations) * 100)
      : 0;

  return (
    <>
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {loading ? (
              <div className="text-center text-white py-4 text-sm">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Chargement des statistiques...
              </div>
            ) : (
              <div className="flex flex-wrap">

                {/* ── Total Formations ── */}
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="FORMATIONS"
                    statTitle={String(stats.totalFormations)}
                    statArrow="up"
                    statPercent={String(stats.pendingFormations)}
                    statPercentColor={stats.pendingFormations > 0 ? "text-orange-500" : "text-emerald-500"}
                    statDescripiron={`${stats.pendingFormations} en attente`}
                    statIconName="fas fa-graduation-cap"
                    statIconColor="bg-lightBlue-500"
                  />
                </div>

                {/* ── Centres ── */}
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="CENTRES"
                    statTitle={String(stats.totalCentres)}
                    statArrow="up"
                    statPercent={String(stats.pendingCentres)}
                    statPercentColor={stats.pendingCentres > 0 ? "text-orange-500" : "text-emerald-500"}
                    statDescripiron={`${stats.pendingCentres} en attente`}
                    statIconName="fas fa-building"
                    statIconColor="bg-orange-500"
                  />
                </div>

                {/* ── Revenu potentiel ── */}
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="REVENU POTENTIEL"
                    statTitle={stats.totalRevenu + " DT"}
                    statArrow="up"
                    statPercent={String(stats.acceptedFormations)}
                    statPercentColor="text-emerald-500"
                    statDescripiron={`${stats.acceptedFormations} formations acceptées`}
                    statIconName="fas fa-coins"
                    statIconColor="bg-emerald-500"
                  />
                </div>

                {/* ── Taux acceptation ── */}
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="TAUX ACCEPTATION"
                    statTitle={acceptRate + "%"}
                    statArrow={acceptRate >= 50 ? "up" : "down"}
                    statPercent={String(acceptRate)}
                    statPercentColor={acceptRate >= 50 ? "text-emerald-500" : "text-red-500"}
                    statDescripiron="Formations acceptées / total"
                    statIconName="fas fa-chart-pie"
                    statIconColor="bg-pink-500"
                  />
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}