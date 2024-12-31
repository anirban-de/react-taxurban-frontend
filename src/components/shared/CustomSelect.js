import React from 'react';

const CustomSelect = ({ label, defaultOption, options = [], ...rest }) => {
  return (
    <div className='w-full'>
      {label && (
        <label className="block mb-2  text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        {...rest}
        className=" mb-2bg-gray-50 border border-gray-300 text-gray-900  text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
      >
        <option>{defaultOption}</option>
        {options.map((option, index) => (
          <option value={option?.value} key={index}>
            {option?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
