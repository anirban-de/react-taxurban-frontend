import React from 'react';
import { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { CustomTextArea } from '../../../components';
import { toast } from 'react-toastify';
import { errorToast } from '../../../utils';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditRequestModal = ({
    toggleRequestModal,
    packageId
}) => {
  const [data, setData] = useState({
    id: packageId,
    customer_request: ''
  });

  const updateData = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submit = async () => {

    if (data.customer_request === '') {
      toast.info('Please fill all the fields');
      return;
    }

    try {
        await axios.post(`api/user-update-gst-package`, data).then((res) => {
            Swal.fire({
                title: 'Success!',
                text: res.data.msg,
                icon: 'success',
                confirmButtonText: 'Ok',
                timer: 3000,
            });
            toggleRequestModal();
        });
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
          <h1 className="font-semiboldmd:text-lg capitalize">Edit Request</h1>
          <AiFillCloseCircle
            size={24}
            className="cursor-pointer"
            onClick={toggleRequestModal}
          />
        </div>

        <div className="bg-white p-4 mt-3 ">
          <div className="grid gap-3">
            <CustomTextArea
              placeholder={`Enter Request`}
              value={data.customer_request}
              label={'Request'}
              name="customer_request"
              onChange={updateData}
            />
          </div>
          <div className="mt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={submit}
              className="text-white cursor-pointer capitalize bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-4 py-2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRequestModal;