import { NavLink } from 'react-router-dom';
import logo from '../../assets/img/axione-gabon.png';
import logoMin from '../../assets/img/icone-humain.svg';  
import { MdMenuOpen } from 'react-icons/md';
import { RiMap2Fill, RiMapPin2Fill } from "react-icons/ri";
import { AiFillAlert } from "react-icons/ai";
import { BsIntersect } from "react-icons/bs";
import { HiMiniUsers } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import { RiScissorsCutFill } from "react-icons/ri";

const Sidebarv2 = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { label: 'Carte', path: '/dashboard/home', icon: RiMap2Fill, name: 'Dashboard' },
    { label: 'Lieux', path: '/dashboard/list-points', icon: RiMapPin2Fill, name: 'Points' },
    { label: 'Incidents', path: '/dashboard/incidents', icon: RiScissorsCutFill, name: 'Incidents' },
    { label: 'Section', path: '/dashboard/list-sections', icon: BsIntersect, name: 'Section' },
    { label: 'Utilisateurs', path: '/dashboard/list-users', icon: HiMiniUsers, name: 'Utilisateurs' },
    { label: 'Réglages', path: '/dashboard/settings', icon: IoMdSettings, name: 'Réglages' },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-brandblue text-white transition-all z-50 flex flex-col duration-300  
        ${isOpen ? "w-44 " : "w-16 items-center"}  
        dark:bg-black/10 dark:border-darkborder dark:border-r-1 dark:text-darktext-primary`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center py-3">
        <img src={logo} alt="Logo" className={`${isOpen ? "w-30" : "hidden"}`} />
        <img src={logoMin} alt="Logo" className={`${isOpen ? "hidden" : "w-8"}`} />
      </div>

      {/* Menu items */}
      <ul className="flex-1 mt-6">
        {menuItems.map((item, index) => (
          <li key={index} className="m-4">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md duration-300 cursor-pointer relative group 
                ${isActive
                  ? "bg-brandgreen text-blue-950 font-semibold"
                  : "hover:bg-brandgreen hover:text-brandblue"}`
              }
            >
              <item.icon size={20} />
              <p
                className={`${isOpen ? "ml-4" : "w-0 translate-x-24"} duration-500 overflow-hidden`}
              >
                {item.name}
              </p>
              {/* Tooltip pour menu fermé */}
              <div
                className={`${
                  isOpen ? "hidden" : "left-32"
                } absolute shadow-md rounded-md w-0 p-0 overflow-hidden bg-brandblue text-brandgreen z-50 
                duration-200 group-hover:w-fit group-hover:p-2 group-hover:left-16 
                dark:bg-white dark:text-black`}
              >
                {item.label}
              </div>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Bouton toggle sidebar */}
      <button
        onClick={toggleSidebar}
        className="cursor-pointer m-3 flex items-center justify-center
        rounded-md bg-blue-950 p-2 text-2xl text-white
        font-bold hover:bg-brandgreen hover:text-brandblue duration-300 
        dark:bg-surface dark:text-darktext-primary 
        dark:hover:bg-brandgreen dark:hover:text-brandblue"
      >
        <MdMenuOpen
          className={`cursor-pointer ${isOpen ? "" : "rotate-180"} duration-500`}
          size={30}
        />
      </button>
    </div>
  );
};

export default Sidebarv2;
