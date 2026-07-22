import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

export default function CardUsersChart({ stats, loading = false }) {
  const chartRef      = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (loading || !stats) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Étudiants", "Centres", "Formations"],
        datasets: [{
          data: [
            stats.totalUsers      || 0,
            stats.totalCentres    || 0,
            stats.totalFormations || 0,
          ],
          backgroundColor: ["#38bdf8", "#a78bfa", "#34d399"],
          borderColor:     ["#0ea5e9", "#8b5cf6", "#10b981"],
          borderWidth: 2,
          hoverOffset: 6,
        }],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        cutoutPercentage: 68,
        legend: {
          display: true,
          position: "bottom",
          labels: { fontColor: "rgba(0,0,0,.4)", fontSize: 12, padding: 16, usePointStyle: true },
        },
        tooltips: {
          backgroundColor: "#1e293b",
          titleFontColor: "#94a3b8",
          bodyFontColor: "#f1f5f9",
        },
        animation: { animateScale: true },
      },
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [stats, loading]);

  const total = stats
    ? (stats.totalUsers || 0) + (stats.totalCentres || 0) + (stats.totalFormations || 0)
    : 0;

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
              Répartition
            </h6>
            <h2 className="text-blueGray-700 text-xl font-semibold">Données globales</h2>
          </div>
          {!loading && (
            <div className="bg-blueGray-100 rounded px-3 py-1">
              <span className="text-blueGray-600 text-sm font-bold">{total} total</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-350-px">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fas fa-spinner fa-spin text-3xl text-blueGray-300" />
            </div>
          ) : !stats ? (
            <div className="absolute inset-0 flex items-center justify-center text-blueGray-300 text-sm">
              Aucune donnée
            </div>
          ) : (
            <canvas ref={chartRef} />
          )}
        </div>
      </div>
    </div>
  );
}