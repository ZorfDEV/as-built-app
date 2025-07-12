import Sidebarv2 from './../components/Layout/Sidebarv2';
import Maincontent2 from './../components/Layout/Maincontent2';
import { useState } from 'react';


const Dashboard = () => {

   const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

 

  return (
    <div className={`${darkMode && 'dark'} font-quicksand`}>
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Sidebar */}
        <Sidebarv2 />
      {/* Main Content */}
        <Maincontent2 toggleDarkMode={toggleDarkMode} darkMode={darkMode}  />
    </div>
    </div>
  )
};
export default Dashboard;