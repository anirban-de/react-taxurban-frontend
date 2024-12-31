import React, { useState } from 'react';
import { NoAvatarImage } from '../../assets';
import { CustomInput } from '../../components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAwsS3 from '../../hooks/useAwsS3';
import { uploadFolders } from '../../utils/uploadFolders';
import { pickDocument } from '../../utils/pickDocument';
import OtpModal from '../../components/Modals/OtpModal';
import { errorToast } from '../../utils';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const { uploadToS3 } = useAwsS3();
  const [error, setError] = useState([]);
  const [phoneNumberVerified, setPhoneNumberVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [otpHash, setOtpHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generalInfo, setGeneralInfo] = useState({
    id: 0,
    name: '',
    email: '',
    mobile: '',
    branch: '',
    password: '',
    photo: '',
    confirm_password: '',
  });

  const updateGeneralInfo = (e) => {
    const { name, value } = e.target;
    setGeneralInfo({ ...generalInfo, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = pickDocument(e);
    if (file === null) {
      return;
    }
    setGeneralInfo((prev) => ({ ...prev, photo: file }));
  };

  const dynamicImage = (image) => {
    if (!image) return NoAvatarImage;

    if (typeof image === 'object') {
      return URL.createObjectURL(image);
    }
    return image;
  }

  const registerCustomer = async () => {
    try {
      const req_data = { ...generalInfo };

      if (typeof generalInfo.photo === 'object') {
        const imageResponse = await uploadToS3(generalInfo.photo, `${uploadFolders.UserFiles.customer}/${generalInfo.email.split('@')[0]}`);
        req_data['photo'] = imageResponse?.url;
        setGeneralInfo((prev) => ({ ...prev, photo: imageResponse?.url }));
      }

      const res = await axios.post(`api/add-edit-customer-process`, req_data)
      if (res.data.status === 200) {
        navigate('/login');
        toast.success(res.data.message);
      } else if (res.data.status === 400) {
        setError(res.data.validation_errors);
      }
    } catch (error) {
      console.log(error.response);
    }
  }


  const sendOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.post("api/signup-otp", { phone: `91${generalInfo.mobile}` });

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
        setPhoneNumberVerified(true);
        setShowOtpModal(false);
        toast.success(res.data?.message);
        window.document.body.style.overflow = 'auto';
        registerCustomer();
      }

    } catch (error) {
      errorToast(error);
    } finally {
      setLoading(false);
    }
  }


  const submitData = async (e) => {
    setError([]);
    e.preventDefault();
    if (generalInfo.password !== generalInfo.confirm_password) {
      setError({ ...error, confirm_password: 'Password and confirm password should be same' })
      return;
    }

    if (!phoneNumberVerified) {
      sendOtp();
    } else {
      registerCustomer();
    }

  };


  return (
    <div className="container mx-auto" style={{ height: '90vh' }}>
      <form
        className="mt-5"
        onSubmit={submitData}
        encType="multipart/form-data"
      >
        {/* service details  */}
        <div className="bg-white p-6 rounded-md mb-5">
          <h1 className="font-semibold md:text-lg">General Information</h1>
          <hr className="my-3" />
          <div className="grid grid-cols-3 gap-3">
            {/* info area  */}
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  value={generalInfo.CustomerName}
                  placeholder={'Ex: John Doe'}
                  name="name"
                  onChange={updateGeneralInfo}
                  label={'Customer Name *'}
                  required
                  errorMsg={error?.name}
                />
                <CustomInput
                  placeholder={'Ex: johndoe@gmail.com'}
                  value={generalInfo.email}
                  name="email"
                  onChange={updateGeneralInfo}
                  type="email"
                  label={'Email *'}
                  required
                  errorMsg={error?.email}
                />
                <CustomInput
                  placeholder={'Ex: WB-22-0000018'}
                  value={generalInfo.branch}
                  name="branch"
                  onChange={updateGeneralInfo}
                  type="text"
                  label={'Referral Code (optional)'}
                  errorMsg={error?.branch}
                />
                <CustomInput
                  name="mobile"
                  label={'Mobile No *'}
                  placeholder={'9876543210'}
                  value={generalInfo.mobile}
                  onChange={updateGeneralInfo}
                  icon={<span> +91 </span>}
                  errorMsg={error?.mobile}
                />
                <CustomInput
                  placeholder={'Password'}
                  value={generalInfo.password}
                  name="password"
                  onChange={updateGeneralInfo}
                  type="password"
                  label={'Password *'}
                  required
                  errorMsg={error?.password}
                />
                <CustomInput
                  placeholder={'Confirm Password'}
                  value={generalInfo.confirm_password}
                  name="confirm_password"
                  onChange={updateGeneralInfo}
                  type="password"
                  label={'Confirm Password *'}
                  required
                  errorMsg={error?.confirm_password}
                />
                <button
                  type="submit"
                  className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                >
                  Submit
                </button>
              </div>
            </div>
            {/* photo and signature area  */}
            <div className="p-4 border rounded-md  flex flex-col gap-4">
              <h1>Upload photo</h1>
              <div>
                <div className="flex gap-4">
                  <div className="h-44">
                    <img
                      alt="profile"
                      className="rounded-lg mb-3  object-cover w-40 h-40"
                      src={dynamicImage(generalInfo.photo)}
                    />
                  </div>
                  <ul className="list-disc ml-3">
                    <li className="text-sm">File should be less than 1mb</li>
                    <li className="text-sm">Should be clearly visible</li>
                  </ul>
                </div>
                <input
                  name="photo"
                  type="file"
                  accept='image/*'
                  onChange={(e) => handleFileUpload(e, 'photo')}
                  className="block w-full text-xs md:text-sm mt-3 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      {showOtpModal && (
        <OtpModal
          visible={showOtpModal}
          setVisible={() => setShowOtpModal(!showOtpModal)}
          onSubmit={verifyOtp}
        />
      )}
    </div>
  );
};

export default CustomerRegister;
