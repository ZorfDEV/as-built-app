import { useState, useRef, useEffect } from "react";
import {FaUser} from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import PropTypes from "prop-types";
import clsx from "clsx";

export function AvatarMenu({ user, onLogout,className }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu si on clique à l’extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex items-center justify-center size-8 font-semibold",
          "transition-transform duration-500 hover:scale-105 shadow-md focus:outline-none",
          user?.avatarUrl ? "overflow-hidden" : "",
          "rounded-full", className
        )}
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name || "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{user?.name?.[0] || <FaUser className="w-4 h-4" />}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg  ring-1 ring-gray-300 ring-opacity-5 focus:outline-none z-5000 dark:bg-surface 
          dark:ring-darkborder"
        >
          <div className="p-2">
            <a
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md dark:text-darktext-primary dark:hover:bg-darkaccent dark:hover:text-brandblue"
            >
              <FaUser className="w-4 h-4 " />
              Voir le profil
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md dark:hover:bg-red-600 dark:hover:text-white"
            >
              < RiLogoutCircleRLine  className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

AvatarMenu.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};
