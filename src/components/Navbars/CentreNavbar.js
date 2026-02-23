// ═══════════════════════════════════════════════
// 📁 src/components/Navbars/CentreNavbar.js
// ═══════════════════════════════════════════════

import React from "react";
import { Link, useHistory } from "react-router-dom";
import UserDropdown from "components/Dropdowns/UserDropdown";

export default function CentreNavbar() {
  const history = useHistory();
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow h-12">
      <div className="w-full px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <Link
          className="text-blueGray-800 text-sm font-bold uppercase"
          to="/centre/dashboard"
        >
          Formini Centre
        </Link>

        {/* Mobile button */}
        <button
          className="lg:hidden text-blueGray-800 text-lg"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Menu */}
        <div
          className={
            "lg:flex items-center justify-end " +
            (navbarOpen ? "block" : "hidden lg:block")
          }
        >
          <ul className="flex flex-col lg:flex-row items-center lg:space-x-6">

            <li>
              <Link
                to="/centre/dashboard"
                className="text-blueGray-700 font-semibold text-xs uppercase px-2 py-1 hover:text-lightBlue-500"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/centre/formations"
                className="text-blueGray-700 font-semibold text-xs uppercase px-2 py-1 hover:text-lightBlue-500"
              >
                Formations
              </Link>
            </li>

            <li>
              <Link
                to="/centre/students"
                className="text-blueGray-700 font-semibold text-xs uppercase px-2 py-1 hover:text-lightBlue-500"
              >
                Students
              </Link>
            </li>

            <li>
              <Link
                to="/centre/calendar"
                className="text-blueGray-700 font-semibold text-xs uppercase px-2 py-1 hover:text-lightBlue-500"
              >
                Calendar
              </Link>
            </li>

            <li>
              <Link
                to="/centre/stats"
                className="text-blueGray-700 font-semibold text-xs uppercase px-2 py-1 hover:text-lightBlue-500"
              >
                Statistics
              </Link>
            </li>

            <li className="px-2">
              <UserDropdown />
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}