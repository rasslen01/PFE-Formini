import React from "react";
import { Link, useHistory } from "react-router-dom";

export default function StudentNavbar() {
  const navigate = useHistory();

  const handleLogout = () => {
    // supprime le token ou info étudiant (selon ton auth)
    localStorage.removeItem("token");
    navigate("/login"); // redirige vers login
  };

  return (
    <nav className="bg-blue-600 text-black p-4 flex justify-between items-center">
        
      <div className="font-bold text-xl">
        Formini
      </div>

      <div className="flex items-center gap-3">
  <Link 
    to="/dashboard" 
    className="text-lightBlue-500 bg-transparent border border-solid border-lightBlue-500 hover:bg-lightBlue-500 hover:text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none transition-all duration-150"
  >
    Accueil
  </Link>

  <Link 
    to="/formations" 
    className="text-lightBlue-500 bg-transparent border border-solid border-lightBlue-500 hover:bg-lightBlue-500 hover:text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none transition-all duration-150"
  >
    Formations
  </Link>

  <Link 
    to="/mes-inscriptions" 
    className="text-lightBlue-500 bg-transparent border border-solid border-lightBlue-500 hover:bg-lightBlue-500 hover:text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none transition-all duration-150"
  >
    Mes Inscriptions
  </Link>

  <Link 
    to="/profile" 
    className="text-lightBlue-500 bg-transparent border border-solid border-lightBlue-500 hover:bg-lightBlue-500 hover:text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none transition-all duration-150"
  >
    Profil
  </Link>

  <button 
    onClick={handleLogout} 
    className="bg-red-500 hover:bg-red-600 text-white font-bold uppercase text-xs px-4 py-2 rounded-full transition-all duration-150"
  >
    Déconnexion
  </button>
</div>

    </nav>
  );
}
