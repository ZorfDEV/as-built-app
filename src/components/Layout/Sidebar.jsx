import { NavLink, useLocation } from 'react-router-dom'; 
import { RiSettingsFill,RiMapPinAddFill,RiMap2Fill,RiMapPin2Fill} from "react-icons/ri"
import { FaTachometerAlt,FaClipboardList } from "react-icons/fa";
import axioneCouleur from '../../assets/img/axione-fondblanc.svg';
import userAxione from '../../assets/img/icone-humain.svg';

export default function Sidebar({isOpen}) {
  const location = useLocation();
  const menu = [
    { label: 'Accueil', path: '/dashboard/home', icon: FaTachometerAlt, name: 'Dashboard' },
    { label: ' Marqueur', path: '/dashboard/add-marqueur', icon: RiMapPin2Fill, name: 'Marqueur' },
    { label: 'Point', path: '/dashboard/add-point', icon: RiMapPinAddFill, name: 'Point' },
    { label: 'Section', path: '/dashboard/add-section', icon: RiMap2Fill , name: 'Section' },
    { label: ' Réglages', path: '/dashboard/settings', icon: RiSettingsFill, name: 'Réglages' },
  ]

  const navLinkStyles = {
    base: "relative flex dark:hover:bg-[#273943] items-center h-[50px] mb-4 transition-all duration-500 rounded-tl-[30px] rounded-bl-[30px] cursor-pointer hover:bg-[#edf1f0] hover:text-[#01a863]",
    active: "mb-6 text-green-600 bg-[#edf1f0] rounded-tl-[30px] rounded-bl-[30px]",
    inactive: "text-white",
    icon: {
      base: "icon min-w-10 h-10 flex justify-center items-center mr-2 transition-all duration-500",
      active: "text-green-600"
    },
    text: {
      base: "pl-0 pr-3",
      active: "text-green-600"
    },
    curveTop: {
      base: "absolute bg-transparent top-[-50px] right-0 w-[50px] h-[50px] rounded-full transition-all duration-0 pointer-events-none group-hover:shadow-[35px_35px_0_10px_#edf1f0] dark:group-hover:shadow-[35px_35px_0_10px_#273943]",
      active: "absolute bg-transparent top-[-50px] right-0 w-[50px] h-[50px] rounded-full transition-all duration-0 pointer-events-none shadow-[35px_35px_0_10px_#edf1f0] dark:shadow-[35px_35px_0_10px_#273943]"
    },
    curveBottom: {
      base: "absolute bg-transparent bottom-[-50px] right-0 w-[50px] h-[50px] rounded-full transition-all duration-0 pointer-events-none group-hover:shadow-[35px_-35px_0_10px_#edf1f0] dark:group-hover:shadow-[35px_-35px_0_10px_#273943]",
      active: "absolute bg-transparent bottom-[-50px] right-0 w-[50px] h-[50px] rounded-full transition-all duration-0 pointer-events-none shadow-[35px_-35px_0_10px_#edf1f0] dark:shadow-[35px_-35px_0_10px_#273943]"
    }
  };

  return (
    <div className={`h-screen bg-[#01a863] border-solid transition-all duration-500 overflow-hidden dark:bg-[#384a54] ${isOpen ? "w-50" : "w-16"}`}>
      <div className='ml-0 top-0'>
        <img
          alt="Axione Gabon"
          src={isOpen ? axioneCouleur : userAxione}
          style={isOpen ? { width: '100%', height: '100%' } : { width: '50%', height: '100%', marginTop: '10px', marginLeft: '15px' }}
        />
      </div>
      <ul className="mt-8 pl-2.5">
        {menu.map((item) => (
          <li key={item.label} className="relative group w-full">
            <div className='flex justify-between relative'>
              {!isOpen && (
                <span className="absolute bg-amber-400 left-20 top-2 z-1000  text-gray-700 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm whitespace-nowrap">
                  {item.label}
                </span>
              )}
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  ${navLinkStyles.base}
                  ${isOpen ? 'w-[190px]' : 'w-full'}
                  ${isActive ? navLinkStyles.active : navLinkStyles.inactive}
                `}
              >
                <span className={`
                  ${navLinkStyles.icon.base}
                  ${location.pathname === item.to ? navLinkStyles.icon.active : ''}
                `}>
                  <item.icon className="h-6 w-6" />
                </span>
                <span className={`
                  ${navLinkStyles.text.base}
                  ${isOpen ? 'block duration-500' : 'hidden duration-500'}
                  ${location.pathname === item.path ? navLinkStyles.text.active : ''}
                `}>
                  {item.name}
                </span>
                <span className={`
                  ${navLinkStyles.curveTop.base}
                  ${location.pathname === item.path ? navLinkStyles.curveTop.active : ''}
                `}></span>
                <span className={`
                  ${navLinkStyles.curveBottom.base}
                  ${location.pathname === item.path ? navLinkStyles.curveBottom.active : ''}
                `}></span>
              </NavLink>
              
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
