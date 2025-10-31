//import React from 'react';
import PropTypes from 'prop-types';
const DetailCard = ({ title, details, characteristics,children }) => {
  return (
    <div className="flex bg-white rounded-lg shadow-lg p-6">
      <div className="w-1/2 bg-gray-200 rounded-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 bg-gray-300 flex justify-center items-center">
          {children}
        </div>
      </div>
      <div className="w-1/2 pl-4 flex flex-col justify-center items-center">
        <h2 className="font-semibold text-xl mt-1 text-gray-700">{title}</h2>
        <ul className="list-disc list-inside">
          {details.map((detail, index) => (
            <li key={index} className="flex justify-between">
              <span className="font-semibold text-gray-600">{detail.label} :</span>
              <span className="text-gray-500 text-sm">{detail.value}</span>
            </li>
          ))}
          </ul>
      </div>
      <div className=" separator-v m-4 h-auto border border-gray-200"></div>
      <div className='m-2'>{characteristics}</div>
    </div>
  );
};
DetailCard.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  characteristics: PropTypes.node,
  children: PropTypes.node,
};

export default DetailCard;
