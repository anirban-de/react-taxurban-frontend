import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import usePaymentHook from '../../hooks/usePaymentHook';
import { LoaderDark } from '../../assets';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../redux/AuthSlice';
import { secureSessionStorage, secureLocalStorage, errorToast, Swalwait } from '../../utils';
import Swal from 'sweetalert2';
import CustomBtn from '../../components/shared/CustomBtn';

const Activation = () => {
  const navigate = useNavigate();
  const [branch, setBranch] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [activationamount, setActivationAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const logout = () => {
    Swalwait();

    axios.post(`api/logout`).then((res) => {
      if (res.data.status === 200) {
        secureLocalStorage.clear();
        secureSessionStorage.clear();
        dispatch(resetAuth());

        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
          timer: 3000,
        });

        navigate('/login', { replace: true });
      }
    });
  };


  const getDetails = async () => {
    try {
      setLoading(true);
      const response = await Promise.all([axios.get(`api/branch/get-branch`), axios.get(`api/branch/get-settings`)])

      if (response[0]?.data?.status === 200) {
        setBranch({
          name: response[0].data.user.name,
          email: response[0].data.user.email,
          mobile: response[0].data.branch.mobile_no,
        });
      }

      if (response[1]?.data?.status === 200) {
        setActivationAmount(response[1].data.setting.branch_activation_amount);
      }

    } catch (error) {
      errorToast(error)
    } finally {
      setLoading(false);
    }
  }

  const onPaymentSuccess = async () => {
    getDetails().then(() => {
      logout()
    }).catch((error) => {
      errorToast(error)
    });
  }

  const { makePayment } = usePaymentHook({ verifyApiUrl: 'api/branch/account-activation', callback: onPaymentSuccess });

  const submitPayment = async (e) => {
    e.preventDefault();
    try {

      await makePayment({ 
        type: 'branch_payment', 
        payerName: branch.name,
        amount: activationamount, 
        mobile: branch.mobile, 
        name: branch.name, 
        email: branch.email 
      })
    } catch (error) {
      errorToast(error)
    }
  };

  useEffect(() => {
    getDetails()
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={LoaderDark} alt="loader" className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center items-center h-screen" >
      <form className="mt-5">
        {/* service details  */}
        <div className="bg-white p-6 rounded-md mb-5 w-[300px]">
          <h1 className="font-semibold md:text-lg">Pay Branch Activation Fee</h1>
          <hr className="my-3" />
          <div className="flex flex-col gap-3">
            <label>Total Amount ₹ {activationamount}</label>
            <div className='flex items-center gap-3'>
              <CustomBtn onClick={submitPayment}>
                Pay
              </CustomBtn>
              <CustomBtn onClick={logout} >
                Logout
              </CustomBtn>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default Activation;
