import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AiFillCloseCircle } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { CustomInput, CustomSelect } from '../../../components';
import { errorToast } from '../../../utils';

const AddMoneyModal = ({ mode, toggleMoneyModal, getTransactionReport }) => {
  const MODES = ['credit', 'debit'];
  const [currentMode, setCurrentMode] = useState(MODES[0]);
  const [currentBranch, setCurrentBranch] = useState('');
  const [balance, setBalance] = useState(0);
  const [allbranch, setAllBranch] = useState([]);
  const [data, setData] = useState({
    amount: '',
    reason: '',
  });

  const getAllBranch = async () => {
    try {
      await axios.get(`api/admin/all-branch/Approved`).then((res) => {
        if (res.data.status === 200) {
          let temp = [];
          res.data.allbranch.map((element) => {
            temp.push({
              name: `${element.branch_code}-${element.name}-₹ ${element.balance}`,
              value: element.user_id,
            });
          });
          setAllBranch(temp);
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  const getBranchDetails = async (id) => {
    setCurrentBranch(id);
    try {
      await axios.get(`api/admin/edit-branch/${id}`).then((res) => {
        if (res.data.status === 200) {
          setBalance(res.data.branch.balance);
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  const updateData = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submitWallet = async () => {
    if (data.amount === '' || data.reason === '') {
      toast.info('Please fill all the fields');
      return;
    }
    const walletData = {
      branch_id: currentBranch,
      transaction_type: currentMode,
      amount: data.amount,
      reason: data.reason,
    };

    try {
      await axios.post(`api/wallet-process`, walletData).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
          getTransactionReport();
          toggleMoneyModal();
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  useEffect(() => {
    getAllBranch();
  }, []);

  return (
    <div className="fixed z-20 left-0 right-0 top-0 bottom-0 overflow-auto  bg-gray-800 bg-opacity-80 flex justify-center items-center ">
      <div
        className="bg-gray-100 md:w-2/6 w-11/12 p-5 rounded-lg overflow-auto"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semiboldmd:text-lg capitalize">
            {currentMode} Money
          </h1>
          <AiFillCloseCircle
            size={24}
            className="cursor-pointer"
            onClick={toggleMoneyModal}
          />
        </div>

        <div className="bg-white grid grid-cols-2 p-4 rounded-lg mt-3">
          <div>
            <CustomSelect
              options={allbranch}
              value={currentBranch}
              onChange={(e) => getBranchDetails(e.target.value)}
              defaultOption={'select a branch'}
              label="Select Branch"
            />
          </div>
          <div className="text-right">
            <h1 className="mb-1">Branch Balance</h1>
            <span className="text-2xl font-semibold">₹ {balance}</span>
          </div>
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
              placeholder={`some reason for ${currentMode}`}
              value={data.reason}
              label={'Reason'}
              name="reason"
              onChange={updateData}
            />
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div className="flex gap-2">
              {MODES.map((item, index) => (
                <div
                  onClick={() => setCurrentMode(item)}
                  className={`border py-1 px-3 rounded-md text-xs md:text-sm cursor-pointer ${currentMode === item && 'bg-green-400 text-white'
                    }`}
                  key={index}
                >
                  <span className="capitalize">{item}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={submitWallet}
              className="text-white cursor-pointer capitalize bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-4 py-2"
            >
              {currentMode} Money
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyModal;
