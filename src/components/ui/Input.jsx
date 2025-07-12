
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
            <div className='grid place-items-center absolute text-gray-500 top-2/4 right-3 -translate-y-2/4 w-5 h-5'>
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
          className={` text-gray-500 font-sans font-normal outline-none border rounded-md hover:border-green-600 w-full
          duration-200 peer focus:border-green-600 focus:border-2 bg-inherit ${className}`}/>
<label  htmlFor={id} className="absolute left-0 top-2 px-1 text-sm/6 capitalize-first-letters tracking-wide peer-focus:text-green-600 text-gray-400
 pointer-events-none duration-200 peer-focus:text-[11px] peer-focus:-translate-y-5 peer-focus:bg-white ml-2 peer-valid:text-[11px] peer-valid:-translate-y-5 peer-valid:bg-white ">
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