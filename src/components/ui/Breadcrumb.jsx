import  { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
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
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold  text-blue-primary text-right dark:text-white">
        {pageName}
      </h2>
      <nav aria-label="breadcrumb" className="w-max">
      <ol className="flex flex-wrap items-center w-full bg-blue-gray-50 bg-opacity-60 py-2 px-4 rounded-md">
        <li className="flex items-center text-blue-gray-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500">
          <Link 
            to="/" 
            className=" opacity-60 inline-flex items-center text-sm font-medium text-blue-primary hover:text-green-600"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Accueil
          </Link>
        </li>

        {/* Items du breadcrumb générés dynamiquement */}
        {breadcrumbItems.map((item, index) => (
          <li key={item.path}>
            <div className="flex items-center">
              <ChevronRightIcon className="w-5 h-5  text-blue-primary" />
              {index === breadcrumbItems.length - 1 ? (
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className=" opacity-60 ml-1 text-sm font-medium text-blue-primary hover:text-green-600 md:ml-2"
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