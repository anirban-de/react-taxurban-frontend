import React, { useState } from 'react';
import CustomInput from './CustomInput';
import { FiCheck, FiMessageCircle } from 'react-icons/fi';
import OtpModal from '../Modals/OtpModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoaderLight } from '../../assets';
import { errorToast } from '../../utils';

const PhoneInput = ({ verified = false, setVerified, children, ...rest }) => {
  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [otpHash, setOtpHash] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyPhone = () => {
    const pattern = /^[0-9]{10}$/
    return pattern.test(rest.value)
  }

  const sendOtp = async () => {
    if (rest.value === '' && rest.error) {
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("api/signup-otp", { phone: `91${rest.value}` });

      if (res.data?.status === 200 || res.status === 200) {
        setOtpHash(res.data?.otp);
        setShowOtpModal(true);
        toast.success(res.data?.message);
      }

    } catch (error) {
      errorToast(error);
    } finally {
      setLoading(false);
    }
  }

  const verifyOtp = async (otp) => {
    try {
      setLoading(true);
      const res = await axios.post("api/verify-otp", { otp: otp, otp_hash: otpHash });
      if (res.data?.status === 200 || res.status === 200) {
        setVerified(true);
        setShowOtpModal(false);
        toast.success(res.data?.message);
        window.document.body.style.overflow = 'auto';
      }

    } catch (error) {
      errorToast(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CustomInput disabled={verified} maxlength="10" icon={<span className="text-sm">+91</span>} placeholder={"9876543210"} {...rest}>
      <div className="flex items-center gap-3 ">
        {verifyPhone() && (
          <button
            onClick={verified === false && !loading ? () => sendOtp() : null}
            type="button"
            className="px-3 py-2 gap-3 text-xs md:text-sm font-medium text-center inline-flex items-center text-white bg-green-400 rounded-lg hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            {loading ?
              <img className='w-[24px] h-[24px]' src={LoaderLight} alt="loader-svg" /> :
              <div className='flex gap-2 items-center'>
                {verified ? <FiCheck /> : <FiMessageCircle />}
                {verified ? 'Verified' : 'Verify'}
              </div>
            }
          </button>
        )}
        {children}
      </div>
      {showOtpModal && (
        <OtpModal
          visible={showOtpModal}
          setVisible={() => setShowOtpModal(!showOtpModal)}
          onSubmit={verifyOtp}
        />
      )}
    </CustomInput>
  );
};

export default PhoneInput;
