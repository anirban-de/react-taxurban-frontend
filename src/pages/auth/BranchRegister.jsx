import React, { useCallback, useState } from 'react';
import { NoAvatarImage, NoSignatureImage } from '../../assets';
import { CustomInput, CustomSelect, CustomToggle } from '../../components';
import { ToggleSwitch } from 'flowbite-react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PhoneInput from '../../components/shared/PhoneInput';
import { uploadFolders } from '../../utils/uploadFolders'
import useAwsS3 from '../../hooks/useAwsS3';
import { pickDocument } from '../../utils/pickDocument';
import { errorToast } from '../../utils';

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

const BranchRegister = () => {
  const navigate = useNavigate();
  const { uploadToS3 } = useAwsS3();
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
      verified: false,
    },
    alternamteMobile: {
      number: '',
      whatsapp: false,
      verified: false,
    },
    password: '',
    confirmPassword: '',
  });
  const [allstates, setAllStates] = useState([]);
  const [error, setError] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [officeAddress, setOfficeAddress] = useState(initialAddress);
  const [residentailAddress, setResidentailAddress] = useState(initialAddress);
  const [sameAsToggle, setSameAsToggle] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    branchName: '',
    ifsc: '',
    bankAcNumber: '',
    accountName: '',
  });
  const [phoneNumberVerified, setPhoneNumberVerified] = useState(false);
  const [alternatePhoneNumberVerified, setAlternatePhoneNumberVerified] = useState(false);

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

  const [Images, setImages] = useState({
    photo: { image: NoAvatarImage, fileId: '' },
    sign: { image: NoSignatureImage, fileId: '' },
  });

  const handleFileUpload = async (e, name1) => {
    e.preventDefault();
    const file = pickDocument(e);
    if (file === null) {
      return;
    }
    setImages({
      ...Images,
      [name1]: { image: file, fileId: null },
    });
  };

  const updateOfficeAddress = (e) => {
    const { name, value } = e.target;
    setOfficeAddress({ ...officeAddress, [name]: value });
  };

  const updateResidentialAddress = (e) => {
    const { name, value } = e.target;
    setResidentailAddress({ ...residentailAddress, [name]: value });
  };

  const sameAsOfficeAddress = useCallback(() => {
    if (sameAsToggle) {
      setResidentailAddress({ ...officeAddress });
      return;
    }
    setResidentailAddress(initialAddress);
  }, [sameAsToggle, officeAddress]);

  const getStates = useCallback(async () => {
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
  }, []);

  const dynamicImage = (image) => {
    if (!image) return NoAvatarImage;

    if (typeof image === 'object') {
      return URL.createObjectURL(image);
    }
    return image;
  }

  const updateBankDetails = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const submitData = async (e) => {
    e.preventDefault();

    if (!phoneNumberVerified) {
      setError({ ...error, mobile: 'Please verify your mobile number' })
      return;
    }

    if (generalInfo.alternamteMobile.number !== '' && !alternatePhoneNumberVerified) {
      setError({ ...error, alternamteMobile: 'Please verify your mobile number' })
      return;
    }

    setError([]);

    const reqImages = {
      photo: { image: Images.photo.image, fileId: null },
      sign: { image: Images.sign.image, fileId: null },
    }

    if (typeof reqImages.photo.image === 'object') {
      const imageResponse = await uploadToS3(reqImages.photo.image, `${uploadFolders.UserFiles.branch}/${generalInfo.email.split('@')[0]}`, false);
      reqImages['photo'] = { image: imageResponse?.url, fileId: null };
      setImages((prev) => ({ ...prev, photo: { image: imageResponse?.url, fileId: null } }));
    }

    if (typeof reqImages.sign.image === 'object') {
      const imageResponse = await uploadToS3(reqImages.sign.image, `${uploadFolders.UserFiles.branch}/${generalInfo.email.split('@')[0]}`, false);
      reqImages['sign'] = { image: imageResponse?.url, fileId: null };
      setImages((prev) => ({ ...prev, sign: { image: imageResponse?.url, fileId: null } }));
    }

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
        photo: reqImages.photo,
        signature: reqImages.sign,
        email: generalInfo.email,
        password: generalInfo.password,
        confirm_password: generalInfo.confirmPassword,
        id: 0,
      };

      await axios.post(`api/add-edit-branch-process`, data).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
          navigate('/login');
        } else if (res.data.status === 400) {
          setError(res.data.validation_errors);
        }
      });
    } catch (error) { }
  };

  useEffect(() => {
    if (mounted) {
      sameAsOfficeAddress();
    }
  }, [mounted, sameAsOfficeAddress, sameAsToggle, officeAddress]);

  useState(() => {
    getStates().then(() => {
      setMounted(true);
    });
  }, [mounted]);

  return (
    <div className="container mx-auto" style={{ height: '90vh' }}>
      <form
        // autocomplete='off'
        className="mt-5"
        onSubmit={submitData}
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
                  placeholder={'Ex: TMLPA7877W'}
                  value={generalInfo.pan}
                  name="pan"
                  onChange={updateGeneralInfo}
                  label={'PAN Card *'}
                  required
                  maxLength="10"
                />
                <CustomInput
                  placeholder={'Ex: 457363452735'}
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

                <PhoneInput
                  verified={phoneNumberVerified}
                  setVerified={setPhoneNumberVerified}
                  label={'Mobile Number *'}
                  placeholder=" 9876543210"
                  name="mobile"
                  value={generalInfo.mobile.number}
                  onChange={updateMobileNumber}
                  required
                  maxLength="10"
                  errorMsg={error?.mobile}
                >
                  <CustomToggle
                    checked={generalInfo.mobile.whatsapp}
                    onChange={() => updateWhatsApp('mobile')}
                  />
                </PhoneInput>

                <PhoneInput
                  verified={alternatePhoneNumberVerified}
                  setVerified={setAlternatePhoneNumberVerified}
                  placeholder=" 9876543210"
                  value={generalInfo.alternamteMobile.number}
                  name="alternamteMobile"
                  label={'Alt Mobile Number *'}
                  onChange={updateMobileNumber}
                  errorMsg={error?.alternamteMobile}
                  maxLength="10"
                >
                  <CustomToggle
                    checked={generalInfo.alternamteMobile.whatsapp}
                    onChange={() => updateWhatsApp('alternamteMobile')}
                  />
                </PhoneInput>
              </div>
            </div>
            {/* photo and signature area  */}
            <div className="p-4 border rounded-md  flex flex-col gap-4">
              <h1>Upload photo & Signature</h1>
              <div>
                <div className="flex gap-4">
                  <img
                    alt="profile"
                    className="rounded-lg mb-3 max-h-44 object-cover w-40 h-40 "
                    src={dynamicImage(Images.photo.image)}
                  />
                  <ul className="list-disc ml-3">
                    <li className="text-xs">File should be less than 1 MB</li>
                    <li className="text-xs">Should be clearly visible</li>
                  </ul>
                </div>
                <input
                  name="photo"
                  type="file"
                  accept='image/*'
                  onChange={(e) => handleFileUpload(e, 'photo')}
                  className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                  required
                />
              </div>
              <div>
                <div className="flex gap-4">
                  <img
                    alt="signature"
                    className="rounded-lg mb-3 w-[50%] h-20 object-cover"
                    src={dynamicImage(Images.sign.image)}
                  />
                  <ul className="list-disc ml-3">
                    <li className="text-xs">Should be less than 1MB</li>
                    <li className="text-xs">Should be clearly visible</li>
                  </ul>
                </div>
                <input
                  name="sign"
                  type="file"
                  accept='image/*'
                  onChange={(e) => handleFileUpload(e, 'sign')}
                  className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                  required
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
              placeholder="ex : 128678123612876123867"
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

        <div className="bg-white p-6 rounded-md mb-5">
          <h1 className="font-semibold md:text-lg">Credentials Details</h1>
          <hr className="my-3" />
          <div className="flex mt-3 justify-between items-start gap-3 ">
            <div className="w-full">
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <CustomInput
                    required
                    type="password"
                    placeholder="ex : 12345678"
                    label={'Password *'}
                    value={generalInfo.password}
                    name="password"
                    onChange={updateGeneralInfo}
                    errorMsg={error?.password}
                  />
                </div>
                <div>
                  <CustomInput
                    placeholder="ex : 12345678"
                    type="password"
                    label={'Confirm Password *'}
                    value={generalInfo.confirmPassword}
                    name="confirmPassword"
                    required
                    onChange={updateGeneralInfo}
                    errorMsg={error?.confirm_password}
                  />
                </div>
              </div>
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
    </div>
  );
};

export default BranchRegister;
