import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { CustomBtn, CustomInput, CustomSelect, InlineLoader, PhoneInput } from '../../../components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { deleteClientSlice } from '../../../redux/ClientSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { errorToast } from '../../../utils';

const CLIENT_DETAILS = [
  {
    name: 'Individual',
    value: 'Individual',
  },
  {
    name: 'Partnership',
    value: 'Partnership',
  },
  {
    name: 'HUF',
    value: 'HUF',
  },
  {
    name: 'Company',
    value: 'Company',
  },
  {
    name: 'Trust',
    value: 'Trust',
  },
  {
    name: 'NGO',
    value: 'NGO',
  },
  {
    name: 'Society',
    value: 'Society',
  },
  {
    name: 'AOP',
    value: 'AOP',
  },
  {
    name: 'BOP',
    value: 'BOP',
  },
];

const RELATION = [
  {
    name: 'Self',
    value: 'Self',
  },
  {
    name: 'Father',
    value: 'Father',
  },
  {
    name: 'Mother',
    value: 'Mother',
  },
  {
    name: 'Husband',
    value: 'Husband',
  },
  {
    name: 'Wife',
    value: 'Wife',
  },
  {
    name: 'Sister',
    value: 'Sister',
  },
  {
    name: 'Brother',
    value: 'Brother',
  },
  {
    name: 'Others',
    value: 'Others',
  },
];

const Manage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [servicetype, setServiceType] = useState('Individual');
  const [loading, setLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState({
    name: '',
    relation: '',
    fatherName: '',
    flat_door_block_no: '',
    name_of_premises: '',
    road_street: '',
    area_locality: '',
    city: '',
    district: '',
    pincode: '',
    pan: '',
    adhar: '',
    gst: '',
    mobile: '',
    altMobile: '',
    email: '',
    state: '',
    trade_name: ''
  });
  const [error, setError] = useState([]);
  const { id } = useParams();
  const [extrainfo, setExtraInfo] = useState({
    panOrg: '',
    kartaName: '',
    directorName: '',
    presidentName: '',
  });

  const checkIsVerified = (number) => {
    if (id && number !== null) {
      return true;
    }
    return false;
  }


  const [allstates, setAllStates] = useState([]);
  const [mobileNumberConfig, setMobileNumberConfig] = useState({
    main: {
      verified: false,
    },
    alt: {
      verified: false,
    }
  });


  const getClientDetails = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`api/customer/get-client-details/${id}`)

      if (res.data.status === 200) {
        setClientDetails({
          name: res.data.client.name,
          relation: res.data.client.relation,
          fatherName: res.data.client.father_name,
          flat_door_block_no: res.data.client.flat_door_block_no,
          name_of_premises: res.data.client.name_of_premises,
          road_street: res.data.client.road_street,
          area_locality: res.data.client.area_locality,
          city: res.data.client.city,
          district: res.data.client.district,
          pincode: res.data.client.pincode,
          pan: res.data.client.pan,
          adhar: res.data.client.aadhar,
          gst: res.data.client.gst,
          mobile: res.data.client.mobile,
          altMobile: res.data.client.alt_mobile,
          email: res.data.client.email,
          state: res.data.client.state,
          trade_name: res.data.client.trade_name
        });

        setMobileNumberConfig({
          main: {
            verified: checkIsVerified(res.data.client.mobile),
          },
          alt: {
            verified: checkIsVerified(res.data.client.alt_mobile),
          }
        })


        setExtraInfo({
          panOrg: res.data.client.panOrg,
          kartaName: res.data.client.kartaName,
          directorName: res.data.client.directorName,
          presidentName: res.data.client.presidentName,
        });
        setServiceType(res.data.client.client_type);
        setLoading(false);
      }

    } catch (error) {
      errorToast(error)
    } finally {
      setLoading(false);
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

  const updateClientDetails = (e) => {
    const { name, value } = e.target;
    setClientDetails({ ...clientDetails, [name]: value });
  };

  const updateExtraDetails = (e) => {
    const { name, value } = e.target;
    setExtraInfo({ ...extrainfo, [name]: value });
  };

  const dynamicLabel = () => {
    if (servicetype === '') {
      return '';
    }
    return `of ${servicetype}`;
  };

  const submitClient = async (e) => {
    e.preventDefault();
    setError([]);
    const formData = new FormData();
    formData.append('id', id ? id : 0)
    formData.append('clienttype', servicetype);
    formData.append('name', clientDetails.name);
    formData.append('relation', clientDetails.relation);
    formData.append('fatherName', clientDetails.fatherName);
    formData.append('flat_door_block_no', clientDetails.flat_door_block_no);
    formData.append('name_of_premises', clientDetails.name_of_premises);
    formData.append('road_street', clientDetails.road_street);
    formData.append('area_locality', clientDetails.area_locality);
    formData.append('city', clientDetails.city);
    formData.append('district', clientDetails.district);
    formData.append('pincode', clientDetails.pincode);
    formData.append('pan', clientDetails.pan);
    formData.append('adhar', clientDetails.adhar);
    formData.append('gst', clientDetails.gst);
    formData.append('mobile', clientDetails.mobile);
    formData.append('altMobile', clientDetails.altMobile);
    formData.append('email', clientDetails.email);
    formData.append('state', clientDetails.state);
    formData.append('panOrg', extrainfo.panOrg);
    formData.append('kartaName', extrainfo.kartaName);
    formData.append('directorName', extrainfo.directorName);
    formData.append('presidentName', extrainfo.presidentName);
    formData.append('trade_name', clientDetails.trade_name);

    try {
      const res = await axios({
        method: 'post',
        url: `api/customer/add-edit-client-process`,
        data: formData,
      })
      if (res.data.status === 200) {
        dispatch(deleteClientSlice());
        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
          timer: 3000,
        });
        navigate('/customer/clients');
      } else if (res.data.status === 400) {
        setError(res.data.validation_errors);
      } else {
        console.log(res.data.result);
      }
    } catch (error) {
      errorToast(error)
    }
  };

  useEffect(() => {
    if (id) {
      getClientDetails();
    }
    getStates();
  }, []);

  return (
    <div>
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          onClick={() => navigate('/customer/clients')}
          className="cursor-pointer"
        />
        <h1 className="md:text-lg font-semibold ml-3">
          {id > 0 ? 'Edit User' : 'Add User'}
        </h1>
      </div>

      {loading && <InlineLoader loadingText="User Data" />}

      {!loading &&
        <section>
          <form onSubmit={submitClient} encType="multipart/form-data">

            {/* basic info  */}
            <div className="bg-white p-6 mb-4 rounded-md">
              <h1 className="font-semibold text-md">User's Details</h1>
              <hr className="mt-2 mb-4" />
              {/* Basic Info */}
              <div className=' grid md:grid-cols-2 gap-4'>
                <CustomSelect
                  label={'Service Type'}
                  options={CLIENT_DETAILS}
                  value={servicetype}
                  name="servicetype"
                  onChange={(e) => {
                    setServiceType(e.target.value);
                  }}
                  defaultOption={'Select User Service Type '}
                />
                <CustomInput
                  placeholder={'Enter name'}
                  label={`Name ${dynamicLabel()}`}
                  value={clientDetails.name}
                  name="name"
                  onChange={updateClientDetails}
                  required
                />
                <CustomSelect
                  label={'Relation Type'}
                  options={RELATION}
                  value={clientDetails.relation}
                  name="relation"
                  onChange={updateClientDetails}
                  defaultOption={'Select Relation'}
                  required
                />
                <CustomInput
                  placeholder={`Enter Father's Name`}
                  label={`Father's Name`}
                  value={clientDetails.fatherName}
                  name="fatherName"
                  onChange={updateClientDetails}
                  required
                />
                {servicetype === 'HUF' && (
                  <CustomInput
                    placeholder={`Enter karta's name`}
                    label={`Karta's Name`}
                    value={extrainfo.kartaName}
                    name="kartaName"
                    onChange={updateExtraDetails}
                  />
                )}
                {servicetype === 'Company' && (
                  <CustomInput
                    placeholder={`Enter Director's name`}
                    label={`Director's Name`}
                    value={extrainfo.directorName}
                    name="directorName"
                    onChange={updateExtraDetails}
                  />
                )}
                {servicetype === 'Trust' && (
                  <CustomInput
                    placeholder={`Enter President's/Trustee's Name`}
                    label={`President's/Trustee's Name`}
                    value={extrainfo.presidentName}
                    name="presidentName"
                    onChange={updateExtraDetails}
                  />
                )}
              </div>
            </div>

            {/* contact info  */}
            <div className="bg-white p-6 mb-4 rounded-md">
              <h1 className="font-semibold text-md">Contact Details</h1>
              <hr className="mt-2 mb-4" />
              <div className='grid md:grid-cols-2 gap-4'>
                <PhoneInput
                  label={`Mobile`}
                  value={clientDetails.mobile}
                  verified={mobileNumberConfig.main.verified}
                  setVerified={(isVerified) => setMobileNumberConfig({ ...mobileNumberConfig, main: { ...mobileNumberConfig.main, verified: isVerified } })}
                  name="mobile"
                  onChange={updateClientDetails}
                  required
                  maxLength="10"
                  errorMsg={error?.mobile} />
                <PhoneInput
                  label={`Alt Mobile`}
                  value={clientDetails.altMobile}
                  verified={mobileNumberConfig.alt.verified}
                  setVerified={(isVerified) => setMobileNumberConfig({ ...mobileNumberConfig, alt: { ...mobileNumberConfig.alt, verified: isVerified } })}
                  name="altMobile"
                  onChange={updateClientDetails}
                  maxLength="10" />
                <CustomInput
                  placeholder={`Enter Email`}
                  label={`Email Address`}
                  type="email"
                  value={clientDetails.email}
                  name="email"
                  onChange={updateClientDetails}
                  required
                />
              </div>
            </div>

            {/* address info  */}
            <div className="bg-white p-6 mb-4 rounded-md">
              <h1 className="font-semibold text-md">Address Details</h1>
              <hr className="mt-2 mb-4" />

              {/* Address details  */}
              <div className='grid md:grid-cols-2 gap-4'>
                <CustomInput
                  placeholder={`247/E28`}
                  label={`Flat/door/Block No`}
                  value={clientDetails.flat_door_block_no}
                  name="flat_door_block_no"
                  onChange={updateClientDetails}
                />
                <CustomInput
                  placeholder={`Building name or village name`}
                  label={`Name Of Building / Village`}
                  value={clientDetails.name_of_premises}
                  name="name_of_premises"
                  onChange={updateClientDetails}
                />
                <CustomInput
                  placeholder={`Enter Road or Street or Post Office`}
                  label={`Road/Street/Post Office`}
                  value={clientDetails.road_street}
                  name="road_street"
                  onChange={updateClientDetails}
                />
                <CustomInput
                  placeholder={`Enter Area or Locality`}
                  label={`Area / Locality`}
                  value={clientDetails.area_locality}
                  name="area_locality"
                  onChange={updateClientDetails}
                  required
                />
                <CustomInput
                  placeholder={`Enter City`}
                  label={`City`}
                  value={clientDetails.city}
                  name="city"
                  onChange={updateClientDetails}
                  required
                />
                <CustomInput
                  placeholder={`Enter District`}
                  label={`District`}
                  value={clientDetails.district}
                  name="district"
                  onChange={updateClientDetails}
                  required
                />

                <CustomSelect
                  label={'Select State'}
                  options={allstates}
                  required
                  value={clientDetails.state}
                  name="state"
                  onChange={updateClientDetails}
                  defaultOption={'Select State'}
                />

                <CustomInput
                  placeholder={`Enter Pincode`}
                  label={`Pincode`}
                  value={clientDetails.pincode}
                  name="pincode"
                  onChange={updateClientDetails}
                  required
                  maxLength="6"
                />
              </div>
            </div>

            {/* identity info  */}
            <div className="bg-white p-6 mb-4 rounded-md">
              <h1 className="font-semibold text-md">Identity Details</h1>
              <hr className="mt-2 mb-4" />

              <div className='grid md:grid-cols-2 gap-4'>
                {servicetype !== 'Individual' && (
                  <CustomInput
                    placeholder={'Enter PAN'}
                    label={`PAN ${dynamicLabel()}`}
                    value={extrainfo.panOrg}
                    name="panOrg"
                    onChange={updateExtraDetails}
                    maxLength="10"
                    errorMsg={error?.panOrgs}
                  />
                )}
                <CustomInput
                  placeholder={`Enter PAN`}
                  label={`PAN`}
                  value={clientDetails.pan}
                  name="pan"
                  onChange={updateClientDetails}
                  required
                  maxLength="10"
                />
                {error.pan && (
                  <small
                    className="text-red-500 error_inform"
                    id={`error_inform_pan`}
                  >
                    {error.pan}
                  </small>
                )}
                <CustomInput
                  placeholder={`Enter Aadhar`}
                  label={`Adhar`}
                  value={clientDetails.adhar}
                  name="adhar"
                  onChange={updateClientDetails}
                  maxLength="12"
                  required
                />
                {error.adhar && (
                  <small
                    className="text-red-500 error_inform"
                    id={`error_inform_aadhar`}
                  >
                    {error.adhar}
                  </small>
                )}
                <CustomInput
                  placeholder={`Enter GSTIN`}
                  label={`GSTIN`}
                  value={clientDetails.gst}
                  name="gst"
                  onChange={updateClientDetails}
                  maxLength="15"
                  errorMsg={error?.gst}
                />
                <CustomInput
                  placeholder={`Trade Name`}
                  label={`Trade Name`}
                  value={clientDetails.trade_name}
                  name="trade_name"
                  onChange={updateClientDetails}
                  maxLength="15"
                  errorMsg={error?.trade_name}
                />
              </div>
            </div>

            <div className="bg-white p-3 rounded-md mb-4">
              <CustomBtn type="submit">Submit </CustomBtn>
            </div>
          </form>
        </section>
      }
    </div>
  );
};

export default Manage;
