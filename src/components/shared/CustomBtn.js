import React from 'react';
import { LoaderLight } from '../../assets';

const CustomBtn = ({
  loading = false,
  customClasses = ``,
  children,
  color = `green`,
  ...rest
}) => {
  return (
    <button
      disabled={loading}
      className={`${customClasses} capitalize text-white flex  text-xs md:text-sm items-center bg-${color}-400 hover:bg-${color}-500 focus:ring-4 focus:outline-none focus:ring-${color}-300 font-medium rounded-lg text-xs md:text-sm w-full sm:w-auto px-3 text-center md:px-4 py-2  `}
      {...rest}
    >
      <div className='w-full'>
        {!loading && children}
        {loading && <img src={LoaderLight} className="w-5 h-5" />}
      </div>
    </button>
  );
};

export default CustomBtn;
