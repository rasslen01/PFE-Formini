import React from "react";
import { Link, useHistory } from "react-router-dom";
import ProfileDropdown from "components/Dropdowns/ProfileDropdown";

export default function StudentNavbar() {
  const history = useHistory();
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-blue-600 shadow-md h-16">  {/* h-16 = hauteur fixe */}
      <div className="w-full px-10 flex flex-wrap items-center justify-between">

        {/* Logo */}
        <Link
          className="text-white text-xl font-bold py-3 uppercase"
          to="/dashboard"
        >
          Formini
        </Link>

        {/* Mobile button */}
        <button
          className="lg:hidden text-white text-xl"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Menu */}
        <div
          className={
            "lg:flex flex-grow items-center justify-end " +
            (navbarOpen ? "block mt-4" : "hidden lg:block")
          }
        >
          <ul className="flex flex-col lg:flex-row items-center lg:space-x-14 space-y-4 lg:space-y-0">

            <li>
              <Link
                to="/dashboard"
                className="text-white font-bold uppercase px-3 py-2 hover:text-gray-200"
              >
                Accueil
              </Link>
            </li>

            <li>
              <Link
                to="/landing"
                className="text-white font-bold uppercase px-3 py-2 hover:text-gray-200"
              >
                Formations
              </Link>
            </li>

            <li>
              <Link
                to="/mes-inscriptions"
                className="text-white font-bold uppercase px-3 py-2 hover:text-gray-200"
              >
                Mes Inscriptions
              </Link>
            </li>

            <li className="px-3">
              <ProfileDropdown />
            </li>

            <li>
              
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}
