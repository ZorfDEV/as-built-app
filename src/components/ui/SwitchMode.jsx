// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
ToggleSwitch.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  defaultValue: PropTypes.string,
  onToggle: PropTypes.func,
};
export default function ToggleSwitch({ options = ['Saisie', 'Importer'], defaultValue = 'Saisie', onToggle }) {
  const [active, setActive] = useState(defaultValue);

  const handleToggle = (value) => {
    setActive(value);
    if (onToggle) onToggle(value);
    console.log(`Switched to: ${value}`);
  };

  return (
    <div className="relative bg-brandblue p-1 rounded-full flex gap-1 w-fit">
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-brandgreen z-0 ${active === options[0] ? 'left-1' : 'left-1/2'}`}
      />

      {options.map(option => (
        <button
          key={option}
          onClick={() => handleToggle(option)}
          className={`relative z-10 w-auto py-2 px-3 cursor-pointer text-xs font-medium rounded-full transition-all duration-300
            ${active === option ? 'text-brandblue' : 'text-brandgreen'}
           `}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
}
