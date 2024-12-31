import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { CustomInput, CustomBtn } from '../../../components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { errorToast } from '../../../utils';

const SRSearch = () => {
  const navigate = useNavigate();
  const [servicetype, setServiceType] = useState('');
  const [clientDetails, setClientDetails] = useState({
    client_type: '',
    sr_id: '',
    sr_db_id: '',
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

  const [loading, setLoading] = useState(false);

  const [extrainfo, setExtraInfo] = useState({
    panOrg: '',
    kartaName: '',
    directorName: '',
    presidentName: '',
  });

  const getClientDetails = async (e) => {
    e.preventDefault();
    let request_id = clientDetails.sr_id;

    if (request_id === '') {
      return;
    }

    try {
      setLoading(true);
      await axios
        .get(`api/branch/get-client-details-sr/${request_id}`)
        .then((res) => {
          if (res.data.status === 200) {
            setClientDetails({
              client_type: res.data.client.client_type,
              sr_id: request_id,
              sr_db_id: res.data.sr_id,
              name: res.data.client.name,
              relation: res.data.client.relation,
              fatherName: res.data.client.father_name,
              address: res.data.client.address,
              pan: res.data.client.pan,
              adhar: res.data.client.aadhar,
              gst: res.data.client.gst,
              mobile: res.data.client.mobile,
              altMobile: res.data.client.alt_mobile,
              email: res.data.client.email,
              state: res.data.state.name,
            });
            setExtraInfo({
              panOrg: res.data.client.panOrg,
              kartaName: res.data.client.kartaName,
              directorName: res.data.client.directorName,
              presidentName: res.data.client.presidentName,
            });
            setServiceType(res.data.client.client_type);
          } else if (res.data.status === 400) {
            Swal.fire({
              title: 'Warning!',
              text: res.data.message,
              icon: 'warning',
              confirmButtonText: 'Ok',
              timer: 3000,
            });
          }
        });
    } catch (error) {
      errorToast(error?.response?.data?.message || error?.message || 'Something went wrong')
    } finally {
      setLoading(false);
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

  return (
    <div>
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          onClick={() => navigate('/branch/service-request')}
          className="cursor-pointer"
        />
        <h1 className="md:text-lg font-semibold ml-3">Search SR</h1>
      </div>

      <section>
        <form encType="multipart/form-data">
          <div className="bg-white p-6 rounded-md mb-5">
            <h1 className="font-semibold md:text-lg">Search SR</h1>
            <hr className="my-3" />
            <div className="flex mt-3 justify-between items-end gap-3">
              <div className="w-full">
                <CustomInput
                  placeholder={'Enter SR ID'}
                  label={`Enter SR ID`}
                  value={clientDetails.sr_id}
                  name="sr_id"
                  onChange={(e) => {
                    updateClientDetails(e);
                  }}
                />
              </div>
              <CustomBtn loading={loading} onClick={getClientDetails} >Search</CustomBtn>
            </div>
          </div>

          {servicetype !== '' && !loading &&
            <div className="grid grid-cols-1 gap-5">
              {/* client details  */}
              <div className="bg-white p-6 rounded-md mb-5">
                <h1 className="font-semibold md:text-lg">Client's Details</h1>
                <hr className="my-3" />
                <div className="flex flex-col gap-4">
                  <CustomInput
                    placeholder={'Client Type'}
                    label={`Client Type`}
                    value={clientDetails.client_type}
                    readOnly
                  />
                  <CustomInput
                    placeholder={'Enter name'}
                    label={`Name ${dynamicLabel()}`}
                    value={clientDetails.name}
                    name="name"
                    readOnly
                  />
                  {servicetype !== 'Individual' && (
                    <CustomInput
                      placeholder={'Enter PAN'}
                      label={`PAN ${dynamicLabel()}`}
                      value={extrainfo.panOrg}
                      name="panOrg"
                      onChange={updateExtraDetails}
                      readOnly
                    />
                  )}
                  <CustomInput
                    placeholder={`Enter Father's Name`}
                    label={`Father's Name`}
                    value={clientDetails.fatherName}
                    name="fatherName"
                    readOnly
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
                      readOnly
                    ></textarea>
                  </div>
                  {servicetype === 'HUF' && (
                    <CustomInput
                      placeholder={`Enter karta's name`}
                      label={`Karta's Name`}
                      value={extrainfo.kartaName}
                      name="kartaName"
                      onChange={updateExtraDetails}
                      readOnly
                    />
                  )}
                  {servicetype === 'Company' && (
                    <CustomInput
                      placeholder={`Enter Director's name`}
                      label={`Director's Name`}
                      value={extrainfo.directorName}
                      name="directorName"
                      onChange={updateExtraDetails}
                      readOnly
                    />
                  )}
                  {servicetype === 'Trust' && (
                    <CustomInput
                      placeholder={`Enter President's/Trustee's Name`}
                      label={`President's/Trustee's Name`}
                      value={extrainfo.presidentName}
                      name="presidentName"
                      onChange={updateExtraDetails}
                      readOnly
                    />
                  )}
                  <CustomInput
                    placeholder={`Enter PAN`}
                    label={`PAN`}
                    value={clientDetails.pan}
                    name="pan"
                    readOnly
                  />

                  <CustomInput
                    placeholder={`Enter Adhar`}
                    label={`Adhar`}
                    value={clientDetails.adhar}
                    name="adhar"
                    readOnly
                  />
                  <CustomInput
                    placeholder={`Enter GSTIN`}
                    label={`GSTIN`}
                    value={clientDetails.gst}
                    name="gst"
                    readOnly
                  />
                  <CustomInput
                    placeholder={`Enter mobile`}
                    label={`Mobile`}
                    value={clientDetails.mobile}
                    name="mobile"
                    readOnly
                  />
                  <CustomInput
                    placeholder={`Enter Alt mobile`}
                    label={`Alt Mobile`}
                    value={clientDetails.altMobile}
                    name="altMobile"
                    readOnly
                  />
                  <CustomInput
                    placeholder={`Enter Email`}
                    label={`Email`}
                    value={clientDetails.email}
                    name="email"
                    readOnly
                  />
                  <CustomInput
                    placeholder={`Select State`}
                    label={`State`}
                    value={clientDetails.state}
                    readOnly
                  />
                  {clientDetails.sr_db_id && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/branch/service-request/payment/${clientDetails.sr_db_id}`
                        )
                      }
                      className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                    >
                      Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          }
        </form>
      </section>
    </div>
  );
};

export default SRSearch;
