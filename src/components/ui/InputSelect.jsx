import PropTypes from 'prop-types';
const InputSelect = ({id,datas, name , label,defaultValue,placeholder, type='text'})=>{
    return (
        <div className="relative">
        <select
        id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required
          type = {type}
          className="px-4 py-2 text-gray-500 font-sans font-normal outline-none border rounded-md hover:border-brandgreen w-full
          duration-200 peer focus:border-brandgreen bg-inherit dark:border-darkborder  focus:outline-none focus:ring-0 accent-brandgreen dark:accent-brandgreen ">
          <option value="" ></option>
          {datas.map((row) =>
            row._id === defaultValue ? (
              <option key={row.id} value={row._id} selected>
                {row.name}
              </option>
            ) : (
              <option key={row.id} value={row._id}>
                {row.name}
              </option>
            )
          )}
        </select>
        <label  htmlFor={id} className="absolute left-0 top-2 px-1 text-md uppercase tracking-wide peer-focus:text-brandgreen text-gray-400
 pointer-events-none duration-200 peer-focus:text-[11px] peer-focus:-translate-y-4 bg-white ml-2 peer-valid:text-[11px] peer-valid:-translate-y-4 jj dark:bg-surface dark:text-darktext-primary ">
  {label}
 </label>
      </div>
    );
}
InputSelect.propTypes = {
  id: PropTypes.string,
    datas: PropTypes.array,
    onChange: PropTypes.func,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
     defaultValue: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
              ]),
};
  
export default InputSelect; 