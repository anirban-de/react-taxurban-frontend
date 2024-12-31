import React, { useState } from 'react';
import { NoAvatarImage } from '../../../assets';
import { CustomBtn, CustomInput, CustomSelect, InlineLoader } from '../../../components';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteCustomer } from '../../../redux/CustomerSlice';
import { useDispatch } from 'react-redux';
import useAwsS3 from '../../../hooks/useAwsS3';
import { uploadFolders } from '../../../utils/uploadFolders';
import { FiArrowLeft } from 'react-icons/fi';
import { pickDocument } from '../../../utils/pickDocument';
import { errorToast } from '../../../utils';

const CustomerEdit = () => {
  const navigate = useNavigate();
  const { uploadToS3 } = useAwsS3();
  const [allbranch, setAllBranch] = useState([]);
  const [branch, setBranch] = useState('');
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();
  const [generalInfo, setGeneralInfo] = useState({
    CustomerName: '',
    email: '',
    password: '',
    mobile: {
      number: '',
      whatsapp: false,
    },
    branch: '',
  });;
  const [userImage, setUserImage] = useState(null);

  const { id } = useParams();

  const updateGeneralInfo = (e) => {
    const { name, value } = e.target;
    setGeneralInfo({ ...generalInfo, [name]: value });
  };

  const updateMobileNumber = (e) => {
    const { name, value } = e.target;
    setGeneralInfo({
      ...generalInfo,
      [name]: { ...generalInfo[name], number: value },
    });
  };

  const deleteImage = () => {
    setUserImage(null);
  }

  const onError = (error) => {
    console.log('Error', error);
  };

  const handleFileUpload = async (e) => {
    const file = pickDocument(e);
    if (file === null) {
      return;
    }
    setUserImage(file);
  };

  const getCustomerAndBranchData = async () => {
    setLoading(true);
    try {

      const response = await Promise.all([
        axios.get(`api/admin/get-customer/${id}`),
        axios.get(`api/all-branch/Approved`)
      ])

      if (response[0].data.status === 200) {
        setGeneralInfo({
          CustomerName: response[0].data.customer.name,
          email: response[0].data.customer.email,
          password: response[0].data.customer.password,
          mobile: {
            number: response[0].data.customer.mobile,
            whatsapp: false,
          },
        });
        setBranch(response[0].data.branch);
        setUserImage(response[0].data.customer.photo);
      }

      if (response[1].data.status === 200) {
        let temp = [];
        response[1].data.allbranch.forEach((element) => {
          temp.push({
            name: element.branch_code + '-' + element.name,
            value: element.branch_code,
          });
        });
        setAllBranch(temp);
      }

    } catch (error) {

    } finally {
      setLoading(false);
    }
  }


  const dynamicImage = () => {

    if (userImage === null) {
      return NoAvatarImage;
    }

    if (typeof userImage === "object") {
      return URL.createObjectURL(userImage);
    }

    if (typeof userImage === "string") {
      return userImage;
    }
  }

  //on submit form
  const submitData = async (e) => {
    setSaving(true);
    e.preventDefault();
    setError([]);
    try {
      const data = {
        name: generalInfo.CustomerName,
        email: generalInfo.email,
        mobile: generalInfo.mobile.number,
        branch: branch,
        photo: userImage,
        password: '12345',
        confirm_password: '12345',
        id: id,
      };

      if (typeof userImage === "object") {
        const imageResponse = await uploadToS3(userImage, `${uploadFolders.UserFiles.customer}/${data.email.split('@')[0]}`, false)
        data.photo = imageResponse?.url;
      }

      const res = await axios.post(`api/add-edit-customer-process`, data)

      if (res.data.status === 200) {
        dispatch(deleteCustomer());
        navigate(-1);
        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
          timer: 3000,
        });
      } else if (res.data.status === 400) {
        setError(res.data.validation_errors);
      }
    } catch (error) {
      errorToast(error)
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    getCustomerAndBranchData();
  }, []);

  return (
    <div className="container mx-auto">
      <form
        onSubmit={submitData}
        encType="multipart/form-data"
      >
        {/* service details  */}
        <div className="bg-white p-6 rounded-md ">
          <div className='flex items-center gap-2'>
            <FiArrowLeft
              size={24}
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            />
            <h1 className="font-semibold md:text-lg">General Information</h1>
          </div>
          <hr className="my-3" />

          {loading && <InlineLoader loadingText={"User Data"} />}

          {!loading && <div className="grid grid-cols-3 gap-3">
            {/* info area  */}
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <CustomInput
                    readonly
                    value={generalInfo.CustomerName}
                    placeholder={'Ex: John Doe'}
                    name="CustomerName"
                    label={'Customer Name *'}
                    required
                  />
                  {/* {error.name && (
                    <div className="text-red-500">{error.name}</div>
                  )} */}
                </div>
                <div>
                  <CustomInput
                    readonly
                    placeholder={'Ex: johndoe@gmail.com'}
                    value={generalInfo.email}
                    name="email"
                    // onChange={updateGeneralInfo}
                    type="email"
                    label={'Email *'}
                    required
                  />
                  {/* {error.email && (
                    <div className="text-red-500">{error.email}</div>
                  )} */}
                </div>
                <div>
                  <CustomSelect
                    label={'Select Branch'}
                    options={allbranch}
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    defaultOption={'No Branch'}
                  />
                  {error.branch && (
                    <div className="text-red-500">{error.branch}</div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <CustomInput
                    readonly
                    label={'Mobile No *'}
                    name="mobile"
                    value={generalInfo.mobile.number}
                    // onChange={updateMobileNumber}
                    icon={<span>+91</span>}
                    required
                  />
                  {/* {error.mobile && (
                    <div className="text-red-500">{error.mobile}</div>
                  )} */}
                </div>
                <div>
                  <CustomInput
                    type="text"
                    placeholder={'Enter your password'}
                    value={generalInfo.password}
                    name="password"
                    label={'Password *'}
                    required
                  />
                  {/* {error.password && (
                    <div className="text-red-500">{error.password}</div>
                  )} */}
                </div>
                <div className="col-span-2 flex justify-start">
                  <CustomBtn type="submit" loading={saving}>
                    Submit
                  </CustomBtn>
                </div>
              </div>

            </div>
            {/* photo and signature area  */}
            <div className="p-4 border rounded-md  flex flex-col gap-4">
              <h1>Upload photo & Signature</h1>
              <div className="flex gap-4 relative">
                <img
                  className="rounded-lg mb-3 max-h-44 object-cover"
                  src={dynamicImage()}
                  width={'50%'}
                />
                {/* <ul className="list-disc ml-3">
                  <li className="text-sm">File should be less than 200px</li>
                  <li className="text-sm">Should be clearly visible</li>
                </ul> */}
              </div>
              {/* {userImage !== null &&
                <CustomBtn> Delete Image</CustomBtn>
              }
              {userImage === null &&
                <input
                  name="photo"
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'photo')}
                  className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                />
              } */}
            </div>
          </div>}
        </div>
      </form >
    </div >
  );
};

export default CustomerEdit;
