import { Pagination } from 'flowbite-react';
import React from 'react';

const CustomPagination = ({ currentPage = 1, onPageChange, total = 0 }) => {
  return (
    <Pagination
      className='text-xs md:text-sm float-right'
      currentPage={currentPage}
      onPageChange={onPageChange}
      totalPages={total}
    />
  );
};

export default CustomPagination;
