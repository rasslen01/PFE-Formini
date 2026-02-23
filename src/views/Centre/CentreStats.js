// ═══════════════════════════════════════════════
// 📁 src/views/centre/CentreStats.js
// ═══════════════════════════════════════════════

import React, { useState } from "react";

export default function CentreStats() {
  const [period, setPeriod] = useState("month");

  const stats = {
    month: { enrollments: 45, completions: 28, revenue: 3600, avgRating: 4.7, topFormation: "React Advanced", dropRate: 8 },
    quarter: { enrollments: 120, completions: 85, revenue: 10200, avgRating: 4.6, topFormation: "Node.js API", dropRate: 12 },
    year: { enrollments: 450, completions: 320, revenue: 38400, avgRating: 4.7, topFormation: "React Advanced", dropRate: 10 },
  };

  const currentStats = stats[period];

  const formationStats = [
    { name: "React Advanced", enrolled: 45, completed: 32, revenue: 3600, rating: 4.8 },
    { name: "Node.js API", enrolled: 38, completed: 28, revenue: 2280, rating: 4.6 },
    { name: "Python ML", enrolled: 32, completed: 20, revenue: 2880, rating: 4.9 },
    { name: "JavaScript Basics", enrolled: 28, completed: 25, revenue: 1120, rating: 4.5 },
    { name: "Docker DevOps", enrolled: 22, completed: 15, revenue: 1760, rating: 4.4 },
  ];

  return (
    <div className="pb-8">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blueGray-800">
          <i className="fas fa-chart-bar text-lightBlue-500 mr-2"></i>Statistics
        </h2>
        <div className="flex gap-1 bg-blueGray-200 rounded-lg p-1">
          {[{ value: "month", label: "Month" }, { value: "quarter", label: "Quarter" }, { value: "year", label: "Year" }].map((p) => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded text-sm font-bold transition-all ${period === p.value ? "bg-white text-lightBlue-500 shadow" : "text-blueGray-500"}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-blueGray-400 font-bold uppercase">Enrollments</p>
              <p className="text-3xl font-bold text-blueGray-700">{currentStats.enrollments}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-lightBlue-100 flex items-center justify-center">
              <i className="fas fa-user-plus text-lightBlue-500 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-blueGray-400 font-bold uppercase">Completions</p>
              <p className="text-3xl font-bold text-blueGray-700">{currentStats.completions}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <i className="fas fa-check-circle text-emerald-500 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-blueGray-400 font-bold uppercase">Revenue</p>
              <p className="text-3xl font-bold text-blueGray-700">{currentStats.revenue}€</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <i className="fas fa-euro-sign text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-blueGray-400 font-bold uppercase">Avg Rating</p>
              <p className="text-3xl font-bold text-blueGray-700">{currentStats.avgRating} <span className="text-yellow-400">★</span></p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <i className="fas fa-star text-yellow-500 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-blueGray-400 font-bold uppercase">Top Formation</p>
              <p className="text-lg font-bold text-blueGray-700">{currentStats.topFormation}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <i className="fas fa-trophy text-amber-500 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-blueGray-400 font-bold uppercase">Drop Rate</p>
              <p className="text-3xl font-bold text-red-500">{currentStats.dropRate}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <i className="fas fa-user-minus text-red-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-blueGray-700"><i className="fas fa-chart-line text-emerald-500 mr-2"></i>Formation Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Formation", "Enrolled", "Completed", "Rate", "Revenue", "Rating"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left bg-blueGray-50 text-blueGray-500 text-xs uppercase font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formationStats.map((f, i) => {
                const rate = Math.round((f.completed / f.enrolled) * 100);
                return (
                  <tr key={i} className="border-b hover:bg-blueGray-50">
                    <td className="px-6 py-4 font-semibold text-sm">{f.name}</td>
                    <td className="px-6 py-4 text-sm">{f.enrolled}</td>
                    <td className="px-6 py-4 text-sm">{f.completed}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-blueGray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${rate >= 70 ? "bg-emerald-500" : rate >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${rate}%` }}></div>
                        </div>
                        <span className="text-xs font-bold">{rate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{f.revenue}€</td>
                    <td className="px-6 py-4 text-sm">⭐ {f.rating}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}