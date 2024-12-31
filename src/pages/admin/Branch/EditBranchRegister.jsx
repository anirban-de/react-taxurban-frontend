import React, { useState } from 'react';
import { NoAvatarImage, NoSignatureImage } from '../../../assets';
import { CustomInput, CustomSelect, InlineLoader } from '../../../components';
import { ToggleSwitch } from 'flowbite-react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { deleteBranchSlice } from '../../../redux/BranchesSlice';
import useAwsS3 from '../../../hooks/useAwsS3';
import { uploadFolders } from '../../../utils/uploadFolders';
import { pickDocument } from '../../../utils/pickDocument';
import { errorToast } from '../../../utils';

const CONSTITUTION_OF_BUISNESS = [
  {
    name: 'Individual',
    value: 'Individual',
  },
  {
    name: 'Partnership',
    value: 'Partnership',
  },
  {
    name: 'Company',
    value: 'Company',
  },
];

const BRANCH_STATUS = [
  {
    name: 'Pending',
    value: 'Pending',
  },
  {
    name: 'Approved',
    value: 'Approved',
  },
  {
    name: 'Rejected',
    value: 'Rejected',
  },
];

const EDUCATION = [
  {
    name: 'Below 10th',
    value: 'Below 10th',
  },
  {
    name: 'Class X Pass',
    value: '10th Pass',
  },
  {
    name: 'Class XII Pass',
    value: '12th Pass',
  },
  {
    name: 'Graduation',
    value: 'Graduation',
  },
  {
    name: 'Post Graduation',
    value: 'Post Graduation',
  },
  {
    name: 'PhD',
    value: 'PhD',
  },
];

const EditBranchRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { uploadToS3 } = useAwsS3();

  // general info
  const [generalInfo, setGeneralInfo] = useState({
    branchName: '',
    applicantName: '',
    businessName: '',
    applicantFatherName: '',
    dateOfBirth: '',
    pan: '',
    adhar: '',
    constitution: '',
    qualification: '',
    email: '',
    mobile: {
      number: '',
      whatsapp: false,
    },
    alternamteMobile: {
      number: '',
      whatsapp: false,
    },
    activation_amount: '',
    activation_date: '',
    transaction_id: ''
  });

  const [officeInfo, setOfficeInfo] = useState({
    received_by: '',
    received_date: '',
    verified_by: '',
    verified_date: '',
    master_created_by: '',
    master_created_date: '',
    officer_name: '',
    officer_accepted_date: '',
  });

  const { id } = useParams();
  const [error, setError] = useState([]);

  const [allstates, setAllStates] = useState([]);

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

  const updateWhatsApp = (type) => {
    let value = { ...generalInfo[type], whatsapp: !generalInfo[type].whatsapp };
    setGeneralInfo({ ...generalInfo, [type]: value });
  };

  //photo & signature
  const [Images, setImages] = useState({
    photo: { image: NoAvatarImage, fileId: '' },
    sign: { image: NoSignatureImage, fileId: '' },
  });

  const handleFileUpload = async (e, name1) => {
    const file = pickDocument(e);
    if (file === null) {
      return;
    }
    uploadToS3(file, `${uploadFolders.UserFiles.branch}/${generalInfo?.email?.split('@')[0]}`, false).then((res) => {
      setImages({
        ...Images,
        [name1]: { image: res?.url, fileId: null },
      });
    });
  };

  // address
  const initialAddress = {
    address1: '',
    address2: '',
    city: '',
    district: '',
    po: '',
    ps: '',
    pincode: '',
    state: '',
  };

  const [officeAddress, setOfficeAddress] = useState(initialAddress);

  const [residentailAddress, setResidentailAddress] = useState(initialAddress);

  const [sameAsToggle, setSameAsToggle] = useState(false);

  const updateOfficeAddress = (e) => {
    const { name, value } = e.target;
    setOfficeAddress({ ...officeAddress, [name]: value });
  };
  const updateResidentialAddress = (e) => {
    const { name, value } = e.target;
    setResidentailAddress({ ...residentailAddress, [name]: value });
  };

  const sameAsOfficeAddress = (e) => {
    if (sameAsToggle) {
      setResidentailAddress({ ...officeAddress });
      return;
    }
    setResidentailAddress(initialAddress);
  };

  const getBranchDetails = async () => {
    try {
      await axios.get(`api/admin/edit-branch/${id}`).then((res) => {
        if (res.data.status === 200) {
          setGeneralInfo({
            branchName: res.data.user.name,
            applicantName: res.data.branch.applicant_name,
            businessName: res.data.branch.business_name,
            applicantFatherName: res.data.branch.fathers_name,
            dateOfBirth: res.data.branch.dob,
            pan: res.data.branch.pan_number,
            adhar: res.data.branch.aadhar_number,
            constitution: res.data.branch.constitution,
            qualification: res.data.branch.qualification,
            email: res.data.user.email,
            mobile: {
              number: res.data.branch.mobile_no,
              whatsapp: res.data.branch.mobile_no_wp ? 1 : 0,
            },
            alternamteMobile: {
              number: res.data.branch.alternative_mobile_no,
              whatsapp: res.data.branch.alternative_mobile_no_wp ? 1 : 0,
            },
            activation_amount: res.data.branch.activation_amount,
            activation_date: res.data.branch.activation_date,
            transaction_id: res.data.branch.transaction_id
          });

          setImages({
            photo: {
              image: res.data.branch.photo,
              fileId: res.data.branch.photo_id,
            },
            sign: {
              image: res.data.branch.signature,
              fileId: res.data.branch.signature_id,
            },
          });

          setOfficeAddress({
            address1: res.data.branch.address_line_1,
            address2: res.data.branch.address_line_optional_1,
            city: res.data.branch.city_1,
            district: res.data.branch.district_1,
            po: res.data.branch.po_1,
            ps: res.data.branch.ps_1,
            pincode: res.data.branch.pincode_1,
            state: res.data.branch.state_1,
          });

          setResidentailAddress({
            address1: res.data.branch.address_line_2,
            address2: res.data.branch.address_line_optional_2,
            city: res.data.branch.city_2,
            district: res.data.branch.district_2,
            po: res.data.branch.po_2,
            ps: res.data.branch.ps_2,
            pincode: res.data.branch.pincode_2,
            state: res.data.branch.state_2,
          });

          setBankDetails({
            bankName: res.data.branch.bank_name,
            branchName: res.data.branch.branch_name,
            ifsc: res.data.branch.ifsc_code,
            bankAcNumber: res.data.branch.account_number,
            accountName: res.data.branch.account_holder_name,
          });

          setOfficeInfo({
            received_by: res.data.branch.received_by,
            received_date: res.data.branch.received_date,
            verified_by: res.data.branch.verified_by,
            verified_date: res.data.branch.verified_date,
            master_created_by: res.data.branch.master_created_by,
            master_created_date: res.data.branch.master_created_date,
            officer_name: res.data.branch.officer_name,
            officer_accepted_date: res.data.branch.officer_accepted_date,
          });

          setStatus(res.data.branch.status);
          setRemarks(res.data.branch.remarks);
          setLoading(false);
        }
        setLoading(false);
      });
    } catch (error) {
      errorToast(error)
    }
  };

  const getStates = async () => {
    try {
      await axios.get(`api/get-states`).then((res) => {
        if (res.data.status === 200) {
          let temp = [];
          res.data.states.forEach((element) => {
            temp.push({
              name: element.name,
              value: element.id,
            });
          });
          setAllStates(temp);
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  const getDataOnLoad = async () => {
    try {
      setLoading(true);
      sameAsOfficeAddress();
      await getBranchDetails();
      await getStates();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDataOnLoad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // bank details
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    branchName: '',
    ifsc: '',
    bankAcNumber: '',
    accountName: '',
  });

  const updateBankDetails = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const updateOfficeDetails = (e) => {
    const { name, value } = e.target;
    setOfficeInfo({ ...officeInfo, [name]: value });
  };

  // remraks
  const [remarks, setRemarks] = useState('');

  //Status
  const [status, setStatus] = useState('');

  //on submit form
  const submitData = async (e) => {
    e.preventDefault();
    const userdata = {
      name: generalInfo.branchName,
    };
    const branchdata = {
      business_name: generalInfo.businessName,
      applicant_name: generalInfo.applicantName,
      fathers_name: generalInfo.applicantFatherName,
      dob: generalInfo.dateOfBirth,
      pan_number: generalInfo.pan,
      aadhar_number: generalInfo.adhar,
      constitution: generalInfo.constitution,
      qualification: generalInfo.qualification,
      mobile_no: generalInfo.mobile.number,
      mobile_no_wp: generalInfo.mobile.whatsapp,
      alternative_mobile_no: generalInfo.alternamteMobile.number,
      alternative_mobile_no_wp: generalInfo.alternamteMobile.whatsapp,
      address_line_1: officeAddress.address1,
      address_line_optional_1: officeAddress.address2,
      city_1: officeAddress.city,
      district_1: officeAddress.district,
      po_1: officeAddress.po,
      ps_1: officeAddress.ps,
      pincode_1: officeAddress.pincode,
      state_1: officeAddress.state,
      address_line_2: residentailAddress.address1,
      address_line_optional_2: residentailAddress.address2,
      city_2: residentailAddress.city,
      district_2: residentailAddress.district,
      po_2: residentailAddress.po,
      ps_2: residentailAddress.ps,
      pincode_2: residentailAddress.pincode,
      state_2: residentailAddress.state,
      bank_name: bankDetails.bankName,
      branch_name: bankDetails.branchName,
      ifsc_code: bankDetails.ifsc,
      account_holder_name: bankDetails.accountName,
      account_number: bankDetails.bankAcNumber,
      remarks: remarks,
    };

    try {
      const data = {
        userdata: userdata,
        branchdata: branchdata,
        photo: Images.photo.image,
        signature: Images.sign.image,
        officedata: officeInfo,
        status: status,
        email: generalInfo.email,
        id: id,
      };

      await axios.post(`api/add-edit-branch-process`, data).then((res) => {
        if (res.data.status === 200) {
          dispatch(deleteBranchSlice());
          navigate('/admin/branch');

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
      });
    } catch (error) { }
  };

  return (
    <div className="container mx-auto">
      {/* header  */}
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
        <h1 className="md:text-lg font-semibold ml-3">Edit Branch</h1>
      </div>

      {loading && <InlineLoader loadingText={'branch details'} />}

      {!loading && (
        <form className="mt-5" onSubmit={submitData}>
          {/* service details  */}
          <div className="bg-white p-6 rounded-md mb-5">
            <h1 className="font-semibold md:text-lg">General Information</h1>
            <hr className="my-3" />
            <div className="grid grid-cols-3 gap-3">
              {/* info area  */}
              <div className="col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    value={generalInfo.branchName}
                    placeholder={'Ex: John Doe'}
                    name="branchName"
                    onChange={updateGeneralInfo}
                    label={'Branch Name *'}
                    required
                  />
                  <CustomInput
                    value={generalInfo.businessName}
                    placeholder={'Ex: John Doe'}
                    name="businessName"
                    onChange={updateGeneralInfo}
                    label={'Business Name *'}
                    required
                  />
                  <CustomInput
                    value={generalInfo.applicantName}
                    placeholder={'Ex: John Doe'}
                    name="applicantName"
                    onChange={updateGeneralInfo}
                    label={'Applicants Name *'}
                    required
                  />
                  <CustomInput
                    label={'Fathers Name *'}
                    placeholder={'Ex: Sam Doe'}
                    value={generalInfo.applicantFatherName}
                    name="applicantFatherName"
                    onChange={updateGeneralInfo}
                    required
                  />
                  <CustomInput
                    value={generalInfo.dateOfBirth}
                    name="dateOfBirth"
                    onChange={updateGeneralInfo}
                    type="date"
                    label={'Date of Birth *'}
                    required
                  />
                  <CustomInput
                    placeholder={'Ex: 4573DHSKJY36'}
                    value={generalInfo.pan}
                    name="pan"
                    onChange={updateGeneralInfo}
                    label={'PAN Card *'}
                    required
                    maxLength="10"
                  />
                  <CustomInput
                    placeholder={'Ex: 4573 6345 2735'}
                    value={generalInfo.adhar}
                    name="adhar"
                    required
                    onChange={updateGeneralInfo}
                    label={'Aadhar of Applicant *'}
                    maxLength="12"
                  />
                  <CustomSelect
                    value={generalInfo.constitution}
                    name="constitution"
                    defaultOption={'Select Consitution of buisness'}
                    options={CONSTITUTION_OF_BUISNESS}
                    onChange={updateGeneralInfo}
                    label={'Constitution of Business *'}
                    required
                  />
                  <CustomSelect
                    label={'Qualification *'}
                    value={generalInfo.qualification}
                    defaultOption={'Select Qualification'}
                    options={EDUCATION}
                    name="qualification"
                    onChange={updateGeneralInfo}
                    required
                  />
                  <div>
                    <CustomInput
                      placeholder={'Ex: johndoe@gmail.com'}
                      value={generalInfo.email}
                      name="email"
                      onChange={updateGeneralInfo}
                      type="email"
                      label={'Email *'}
                      required
                    />
                    {error.email && (
                      <div className="text-sm text-red-500">
                        {'* ' + error.email}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <CustomInput
                      label={'Mobile No *'}
                      name="mobile"
                      value={generalInfo.mobile.number}
                      onChange={updateMobileNumber}
                      icon={<span>+91</span>}
                      required
                      maxLength="10"
                    />
                    <div className="flex mt-5">
                      <p className="mx-3">WhatsApp</p>
                      <ToggleSwitch
                        checked={generalInfo.mobile.whatsapp}
                        onChange={() => updateWhatsApp('mobile')}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <CustomInput
                      placeholder="9876543210"
                      value={generalInfo.alternamteMobile.number}
                      name="alternamteMobile"
                      onChange={updateMobileNumber}
                      label={'AlterNative Mobile No *'}
                      icon={<span>+91</span>}
                      maxLength="10"
                    />
                    <div className="flex mt-5">
                      <p className="mx-3">WhatsApp</p>
                      <ToggleSwitch
                        checked={generalInfo.alternamteMobile.whatsapp}
                        onChange={() => updateWhatsApp('alternamteMobile')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* photo and signature area  */}
              <div className="p-4 border rounded-md  flex flex-col gap-4">
                <h1>Upload photo & Signature</h1>
                <div>
                  <div className="flex gap-4">
                    <img
                      alt='branch avatar'
                      className="rounded-lg mb-3 max-h-44 object-cover w-40 h-40 "
                      src={Images.photo.image}
                      width={'50%'}
                    />
                    <ul className="list-disc ml-3">
                      <li className="text-xs">
                        File should be less than 1 mb
                      </li>
                      <li className="text-xs">Should be clearly visible</li>
                    </ul>
                  </div>
                  {/* <IKUpload
                    name='photo'
                    fileName="taxurban-upload.png"
                    onError={onError}
                    onSuccess={(e) => handleFileUpload(e,'photo')}
                    className='block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer'
                  /> */}
                  <input
                    name="photo"
                    type="file"
                    accept='image/*'
                    onChange={(e) => handleFileUpload(e, 'photo')}
                    className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex gap-4">
                    <img
                      alt='branch signature'
                      className="rounded-lg mb-3 w-[50%] h-20 object-cover"
                      src={Images.sign.image}
                    />
                    <ul className="list-disc ml-3">
                      <li className="text-xs">Should be less than 1 mb </li>
                      <li className="text-xs">Should be clearly visible</li>
                    </ul>
                  </div>
                  {/* <IKUpload
                    name='sign'
                    fileName="test-upload.png"
                    onError={onError}
                    onSuccess={(e) => handleFileUpload(e,'sign')}
                    className='block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer'
                  /> */}
                  <input
                    name="sign"
                    type="file"
                    accept='image/*'
                    onChange={(e) => handleFileUpload(e, 'sign')}
                    className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <hr className="my-8" />

            <div className="grid grid-cols-2 gap-5">
              {/* office address section  */}
              <div className="flex flex-col gap-4">
                <h1 className="font-semiboldmd:text-lg">Office Address *</h1>
                <CustomInput
                  label={'Address line 1*'}
                  value={officeAddress.address1}
                  name="address1"
                  required
                  onChange={updateOfficeAddress}
                  placeholder="Enter Address line 1"
                />
                <CustomInput
                  value={officeAddress.address2}
                  name="address2"
                  onChange={updateOfficeAddress}
                  label={'Address line 2 - optional'}
                  placeholder="Enter Address line 2"
                />
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    value={officeAddress.city}
                    name="city"
                    required
                    onChange={updateOfficeAddress}
                    label={'City'}
                    placeholder="ex : Durgapur "
                  />
                  <CustomInput
                    value={officeAddress.district}
                    name="district"
                    required
                    onChange={updateOfficeAddress}
                    label={'District'}
                    placeholder="ex : Burdwan"
                  />
                  <CustomInput
                    value={officeAddress.po}
                    name="po"
                    required
                    onChange={updateOfficeAddress}
                    label={'PO'}
                    placeholder="ex : post office"
                  />
                  <CustomInput
                    value={officeAddress.ps}
                    name="ps"
                    required
                    onChange={updateOfficeAddress}
                    label={'PS'}
                    placeholder="ex : post "
                  />
                  <CustomInput
                    value={officeAddress.pincode}
                    name="pincode"
                    required
                    onChange={updateOfficeAddress}
                    label={'Pincode'}
                    placeholder="ex : 713204"
                    maxLength="6"
                  />
                  <CustomSelect
                    value={officeAddress.state}
                    name="state"
                    required
                    onChange={updateOfficeAddress}
                    label={'State'}
                    options={allstates}
                    defaultOption={'Select State'}
                  />
                </div>
              </div>
              {/* residential address section */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between">
                  <h1 className="font-semiboldmd:text-lg">
                    Permanent Residential Address *
                  </h1>
                  <div className="flex flex-row items-center">
                    <span className="mr-3">Same as Office </span>
                    <ToggleSwitch
                      checked={sameAsToggle}
                      onChange={() => setSameAsToggle(!sameAsToggle)}
                    />
                  </div>
                </div>
                <CustomInput
                  label={'Address line 1*'}
                  value={residentailAddress.address1}
                  name="address1"
                  required
                  onChange={updateResidentialAddress}
                  placeholder="Enter Address line 1"
                />
                <CustomInput
                  value={residentailAddress.address2}
                  name="address2"
                  onChange={updateResidentialAddress}
                  label={'Address line 2 - optional'}
                  placeholder="Enter Address line 2"
                />
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput
                    value={residentailAddress.city}
                    name="city"
                    required
                    onChange={updateResidentialAddress}
                    label={'City'}
                    placeholder="ex : Durgapur "
                  />
                  <CustomInput
                    value={residentailAddress.district}
                    name="district"
                    required
                    onChange={updateResidentialAddress}
                    label={'District'}
                    placeholder="ex : Burdwan"
                  />
                  <CustomInput
                    value={residentailAddress.po}
                    name="po"
                    required
                    onChange={updateResidentialAddress}
                    label={'PO'}
                    placeholder="ex : post office"
                  />
                  <CustomInput
                    value={residentailAddress.ps}
                    name="ps"
                    required
                    onChange={updateResidentialAddress}
                    label={'PS'}
                    placeholder="ex : post "
                  />
                  <CustomInput
                    value={residentailAddress.pincode}
                    name="pincode"
                    required
                    onChange={updateResidentialAddress}
                    label={'Pincode'}
                    placeholder="ex : 713204"
                    maxLength="6"
                  />
                  <CustomSelect
                    value={residentailAddress.state}
                    name="state"
                    required
                    onChange={updateResidentialAddress}
                    label={'State'}
                    options={allstates}
                    defaultOption={'Select State'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* bank details  */}
          <div className="bg-white p-6 rounded-md mb-5">
            <h1 className="font-semibold md:text-lg">Bank Details</h1>
            <hr className="my-3" />
            <div className="grid grid-cols-3 gap-3">
              <CustomInput
                value={bankDetails.bankName}
                placeholder="ex : State bank of India"
                required
                name="bankName"
                onChange={updateBankDetails}
                label={'Bank Name *'}
              />
              <CustomInput
                value={bankDetails.branchName}
                placeholder="ex : Durgapur"
                required
                name="branchName"
                onChange={updateBankDetails}
                label={'Branch Name *'}
              />
              <CustomInput
                label={'IFSC *'}
                placeholder="ex : FGBS132S"
                required
                value={bankDetails.ifsc}
                name="ifsc"
                onChange={updateBankDetails}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <CustomInput
                required
                placeholder="ex : 128678 123612876 123867"
                label={'Bank Account No. *'}
                value={bankDetails.bankAcNumber}
                name="bankAcNumber"
                onChange={updateBankDetails}
              />
              <CustomInput
                placeholder="ex : John Doe"
                label={'Account Name *'}
                value={bankDetails.accountName}
                name="accountName"
                required
                onChange={updateBankDetails}
              />
            </div>
          </div>

          {/* Office use  */}
          <div className="bg-white p-6 rounded-md mb-5">
            <h1 className="font-semibold md:text-lg">Office Use</h1>
            <hr className="my-3" />
            <div className="grid grid-cols-3 gap-3">
              <CustomInput
                value={officeInfo.received_by}
                placeholder="ex : John Doe"
                // required
                name="received_by"
                onChange={updateOfficeDetails}
                label={'Form Received By '}
              />
              <CustomInput
                value={officeInfo.received_date}
                // required
                name="received_date"
                type="date"
                onChange={updateOfficeDetails}
                label={'Received Date '}
              />
              <CustomInput
                label={'Form Verified By '}
                placeholder="ex : Sam Doe"
                // required
                value={officeInfo.verified_by}
                name="verified_by"
                onChange={updateOfficeDetails}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <CustomInput
                value={officeInfo.verified_date}
                // required
                name="verified_date"
                type="date"
                onChange={updateOfficeDetails}
                label={'Verified Date '}
              />
              <CustomInput
                label={'Master Created By '}
                placeholder="ex : Harry Doe"
                // required
                value={officeInfo.master_created_by}
                name="master_created_by"
                onChange={updateOfficeDetails}
              />
              <CustomInput
                value={officeInfo.master_created_date}
                // required
                name="master_created_date"
                type="date"
                onChange={updateOfficeDetails}
                label={'Master Created Date '}
              />
              <CustomInput
                label={'Officer Name *'}
                placeholder="ex : Tom Doe"
                required
                value={officeInfo.officer_name}
                name="officer_name"
                onChange={updateOfficeDetails}
              />
              <CustomInput
                value={officeInfo.officer_accepted_date}
                required
                name="officer_accepted_date"
                type="date"
                onChange={updateOfficeDetails}
                label={'Officer Accepted Date *'}
              />
              
              {generalInfo.activation_amount != null && (
                <>
                  <CustomInput
                    value={generalInfo.activation_amount}
                    label={'Payment Amount'}
                  />
                  <CustomInput
                    value={generalInfo.activation_date}
                    label={'Activation Date'}
                  />
                  <CustomInput
                    value={generalInfo.transaction_id}
                    label={'Transaction ID'}
                  />
                </>
              )}
            </div>
          </div>

          {/* status section  */}
          <div className="bg-white p-6 rounded-md mb-5">
            <h1 className="font-semibold md:text-lg">Status of Branch</h1>
            <div className="flex mt-3 justify-between items-start gap-3 ">
              <div className="w-full">
                <CustomSelect
                  value={status}
                  name="status"
                  defaultOption={'Select Status'}
                  options={BRANCH_STATUS}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* remarks section  */}
          <div className="bg-white p-6 rounded-md mb-5">
            <h1 className="font-semibold md:text-lg">Remarks</h1>
            <div className="flex mt-3 justify-between items-start gap-3 ">
              <div className="w-full">
                <input
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  type="text"
                  className=" border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  placeholder="Enter your remarks"
                  required
                />
              </div>

              <button
                type="submit"
                className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditBranchRegister;
