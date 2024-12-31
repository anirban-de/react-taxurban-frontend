import React from 'react';
import { LoaderDark } from '../../assets';

const InlineLoader = ({ loadingText, customText, ...rest }) => {
  return (
    <div className="flex items-center my-4" {...rest}>
      <img src={LoaderDark} className="w-6 h-6" />
      <p className=' text-xs md:text-sm'>{customText ? customText : `Loading ${loadingText}`} </p>
    </div>
  );
};

export default InlineLoader;
