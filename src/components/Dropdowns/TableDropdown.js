import React from "react";
import { createPopper } from "@popperjs/core";

const TableDropdown = ({ onEdit, onDelete }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  return (
    <>
      <a
        className="text-blueGray-500 py-1 px-3 cursor-pointer"
        href="#"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </a>

      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 py-2 rounded shadow-lg min-w-48"
        }
      >
        <button
          className="text-sm py-2 px-4 block w-full text-left hover:bg-gray-100"
          onClick={() => {
            onEdit();
            closeDropdownPopover();
          }}
        >
          Modifier
        </button>

        <button
          className="text-sm py-2 px-4 block w-full text-left text-red-600 hover:bg-gray-100"
          onClick={() => {
            onDelete();
            closeDropdownPopover();
          }}
        >
          Supprimer
        </button>
      </div>
    </>
  );
};

export default TableDropdown;
