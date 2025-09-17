
import PropTypes from 'prop-types';

const Input = ({ 
  id,
  label,
  name,  
  type = 'text',
  placeholder,
  IconComponent,
  className = '',
  defaultValue = '',
  onChange,
  required = false,
  autoComplete = 'off'
}) => {
  return (
    <div className="relative">
        {IconComponent && (
            <div className='grid place-items-center absolute text-gray-500 top-2/4 right-3 -translate-y-2/4 w-5 h-5 dark:text-darktext-primary'>
            {IconComponent }
          </div>
        )}
        <input
          id={id}
          name={name}
          onChange={onChange}
          type={type}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={` text-gray-500 font-sans font-normal outline-none  hover:border-brandgreen w-full
          bg-transparent rounded-lg border px-4 border-gray-300 appearance-none   focus:outline-none focus:ring-0  peer focus:border-brandgreen  dark:border-darkborder ${className}`}/>
<label for="floating_filled"
                className="absolute text-sm text-gray-500  duration-300 transform-translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-brandgreen peer-focus:dark:text-brandgreen peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-valid:text-[12px] peer-valid:-translate-y-4 start-1
                dark:bg-surface dark:text-darktext-primary ">
  {label}
 </label>
</div>
  );
};

Input.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    type: PropTypes.oneOf([
      'text',
      'number',
      'email',
      'password',
      'tel',
      'search',
      'url'
    ]),
    placeholder: PropTypes.string,
    IconComponent: PropTypes.element,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    autoComplete: PropTypes.string
  };

export default Input;