import PropTypes from 'prop-types';

const CardAuth = ({ footerContent, 
  children, 
  className = '',
  noPadding = false}) => {
    return (
        <div className={`bg-white shadow-xl rounded-lg border dark:bg-gray-800 border-gray-200 ${className}`}>
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
}
 
CardAuth.propTypes = {
  footerContent: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  noPadding: PropTypes.bool
};
export default CardAuth;