import { Outlet } from 'react-router-dom';
import React from 'react';
import Header from './Header';

const Maincontent = ({ toggleDarkMode, darkMode, toggleSidebar }) => {
  return (
   <div className=" maincotent flex-1 flex flex-col  h-screen bg-[#edf1f0] dark:bg-[#273943] ">
     
    {/* Header */}
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleSidebar={toggleSidebar} />
    
      {/* Display orders */}
      <div className="p-4 flex-1 overflow-y-auto">
        <Outlet />
      
    </div>
    </div>
  );
}
export default Maincontent;