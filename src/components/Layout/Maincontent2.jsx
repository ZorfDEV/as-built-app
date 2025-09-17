import { Outlet } from 'react-router-dom';
import Header2 from './Header2';

const Maincontent = ({ toggleDarkMode, darkMode, isOpen }) => {
  return (
  <div className={`flex-1 min-h-screen   bg-slate-200 ${isOpen ? "md:ml-44":"ml-16"} transition-all duration-300
    dark:bg-darklayout z-10 sm:w-full`}>
 <Header2 toggleDarkMode={toggleDarkMode} darkMode={darkMode}  />
       <Outlet context={{ darkMode, isOpen }} />
    </div>
  );
}
export default Maincontent;