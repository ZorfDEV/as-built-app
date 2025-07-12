import { useState, useEffect } from 'react';
import { FiFilter } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import PropTypes from 'prop-types';


const ProductFilter = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category_id: '',
    locations_id: ''
  });

  useEffect(() => {
    
    // Récupérer les catégories
    axios.get(`/api/categories`).then((response) => {
      setCategories(response.data.categories);
    });
    // Récupérer les emplacements
    axios.get(`/api/locations`).then((response) => {
      setLocations(response.data.locations);
    });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({ category_id: '', locations_id: '' });
    onFilterChange({ category_id: '', locations_id: '' });
  };

  const hasActiveFilters = filters.category_id || filters.locations_id;

  return (
    <div className="relative">
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-2 px-4 py-2.5 
          text-sm font-medium rounded-lg transition-all
          ${hasActiveFilters 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}
          shadow-sm
        `}
      >
        <FiFilter className={`w-4 h-4 ${hasActiveFilters ? 'text-white' : 'text-gray-500'}`} />
        <span>Filtres</span>
        {hasActiveFilters && (
          <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-semibold text-white bg-indigo-500 rounded-full">
            {Object.values(filters).filter(Boolean).length}
          </span>
        )}
        <FaChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Panel de filtres */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <IoClose className="w-4 h-4" />
                  Réinitialiser
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Filtre Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  name="category_id"
                  value={filters.category_id}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-200 shadow-sm text-sm
                    focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre Emplacement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emplacement
                </label>
                <select
                  name="locations_id"
                  value={filters.locations_id}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-200 shadow-sm text-sm
                    focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Tous les emplacements</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border
                  border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Fermer
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600
                  border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
ProductFilter.propTypes = {
  onFilterChange: PropTypes.func,
};
export default ProductFilter;