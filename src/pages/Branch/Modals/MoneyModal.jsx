import React from 'react';
import { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { CustomInput } from '../../../components';
import { toast } from 'react-toastify';
import { errorToast } from '../../../utils';

const AddMoneyModal = ({
  onPayment,
  toggleMoneyModal,
  branch,
}) => {
  const [data, setData] = useState({
    amount: '',
    reason: '',
  });

  const updateData = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submitWallet = async () => {

    if (data.amount === '' || data.reason === '') {
      toast.info('Please fill all the fields');
      return;
    }

    try {
      await onPayment({ amount: data.amount, mobile: branch.mobile, email: branch.email, name: branch.name, extra: ['credit', data.reason] })
    } catch (error) {
      errorToast(error)
    }
  };

  return (
    <div className="fixed z-20 left-0 right-0 top-0 bottom-0 overflow-auto  bg-gray-800 bg-opacity-80 flex justify-center items-center ">
      <div
        className="bg-gray-100 md:w-2/6 w-11/12 p-5 rounded-lg overflow-auto"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semiboldmd:text-lg capitalize">Credit Money</h1>
          <AiFillCloseCircle
            size={24}
            className="cursor-pointer"
            onClick={toggleMoneyModal}
          />
        </div>

        <div className="bg-white p-4 mt-3 ">
          <div className="grid grid-cols-2 gap-3">
            <CustomInput
              placeholder={'500'}
              value={data.amount}
              label={'Amount (min - ₹ 500)'}
              type="number"
              name="amount"
              onChange={updateData}
            />
            <CustomInput
              placeholder={`some reason for credit`}
              value={data.reason}
              label={'Reason'}
              name="reason"
              onChange={updateData}
            />
          </div>
          <div className="mt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={submitWallet}
              className="text-white cursor-pointer capitalize bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-4 py-2"
            >
              Credit Money
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyModal;
