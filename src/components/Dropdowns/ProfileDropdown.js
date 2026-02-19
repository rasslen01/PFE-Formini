import React from "react";
import { createPopper } from "@popperjs/core";
import { Link, useHistory } from "react-router-dom";

const ProfileDropdown = () => {
  const history = useHistory();

  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.useRef(null);
  const popoverDropdownRef = React.useRef(null);

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-end",
    });
    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/auth/login");
  };

  return (
    <div className="relative">
      {/* Bouton icône profil */}
      <button
        ref={btnDropdownRef}
        onClick={() =>
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover()
        }
        className="text-white text-2xl hover:text-gray-200 transition"
      >
        <i className="fas fa-user-circle"></i>
      </button>

      {/* Dropdown */}
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 py-2 list-none text-left rounded shadow-lg mt-2 min-w-48"
        }
      >
        <Link
          to="/profile"
          className="text-sm py-2 px-4 block w-full hover:bg-gray-100"
          onClick={closeDropdownPopover}
        >
          Voir mon profil
        </Link>

        <Link
          to="/settingsStudents"
          className="text-sm py-2 px-4 block w-full hover:bg-gray-100"
          onClick={closeDropdownPopover}
        >
          Settings
        </Link>
        <Link
          to="/liste-favoris"
          className="text-sm py-2 px-4 block w-full hover:bg-gray-100"
          onClick={closeDropdownPopover}
        >
          Listes favoris
        </Link>

        <div className="h-0 my-2 border-t border-gray-200" />

        <button
          onClick={handleLogout}
          className="text-sm py-2 px-4 w-full text-left hover:bg-red-100 text-red-600"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
