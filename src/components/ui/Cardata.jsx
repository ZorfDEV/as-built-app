import PropTypes from 'prop-types';

const CardSimple = ({ 
  title, 
  subtitle, 
  headerAction, 
  footerContent, 
  children, 
  className = '',
  noPadding = false 
}) => {
  return (
    <div className={` bg-white shadow-md rounded-2xl border dark:bg-surface
     border-gray-200 dark:border-darkborder  ${className}`}>
      {/* Header */}
      {(title || subtitle || headerAction) && (
        <div className="px-6  border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className=' flex-1 place-items-center py-2'>
              {title && (
                <h3 className="text-md font-semibold  pt-2 text-gray-800 dark:text-gray-100">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className=" text-sm text-gray-400 dark:text-darktext-secondary">
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && (
              <div className="ml-4">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      <div className={noPadding ? '' : 'p-0'}>
        {children}
      </div>

      {/* Footer */}
      {footerContent && (
        <div className="px-6 py-4  rounded-b-lg">
          {footerContent}
        </div>
      )}
    </div>
  );
};

CardSimple.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  headerAction: PropTypes.node,
  footerContent: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  noPadding: PropTypes.bool
};

export default CardSimple;