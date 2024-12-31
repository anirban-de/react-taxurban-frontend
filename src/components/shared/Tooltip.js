import React from 'react';

const Tooltip = () => {
  return (
    <div
      id="tooltip-default"
      role="tooltip"
      class="absolute z-10 invisible inline-block px-3 py-2 text-xs md:text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    >
      Tooltip content
      <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
  );
};

export default Tooltip;
