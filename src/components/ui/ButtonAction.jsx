import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  FiMoreVertical, 
  FiEdit2, 
  FiTrash2, 
  FiEye,
  FiChevronRight 
} from 'react-icons/fi';

const ActionButton = ({ 
  onView, 
  onEdit, 
  onDelete,
  itemId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    {
      id: 'view',
      label: 'Voir',
      icon: <FiEye className="w-4 h-4" />,
      handler: onView,
      className: 'text-gray-600 hover:text-indigo-800 hover:bg-indigo-50'
    },
    {
      id: 'edit',
      label: 'Modifier',
      icon: <FiEdit2 className="w-4 h-4" />,
      handler: onEdit,
      className: 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
    },
    {
      id: 'delete',
      label: 'Supprimer',
      icon: <FiTrash2 className="w-4 h-4" />,
      handler: onDelete,
      className: 'text-gray-600 hover:text-red-800 hover:bg-red-50'
    }
  ];

  const handleClick = (handler) => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(false);
      if (handler) {
        setTimeout(() => handler(itemId), 100);
      }
    };
  };

  return (
    <div className="relative inline-block text-left" ref={buttonRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`
          p-2 rounded-full transition-colors duration-200
          ${isOpen 
            ? 'bg-gray-100 text-gray-700' 
            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}
        `}
      >
        <FiMoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white 
            ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1">
            {actions.map((action) => !action.disabled && (
              <button
                key={action.id}
                type="button"
                className={`
                  w-full px-4 py-2 text-sm flex items-center justify-between
                  transition-colors duration-150 ${action.className}
                `}
                onClick={handleClick(action.handler)}
              >
                <span className="flex items-center gap-2">
                  {action.icon}
                  {action.label}
                </span>
                <FiChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ActionButton.propTypes = {
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  disableView: PropTypes.bool,
  disableEdit: PropTypes.bool,
  disableDelete: PropTypes.bool
};

export default ActionButton;