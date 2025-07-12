//import React from 'react';
import PropTypes from 'prop-types';
import { IoSearchSharp } from "react-icons/io5";
import Input from './Input';

const Search = ({  type = 'text', name, value, onChange, label, datas  }) => {
      return (
  
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        data={datas}
         className='px-4 py-1.5'
        required
        IconComponent= {<IoSearchSharp className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"/>} />
  );
};

Search.propTypes = {
  //label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.node,
  datas: PropTypes.array,
};
export default Search;
