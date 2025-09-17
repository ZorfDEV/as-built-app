import Sidebarv2 from './../components/Layout/Sidebarv2';
import Maincontent2 from './../components/Layout/Maincontent2';
import { useState } from 'react';


const Dashboard = () => {

   const [darkMode, setDarkMode] = useState(false);
   const [isOpen, setIsOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    console.log("Dark mode toggled:", !darkMode);
  };
const toggleSidebar = () => {
    setIsOpen(!isOpen);
   };

  
  return (
    <div className={`flex min-h-screen bg-slate-200 dark:bg-darklayout ${darkMode && 'dark'} font-quicksand `}>
      {/* Sidebar */}
        <Sidebarv2 isOpen={isOpen}  toggleSidebar={toggleSidebar} />
      {/* Main Content */}
        <Maincontent2  toggleDarkMode={toggleDarkMode} darkMode={darkMode} isOpen={isOpen} />
    </div>
  )
};
export default Dashboard;