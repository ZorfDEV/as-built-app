import {useState} from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/img/icone-humain.svg'; 
import { MdMenuOpen } from 'react-icons/md';
import { RiSettingsFill,RiMapPinAddFill,RiMap2Fill,RiMapPin2Fill} from "react-icons/ri"
import { FaTachometerAlt,FaUserCircle,FaUser,FaSearchLocation } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { useAuth } from "./../../contexts/AuthContext";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";

const Sidebarv2 = () => {
    const { user,logout } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const [openForm, setOpenForm] = useState(false);

  const toggleSearchForm = () => {
    setOpenForm(!openForm);
  };

     const menuItems = [
        { label: 'Accueil', path: '/dashboard/home', icon: FaTachometerAlt, name: 'Dashboard' },
        { label: ' Marqueur', path: '/dashboard/add-point', icon: RiMapPin2Fill, name: 'points' },
  
        { label: 'Section', path: '/dashboard/list-sections', icon: RiMap2Fill , name: 'Section' },
        { label: ' Réglages', path: '/dashboard/add-marqueur', icon: IoMdSettings, name: 'Réglages' },
      ]

  return (
   
      <motion.nav className={`shadow-md z-50 h-screen  p-2 duration-300  flex flex-col  bg-[#01a863]   ${isOpen ? "w-50" : "w-16"}`} layout>
        <div className="px-3 py-2 h-20 flex items-center justify-between">
            <img src={logo} alt="Logo" className={` rounded-md ${isOpen ? "w-8" : "w-0"}`} />
           <div><MdMenuOpen className={`text-white rounded-md cursor-pointer ${isOpen ? "" : "rotate-180"} duration-500`} size={30} onClick={toggleSidebar} /></div> 
        </div>
        <ul className='flex-1 '>
            {menuItems.map((item,index) => (
                <motion.li  whileHover={{
            scale: 1.05,
            backgroundColor: '#43ca92',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }} key={index} className=" px-3 py-2 my-2  rounded-md duration-300 flex gap-2 items-center  cursor-pointer relative group">
            <NavLink to={item.path} className={`flex items-center gap-2 ${isOpen ? "justify-start" : "justify-center"} text-white hover:text-white`}>
            <div><item.icon className="" size={20}/></div>
                <p className={`  ${isOpen ? "" : "w-0 translate-x-24 "} duration-500 overflow-hidden`} >{item.name}</p>
            </NavLink>
                <div className={` ${isOpen ? "hidden" : "  left-32"} absolute shadow-md  rounded-md w-0 p-0 overflow-hidden z-50 duration-300 group-hover:w-fit group-hover:p-2 group-hover:left-16 bg-white `} >{item.label}</div>
                </motion.li>
            ))}
            <motion.li  whileHover={{
            scale: 1.05,
            backgroundColor: '#43ca92',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}  onClick={toggleSearchForm}  className=" px-3 py-2 my-2  rounded-md duration-300 flex gap-2 items-center  cursor-pointer relative group">
            <div><RiMapPinAddFill size={20} className='text-white'/></div>
            <p className={`  ${isOpen ? "" : "w-0 translate-x-24 "} duration-500 overflow-hidden text-white`} >Ajouter</p>
            <div className={` ${isOpen ? "hidden" : "left-32"} absolute shadow-md  rounded-md w-0 p-0 overflow-hidden z-50 duration-300 group-hover:w-fit group-hover:p-2 group-hover:left-16 `} >Ajouter</div>
          </motion.li>
        </ul>
        <Menu as="div" className="flex items-center text-white gap-2 px-3 py-2 border-t mt-1">
        <MenuButton className="flex items-center gap-2 cursor-pointer">
        <FaUserCircle size={20 } />
        <div className={`leading-5 ${isOpen ? "" : "w-0 translate-x-24 "} duration-500 overflow-hidden `}>
    <p className="text-sm font-semibold">{user?.name}</p>
    <span className="text-xs text-green-800"> {user?.email}</span> 
        </div>
        </MenuButton>
        <MenuItems className="absolute left-0 top-100 m-4 w-40 origin-top-left bg-white rounded-md shadow-lg  ring-opacity-5 focus:outline-none">
          <MenuItem>
            <NavLink to={`/dashboard/user/profile/${user?.id}`} className="flex items-center px-4 py-2  text-sm text-gray-700 hover:bg-green-500 hover:text-white rounded-t-md">
             <FaUser className="h-4 w-4 mr-3" />
            <span className='text-xs text-center'>Profile</span>
            </NavLink>
          </MenuItem>
          <div className=" separator-h w-auto border border-gray-200"></div>
          <MenuItem>
            <button onClick={logout} className="flex items-center cursor-pointer px-4 py-2 text-sm w-full text-left  text-gray-700 hover:bg-green-500 hover:text-white rounded-b-md">
            <RiLogoutCircleRLine  className="h-4 w-4 mr-3" />
            <span className='text-xs text-center'>Déconnexion</span>
            </button>
          </MenuItem>
        </MenuItems>
        </Menu>
      </motion.nav>
  );
}   
export default Sidebarv2;