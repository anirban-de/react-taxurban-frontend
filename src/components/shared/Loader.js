import React from 'react';
import { LoaderIcon } from '../../assets';
const Loader = () => {
  return (
    <div className="flex flex-1 h-screen justify-center items-center">
      <img src={LoaderIcon} width={50} height={50} alt="loader" />
    </div>
  );
};

export default Loader;
