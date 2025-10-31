import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx'; // Pour gérer les classes conditionnelles
import Spinner from './Spinner'; // Composant de chargement

const ButtonForm = ({
  children,
  size = 'md',
  variant='default',
  isLoading=false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = " m-1 inline-flex cursor-pointer rounded-full  transition-all duration-200 ease-in-out ";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-400 text-brandblue  font-semibold w-full py-2 rounded hover:bg-gray-600  hover:text-gray-100 transition duration-300 ease-in saturate-150 flex justify-center",
    success: "bg-brandgreen text-brandblue font-semibold hover:text-brandgreen w-full hover:bg-brandblue focus:ring-brandblue flex justify-center",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
    outline_primary: "border-1 border-indigo-600 text-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500  hover:text-white",
    outline_secondary: "border-1 border-gray-300 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline_success:"border-1 border-green-300 text-green-600 hover:bg-green-700 focus:ring-green-500  hover:text-white  ",
    outline_danger:"border-1 border-red-300  text-red-600  hover:bg-red-700  focus:ring-red-600 hover:text-white ",
    outline_warning:"border-1 border-yellow-300  text-yellow-500  hover:bg-yellow-600  focus:ring-yellow-500   hover:text-white  ",
    ghost: "text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    default:' flex items-center justify-center text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 rounded-full',
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
    xl: "px-6 py-3 text-xl",
  };

  const iconSizes = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  };

  const buttonClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );

  const iconClasses = clsx(
    iconSizes[size],
    iconPosition === 'item-center' ? 'mr-2' : 'ml-1'
  );

  const renderIcon = () => {
    if (!icon) return null;
    return React.cloneElement(icon, {
      className: iconClasses,
      'aria-hidden': true,
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Spinner size={size} />
          <span className="ml-2">{children}</span>
        </>
      );
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        {iconPosition === 'center' && <span className="flex justify-center items-center">{renderIcon()}</span>}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

ButtonForm.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning','default']),
  variant: PropTypes.oneOf(['outline_primary','outline_secondary', 'outline_danger','outline_warning','outline_success','ghost','default','primary', 'secondary', 'success', 'danger', 'warning']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right','center']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ButtonForm;