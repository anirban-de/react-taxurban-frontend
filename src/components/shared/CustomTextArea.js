import React from 'react';

const CustomTextArea = ({ children, label, icon, errorMsg, ...rest }) => {
  return (
    <div className='w-full'>
      {label && (
        <label className="block mb-2 md:text-sm  text-xs font-medium text-gray-900 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="flex gap-3">
        <div className="relative w-full ">
          {icon && (
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              {icon}
            </div>
          )}
          <textarea className={`border border-gray-300 text-gray-900  text-xs md:text-sm  rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ${icon && 'pl-12'
              } p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`} {...rest}>
              
          </textarea>
        </div>
        {children}
      </div>
      {errorMsg && (
        <p className="mt-2  text-xs md:text-sm text-red-600 dark:text-red-500">
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default CustomTextArea;