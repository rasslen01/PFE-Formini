import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const MONTHS_FR = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

export default function CardInscriptionsChart({ data = [], loading = false }) {
  const chartRef      = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (loading || !data.length) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const labels = data.map((d) => `${MONTHS_FR[d._id.month - 1]} ${d._id.year}`);
    const values = data.map((d) => d.count);

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Inscriptions",
          backgroundColor: "rgba(56,189,248,0.15)",
          borderColor: "#38bdf8",
          pointBackgroundColor: "#0ea5e9",
          pointBorderColor: "#fff",
          pointRadius: 5,
          pointHoverRadius: 7,
          data: values,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: { display: false },
        tooltips: {
          mode: "index",
          intersect: false,
          backgroundColor: "#1e293b",
          titleFontColor: "#94a3b8",
          bodyFontColor: "#f1f5f9",
        },
        scales: {
          xAxes: [{ ticks: { fontColor: "rgba(255,255,255,.7)" }, gridLines: { display: false } }],
          yAxes: [{
            ticks: { fontColor: "rgba(255,255,255,.7)", stepSize: 1, beginAtZero: true },
            gridLines: { borderDash: [3], color: "rgba(255,255,255,0.1)", drawBorder: false },
          }],
        },
      },
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [data, loading]);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
              Vue d'ensemble
            </h6>
            <h2 className="text-white text-xl font-semibold">Inscriptions par mois</h2>
          </div>
          {data.length > 0 && (
            <div className="bg-white bg-opacity-10 rounded px-3 py-1">
              <span className="text-lightBlue-200 text-sm font-bold">
                {data.reduce((s, d) => s + d.count, 0)} total
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-350-px">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fas fa-spinner fa-spin text-3xl text-lightBlue-300" />
            </div>
          ) : data.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-blueGray-400">
              <i className="fas fa-chart-line text-4xl mb-3 opacity-30" />
              <p className="text-sm opacity-50">Pas encore de données</p>
            </div>
          ) : (
            <canvas ref={chartRef} />
          )}
        </div>
      </div>
    </div>
  );
}