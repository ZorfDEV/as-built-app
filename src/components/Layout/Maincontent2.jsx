import { Outlet } from 'react-router-dom';
//import React from 'react';
//import {  FaMoon, FaSun } from "react-icons/fa";
const Maincontent = () => {
  return (
   <div className=" maincotent flex-1 flex flex-col  h-screen bg-[#edf1f0] dark:bg-[#273943] ">
    
      {/* Display orders */}
      <div className="p-0 flex-1  z-20 overflow-y-auto">
        <Outlet />
      
    </div>
    </div>
  );
}
export default Maincontent;