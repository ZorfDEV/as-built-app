import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx'; // Pour gérer les classes conditionnelles
import Spinner from './Spinner'; // Composant de chargement

const ButtonForm = ({
  children,
  color = 'default',
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
  const baseStyles = " mr-4 inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  
  const colors = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    success: "bg-green-primary text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
    default:'',
    
  };

  const  variants = {
    outline_primary: "border-1 border-indigo-600 text-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500  hover:text-white",
    outline_secondary: "border-2 border-gray-300 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline_success:"border-2 border-gray-300 text-green-600 hover:bg-green-700 focus:ring-green-500  hover:text-white  ",
    outline_danger:"border-1 border-red-600  text-red-600  hover:bg-red-700  focus:ring-red-600 hover:text-white ",
    outline_warning:"border-2 border-yellow-500  text-yellow-500  hover:bg-yellow-600  focus:ring-yellow-500   hover:text-white  ",
    ghost: "text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    default:'',
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
    lg: "h-5 w-5",
    xl: "h-6 w-6",
  };

  const buttonClasses = clsx(
    baseStyles,
    variants[variant],
    colors[color],
    sizes[size],
    fullWidth && 'w-full',
    className
  );

  const iconClasses = clsx(
    iconSizes[size],
    iconPosition === 'left' ? 'mr-2' : 'ml-2'
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
  variant: PropTypes.oneOf(['outline_primary','outline_secondary', 'outline_danger','outline_warning','outline_success','ghost','default']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ButtonForm;