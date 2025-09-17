import React from 'react'
import { FaSearch, FaBell, FaUser, FaMoon, FaSun } from "react-icons/fa";
import { MdMenuOpen } from 'react-icons/md';
import { useAuth } from "./../../contexts/AuthContext";
import {AvatarMenu } from "./../ui/Avatars"
import Breadcrumb from '../ui/Breadcrumb';

 const Header = ({darkMode,toggleDarkMode}) => {
  const { user,logout } = useAuth();
  return (
    < div className={` flex  w-full z-50 items-center justify-between px-7 py-3 border-b-gray-200 dark:bg-surface dark:border-darkborder dark:border-b-1
     bg-[#edf1f0] shadow-lg dark:shadow-none `}>
       <Breadcrumb />
    <div className='flex items-center gap-4 '>
        <button className='cursor-pointer mr-6 rounded-full bg-slate-200 dark:bg-slate-600
        dark:text-darktext-primary transition-transform duration-200 hover:scale-105 shadow-md focus:outline-none'  onClick={toggleDarkMode} >
          { darkMode ? (<FaSun className='p-2 text-3xl' />):(<FaMoon  className='p-2 text-3xl'/>) }
        </button>
        <div className='flex items-center gap-3 '>
        <AvatarMenu 
         user={user}
         onLogout={logout}
        className="size-8 cursor-pointer bg-brandgreen text-white"
      />
        </div>
    </div>
    </div>
  )
}

export default Header
