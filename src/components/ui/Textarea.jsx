import PropTypes from 'prop-types';

const Textarea = ({
    id,
    name,
    placeholder = '',
    rows = 4,
    defaultValue,
    value,
    onChange,
    type,
    disabled = false,
    className = '',
    required = false,
    maxLength,
    label
}) => {
    const baseClasses = "w-full px-3 py-2 border rounded-lg text-gray-500 font-sans font-normal outline-none  rounded-md hover:border-green-600 duration-200 peer focus:border-green-600 bg-inherit";
    const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white";
    
    return (
        <div className="relative flex-col gap-2">
            <textarea
                id={id}
                name={name}
                type = {type}
                placeholder={placeholder}
                rows={rows}
                defaultValue={defaultValue}
                onChange={onChange}
                value = {value}
                disabled={disabled}
                required={required}
                maxLength={maxLength}
                className={`${baseClasses} ${disabledClasses} ${className}`}
            />
<label  htmlFor={id} className="absolute left-0 top-2 px-1 text-md uppercase tracking-wide peer-focus:text-green-600 text-gray-400
pointer-events-none duration-200 peer-focus:text-[11px] peer-focus:-translate-y-4 bg-white ml-2 peer-valid:text-[11px] peer-valid:-translate-y-4 ">
{label}
</label>  
            {maxLength && (
                <div className="text-xs text-gray-500 text-right">
                    {/*value.length}/{maxLength*/}
                </div>
            )}
            
        </div>
    );
};

Textarea.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    required: PropTypes.bool,
    maxLength: PropTypes.number,
    label: PropTypes.string,
     defaultValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
          ]),
};

export default Textarea;