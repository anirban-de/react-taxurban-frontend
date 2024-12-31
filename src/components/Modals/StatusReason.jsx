import React from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

const StatusReason = ({ toggleMoneyModal, message }) => {

  return (
    <div className="fixed z-40 left-0 right-0 top-0 bottom-0 overflow-auto  bg-gray-800 bg-opacity-80 flex justify-center items-center ">
      <div
        className="bg-gray-100 md:w-2/6 w-11/12 p-5 rounded-lg overflow-auto"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semiboldmd:text-lg capitalize">
            Reason
          </h1>
          <AiFillCloseCircle
            size={24}
            className="cursor-pointer"
            onClick={toggleMoneyModal}
          />
        </div>

        <div className="bg-white grid grid-cols-2 p-4 rounded-lg mt-3">
          <div>
            <p>{message}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatusReason;
