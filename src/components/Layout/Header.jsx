import { FaSearch, FaBell, FaUser, FaMoon, FaSun } from "react-icons/fa";
import { HiOutlineMenuAlt2} from "react-icons/hi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

import { useAuth } from "./../../contexts/AuthContext";
import userAxione from "../../assets/img/light-axione-logo.svg";
import { useNavigate } from "react-router-dom";


const Header = ({darkMode, toggleDarkMode,toggleSidebar}) => {

    const { user,logout } = useAuth();
     const navigate = useNavigate();

    const handleClick = () => {
    navigate(`/dashboard/user/profile/${user.id}`);
};

  return (
  <header className="  w-full border-b-gray-200 dark:bg-[#263940] dark:border-gray-700 dark:border-b-1 bg-white/80 shadow-lg dark:shadow-none">
<div className="px-2 py-3 lg:px-5 lg:py-3">
        <div className="flex  items-center justify-between">
            <div className="flex items-center justify-start  rtl:justify-end">
                <button className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg  
                 hover:bg-gray-200 hover:outline-none focus:outline-none focus:ring-2 focus:ring-gray-200
                 dark:bg-[#384a54] dark:text-gray-400 dark:hover:bg-gray-700
                  dark:focus:ring-gray-600" > 
                    <HiOutlineMenuAlt2 className="text-2xl  dark:text-gray-400" onClick={toggleSidebar} />
                </button>
        </div>
        <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-50">
                      <div>
                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-900">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            alt=""
                            src={userAxione}
                            className="h-8 w-8 rounded-full" />
                        </MenuButton>
                      </div>
                      
                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        <MenuItem className="block">
                        <div className='flex items-center px-4 py-2 text-sm text-gray-700'>
                          <img alt="" src={userAxione} className="h-4 w-4 mr-3 rounded-full border-green-primary" />
                          <span className='text-sm text-center'>{user?.name}</span>
                        </div>
                        </MenuItem>
                        <div className=" separator-h w-auto border border-gray-200"></div>
                        <MenuItem className="block">
                        <button className='flex items-center  w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-primary hover:text-white' onClick={handleClick}>
                          <FaUser className="h-4 w-4 mr-3" />
                          <span className='text-xs text-center'>Profile</span>
                        </button>
                  
                        </MenuItem>
                        <MenuItem className="block">
        
                          <button className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-primary hover:text-white' onClick={logout}>
                            <RiLogoutCircleRLine className="h-4 w-4 mr-3" />
                            <span> Déconnexion</span>
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </div>
                </div>
        <div className="flex items-center justify-end  rtl:justify-start">
            <button className="inline-flex items-center p-2 text-sm text-gray-500 rounded-full 
            sm:hidden lg:inline-flex md:inline-flex xl:inline-flex hover:bg-gray-100 focus:outline-none focus:ring-2
             focus:ring-gray-200 dark:text-gray-400 dark:bg-[#384a54]
              dark:hover:bg-gray-700 dark:focus:ring-gray-600" onClick={toggleDarkMode}>
                {darkMode ? <FaSun />: <FaMoon/>}
                
            </button>
            
        </div>
        </div>
</div>
    </header>
  );
}
export default Header;
// This is a simple header component for a React application.