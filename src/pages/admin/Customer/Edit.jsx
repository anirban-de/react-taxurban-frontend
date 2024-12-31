import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomInput, CustomSelect } from '../../../components';
import axios from 'axios';
import Swal from 'sweetalert2';
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
    name: 'Uncle',
    value: 'Uncle',
  },
  {
    name: 'Aunty',
    value: 'Aunty',
  },
  {
    name: 'Others',
    value: 'Others',
  },
];

const Edit = () => {
  const [servicetype, setServiceType] = useState('individual');
  const [clientDetails, setClientDetails] = useState({
    name: '',
    relation: '',
    fatherName: '',
    address: '',
    pan: '',
    adhar: '',
    gst: '',
    mobile: '',
    altMobile: '',
    email: '',
    state: '',
  });

  const { id } = useParams();

  const [extrainfo, setExtraInfo] = useState({
    panOrg: '',
    kartaName: '',
    directorName: '',
    presidentName: '',
  });

  const [allstates, setAllStates] = useState([]);

  const getClientDetails = async (id) => {
    try {
      await axios.get(`api/admin/get-client-details/${id}`).then((res) => {
        if (res.data.status === 200) {
          setClientDetails({
            name: res.data.client.name,
            relation: res.data.client.relation,
            fatherName: res.data.client.father_name,
            address: res.data.client.address,
            pan: res.data.client.pan,
            adhar: res.data.client.aadhar,
            gst: res.data.client.gst,
            trade_name: res.data.client.trade_name,
            mobile: res.data.client.mobile,
            altMobile: res.data.client.alt_mobile,
            email: res.data.client.email,
            state: res.data.client.state,
          });
          setExtraInfo({
            panOrg: res.data.client.panOrg,
            kartaName: res.data.client.kartaName,
            directorName: res.data.client.directorName,
            presidentName: res.data.client.presidentName,
          });
          setServiceType(res.data.client.client_type);
        }
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

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (id) {
        getClientDetails(id);
      }
      getStates();
    }
    return () => {
      isMounted = false;
    };
  }, []);

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

    const formData = new FormData();
    if (typeof id === 'undefined') {
      formData.append('id', 0);
    } else {
      formData.append('id', id);
    }
    formData.append('clienttype', servicetype);
    formData.append('name', clientDetails.name);
    formData.append('relation', clientDetails.relation);
    formData.append('fatherName', clientDetails.fatherName);
    formData.append('address', clientDetails.address);
    formData.append('pan', clientDetails.pan);
    formData.append('adhar', clientDetails.adhar);
    formData.append('gst', clientDetails.gst);
    formData.append('trade_name', clientDetails.trade_name);
    formData.append('mobile', clientDetails.mobile);
    formData.append('altMobile', clientDetails.altMobile);
    formData.append('email', clientDetails.email);
    formData.append('state', clientDetails.state);
    formData.append('panOrg', extrainfo.panOrg);
    formData.append('kartaName', extrainfo.kartaName);
    formData.append('directorName', extrainfo.directorName);
    formData.append('presidentName', extrainfo.presidentName);

    try {
      await axios({
        method: 'post',
        url: `api/admin/add-edit-client-process`,
        data: formData,
      }).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        } else {
          console.log(res.data.result);
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  return (
    <div>
      <section>
        <form onSubmit={submitClient} encType="multipart/form-data">
          <div className="grid grid-cols-1 gap-5">
            {/* client details  */}
            <div className="bg-white p-6 rounded-md mb-5">
              <h1 className="font-semibold md:text-lg">Client's Details</h1>
              <hr className="my-3" />
              <div className="flex flex-col gap-4">
                <CustomSelect
                  label={'Service Type'}
                  options={CLIENT_DETAILS}
                  value={servicetype}
                  name="servicetype"
                  onChange={(e) => {
                    //setIndividualDetails(e);
                    setServiceType(e.target.value);
                  }}
                  defaultOption={'Select'}
                />
                <CustomInput
                  placeholder={'Enter name'}
                  label={`Name ${dynamicLabel()}`}
                  value={clientDetails.name}
                  name="name"
                  onChange={updateClientDetails}
                />
                <CustomSelect
                  label={'Select Relation'}
                  options={RELATION}
                  value={clientDetails.relation}
                  name="relation"
                  onChange={updateClientDetails}
                  defaultOption={'Select'}
                  required
                />
                {servicetype !== 'individual' && (
                  <CustomInput
                    placeholder={'Enter PAN'}
                    label={`PAN ${dynamicLabel()}`}
                    value={extrainfo.panOrg}
                    name="panOrg"
                    onChange={updateExtraDetails}
                  />
                )}
                <CustomInput
                  placeholder={`Enter Father's Name`}
                  label={`Father's Name`}
                  value={clientDetails.fatherName}
                  name="fatherName"
                  onChange={updateClientDetails}
                />
                <div>
                  <label className="block mb-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                    Enter address {dynamicLabel()}
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="block p-2.5 w-full text-xs md:text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter Address"
                    value={clientDetails.address}
                    name="address"
                    onChange={updateClientDetails}
                  ></textarea>
                </div>
                {servicetype === 'huf' && (
                  <CustomInput
                    placeholder={`Enter karta's name`}
                    label={`Karta's Name`}
                    value={extrainfo.kartaName}
                    name="kartaName"
                    onChange={updateExtraDetails}
                  />
                )}
                {servicetype === 'company' && (
                  <CustomInput
                    placeholder={`Enter Director's name`}
                    label={`Director's Name`}
                    value={extrainfo.directorName}
                    name="directorName"
                    onChange={updateExtraDetails}
                  />
                )}
                {servicetype === 'trust' && (
                  <CustomInput
                    placeholder={`Enter President's/Trustee's Name`}
                    label={`President's/Trustee's Name`}
                    value={extrainfo.presidentName}
                    name="presidentName"
                    onChange={updateExtraDetails}
                  />
                )}
                <CustomInput
                  placeholder={`Enter PAN`}
                  label={`PAN`}
                  value={clientDetails.pan}
                  name="pan"
                  onChange={updateClientDetails}
                />

                <CustomInput
                  placeholder={`Enter Aadhar`}
                  label={`Adhar`}
                  value={clientDetails.adhar}
                  name="adhar"
                  onChange={updateClientDetails}
                />
                <CustomInput
                  placeholder={`Enter GSTIN`}
                  label={`GSTIN`}
                  value={clientDetails.gst}
                  name="gst"
                  onChange={updateClientDetails}
                />
                <CustomInput
                  placeholder={`Enter Trade Name`}
                  label={`Trade Name`}
                  value={clientDetails.trade_name}
                  name="trade_name"
                  onChange={updateClientDetails}
                />
                <CustomInput
                  placeholder={`Enter mobile`}
                  label={`Mobile`}
                  value={clientDetails.mobile}
                  name="mobile"
                  onChange={updateClientDetails}
                />
                <CustomInput
                  placeholder={`Enter Alt mobile`}
                  label={`Alt Mobile`}
                  value={clientDetails.altMobile}
                  name="altMobile"
                  onChange={updateClientDetails}
                />
                <CustomInput
                  placeholder={`Enter Email`}
                  label={`Email`}
                  value={clientDetails.email}
                  name="email"
                  onChange={updateClientDetails}
                />
                <CustomSelect
                  label={'Select State'}
                  options={allstates}
                  value={clientDetails.state}
                  name="state"
                  onChange={updateClientDetails}
                  defaultOption={'Select State'}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md mb-5">
            <div className="flex mt-3 justify-between items-start gap-3 ">
              <button
                type="submit"
                className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Edit;
