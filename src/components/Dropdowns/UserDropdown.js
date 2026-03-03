// ═══════════════════════════════════════════════
// 📁 src/components/Dropdowns/ProfileDropdown.js
// ═══════════════════════════════════════════════

import React from "react";
import { createPopper } from "@popperjs/core";
import { Link, useHistory } from "react-router-dom";

const UserDropdown = () => {
  const history = useHistory();
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <img
              alt="..."
              className="w-full rounded-full align-middle border-none shadow-lg"
              src={require("assets/img/centerImg.webp").default}
            />
          </span>
        </div>
      </a>

      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <Link
          to="/centre/profile"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-blueGray-50"
          onClick={closeDropdownPopover}
        >
          <i className="fas fa-user text-blueGray-400 mr-2"></i>
          Mon Profile
        </Link>

        <Link
          to="/centre/settings"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-blueGray-50"
          onClick={closeDropdownPopover}
        >
          <i className="fas fa-cog text-blueGray-400 mr-2"></i>
          Settings
        </Link>

        <div className="h-0 my-2 border border-solid border-blueGray-100" />

        <button
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-red-500 hover:bg-red-50 text-left"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Déconnexion
        </button>
      </div>
    </>
  );
};

export default UserDropdown;