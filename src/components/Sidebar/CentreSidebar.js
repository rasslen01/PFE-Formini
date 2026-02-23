// ═══════════════════════════════════════════════
// 📁 src/components/Sidebar/CentreSidebar.js
// ═══════════════════════════════════════════════

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function CentreSidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      path: "/centre/dashboard",
      icon: "fas fa-tv",
      label: "Dashboard",
    },
    {
      path: "/centre/formations",
      icon: "fas fa-book",
      label: "Formations",
    },
    {
      path: "/centre/students",
      icon: "fas fa-users",
      label: "Students",
    },
    {
      path: "/centre/calendar",
      icon: "fas fa-calendar-alt",
      label: "Calendar",
    },
    {
      path: "/centre/stats",
      icon: "fas fa-chart-bar",
      label: "Statistics",
    },
    {
      path: "/centre/profile",
      icon: "fas fa-user-cog",
      label: "Centre Profile",
    },
  ];

  return (
    <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">

        {/* Brand */}
        <Link
          className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
          to="/centre/dashboard"
        >
          <i className="fas fa-building text-lightBlue-500 mr-2"></i>
          Training Centre
        </Link>

        {/* Mobile Toggle */}
        <button
          className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
          type="button"
          onClick={() =>
            setCollapseShow(collapseShow === "hidden" ? "bg-white m-2 py-3 px-6" : "hidden")
          }
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Navigation */}
        <div
          className={
            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
            collapseShow
          }
        >
          {/* Heading */}
          <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
            Management
          </h6>

          {/* Menu */}
          <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            {menuItems.map((item) => (
              <li className="items-center" key={item.path}>
                <Link
                  className={`text-xs uppercase py-3 font-bold block ${
                    isActive(item.path)
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500"
                  }`}
                  to={item.path}
                >
                  <i
                    className={`${item.icon} mr-2 text-sm ${
                      isActive(item.path)
                        ? "opacity-75"
                        : "text-blueGray-300"
                    }`}
                  ></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="my-4 md:min-w-full" />

          {/* Logout */}
          <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            <li className="items-center">
              <Link
                className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                to="/auth/login"
                onClick={() => {
                  localStorage.clear();
                }}
              >
                <i className="fas fa-sign-out-alt text-blueGray-300 mr-2 text-sm"></i>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}