import Sidebar from './../components/Layout/Sidebar';
import Maincontent from './../components/Layout/Maincontent';
import { useState } from 'react';


const Dashboard = () => {

   const [darkMode, setDarkMode] = useState(false);
   const [isOpen, setIsOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
   };

  return (
    <div className={`${darkMode && 'dark'} font-quicksand`}>
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Sidebar */}
        <Sidebar isOpen={isOpen} />
      {/* Main Content */}
        <Maincontent toggleDarkMode={toggleDarkMode} darkMode={darkMode}  toggleSidebar={toggleSidebar}/>
    </div>
    </div>
  )
};
export default Dashboard;