import PropTypes from 'prop-types';
import clsx from 'clsx';

const ButtonContainer = ({ children, className = '', align = 'center' }) => {
  const containerClasses = clsx(
    'flex gap-3 py-4',
    {
      'justify-end': align === 'right',
      'justify-start': align === 'left',
      'justify-center': align === 'center',
    },
    className
  );

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

ButtonContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

export default ButtonContainer;