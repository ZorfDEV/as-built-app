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
    <div className={`bg-white shadow-xl rounded-lg border dark:bg-gray-800 border-gray-200 ${className}`}>
      {/* Header */}
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className=' flex-1 place-items-center'>
              {title && (
                <h3 className="text-sm font-medium text-center  text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-400">
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