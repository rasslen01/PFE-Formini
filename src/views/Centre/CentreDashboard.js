// ═══════════════════════════════════════════════
// 📁 src/views/centre/CentreDashboard.js
// ═══════════════════════════════════════════════

import React, { useState, useEffect } from "react";

export default function CentreDashboard() {
  const [centre, setCentre] = useState({});

  const [stats] = useState({
    totalFormations: 12,
    totalStudents: 245,
    activeFormations: 8,
    completionRate: 78,
    revenue: 15400,
    pendingEnrollments: 18,
  });

  const [recentActivities] = useState([
    { id: 1, action: "New enrollment", student: "Ali Ben Ahmed", formation: "React Advanced", time: "2 min ago", icon: "fas fa-user-plus", color: "bg-emerald-500" },
    { id: 2, action: "Formation completed", student: "Sara Mansouri", formation: "JavaScript Basics", time: "1 hour ago", icon: "fas fa-check-circle", color: "bg-lightBlue-500" },
    { id: 3, action: "New review", student: "Mohamed Karim", formation: "Node.js API", time: "3 hours ago", icon: "fas fa-star", color: "bg-amber-500" },
    { id: 4, action: "Payment received", student: "Fatima Zahra", formation: "Python ML", time: "5 hours ago", icon: "fas fa-credit-card", color: "bg-purple-500" },
    { id: 5, action: "New enrollment", student: "Youssef Alami", formation: "Docker DevOps", time: "1 day ago", icon: "fas fa-user-plus", color: "bg-emerald-500" },
  ]);

  const [topFormations] = useState([
    { name: "React Advanced", students: 45, rating: 4.8, revenue: 3600 },
    { name: "Node.js API", students: 38, rating: 4.6, revenue: 3040 },
    { name: "Python ML", students: 32, rating: 4.9, revenue: 2880 },
    { name: "JavaScript Basics", students: 28, rating: 4.5, revenue: 1680 },
  ]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setCentre(user);
  }, []);

  return (
    <div className="pb-8">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-lightBlue-600 to-lightBlue-800 rounded-lg shadow-lg p-6 mb-8 text-black">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Welcome back, {centre.name || "Training Centre"} ! 🏫
            </h2>
            <p className="text-lightBlue-200">
              Here's what's happening with your formations today.
            </p>
          </div>
          <div className="hidden md:block">
            <i className="fas fa-building text-6xl text-lightBlue-300 opacity-50"></i>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blueGray-400 text-xs font-bold uppercase">Total Formations</p>
              <p className="text-3xl font-bold text-blueGray-700">{stats.totalFormations}</p>
              <p className="text-emerald-500 text-sm mt-1">
                <i className="fas fa-arrow-up mr-1"></i>{stats.activeFormations} active
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-lightBlue-100 flex items-center justify-center">
              <i className="fas fa-book text-lightBlue-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blueGray-400 text-xs font-bold uppercase">Total Students</p>
              <p className="text-3xl font-bold text-blueGray-700">{stats.totalStudents}</p>
              <p className="text-emerald-500 text-sm mt-1">
                <i className="fas fa-arrow-up mr-1"></i>+12 this week
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <i className="fas fa-users text-emerald-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blueGray-400 text-xs font-bold uppercase">Completion Rate</p>
              <p className="text-3xl font-bold text-blueGray-700">{stats.completionRate}%</p>
              <div className="w-full bg-blueGray-200 rounded-full h-2 mt-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }}></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <i className="fas fa-chart-pie text-amber-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blueGray-400 text-xs font-bold uppercase">Total Revenue</p>
              <p className="text-3xl font-bold text-blueGray-700">{stats.revenue}€</p>
              <p className="text-emerald-500 text-sm mt-1">
                <i className="fas fa-arrow-up mr-1"></i>+8.2% this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <i className="fas fa-euro-sign text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blueGray-400 text-xs font-bold uppercase">Pending Enrollments</p>
              <p className="text-3xl font-bold text-blueGray-700">{stats.pendingEnrollments}</p>
              <p className="text-orange-500 text-sm mt-1">
                <i className="fas fa-clock mr-1"></i>Awaiting approval
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <i className="fas fa-hourglass-half text-orange-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blueGray-400 text-xs font-bold uppercase">Average Rating</p>
              <p className="text-3xl font-bold text-blueGray-700">4.7 <span className="text-yellow-400 text-xl">★</span></p>
              <p className="text-blueGray-400 text-sm mt-1">Based on 156 reviews</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <i className="fas fa-star text-yellow-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Formations */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-blueGray-700">
              <i className="fas fa-trophy text-amber-500 mr-2"></i>Top Formations
            </h3>
            <a href="/centre/formations" className="text-lightBlue-500 text-xs font-bold">View All →</a>
          </div>
          <div className="p-6">
            {topFormations.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    i === 0 ? "bg-amber-500" : i === 1 ? "bg-blueGray-400" : i === 2 ? "bg-orange-400" : "bg-blueGray-300"
                  }`}>{i + 1}</span>
                  <div>
                    <p className="font-semibold text-sm text-blueGray-700">{f.name}</p>
                    <p className="text-xs text-blueGray-400">{f.students} students • ⭐ {f.rating}</p>
                  </div>
                </div>
                <span className="text-emerald-500 font-bold text-sm">{f.revenue}€</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b">
            <h3 className="font-bold text-blueGray-700">
              <i className="fas fa-clock text-lightBlue-500 mr-2"></i>Recent Activities
            </h3>
          </div>
          <div className="p-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 py-3 border-b last:border-0">
                <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                  <i className={`${activity.icon} text-white text-xs`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blueGray-700"><strong>{activity.action}</strong></p>
                  <p className="text-xs text-blueGray-400">{activity.student} - {activity.formation}</p>
                </div>
                <span className="text-xs text-blueGray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}