import  { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LiaHomeSolid } from "react-icons/lia";
import { RxChevronRight } from "react-icons/rx";
import PropTypes from 'prop-types';

const Breadcrumb = ({ pageName }) => {
  const location = useLocation();

  const breadcrumbItems = useMemo(() => {
    // Supprime les slashes au début et à la fin
    const pathnames = location.pathname
      .split('/')
      .filter(x => x);

    // Construit les items du breadcrumb avec les chemins cumulatifs
    return pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return { label, path: routeTo };
    });
  }, [location]);

  // Si on est sur la page d'accueil, ne pas afficher le breadcrumb
  if (location.pathname === '/') return null;

  return (
    <div className=" flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold  text-brandblue text-right dark:text-white">
        {pageName}
      </h2>
      <nav aria-label="breadcrumb" className="w-max">
      <ol className="flex flex-wrap items-center w-full py-2 px-4 rounded-md">
        <li className="flex items-center pr-4 text-sm font-normal leading-normal cursor-pointer transition-colors duration-300">
          <Link 
            to="/dashboard" 
            className=" inline-flex items-center text-sm font-medium text-brandblue hover:text-brandgreen
             dark:text-darktext-primary dark:hover:text-brandgreen"
          >
            <LiaHomeSolid className="w-4 h-4 mr-2" />
            Accueil
          </Link>
        </li>

        {/* Items du breadcrumb générés dynamiquement */}
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center text-sm cursor-pointer transition-colors text-brandblue dark:text-darktext-primary duration-300">
            <div className="flex items-center">
              <RxChevronRight className="w-4 h-4" />
              {index === breadcrumbItems.length - 1 ? (
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="  ml-1 text-sm font-medium  hover:text-brandgreen md:ml-2"
                >
                  {item.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
    </div>
  );
};

Breadcrumb.propTypes = {
  pageName: PropTypes.string,
};
export default Breadcrumb;