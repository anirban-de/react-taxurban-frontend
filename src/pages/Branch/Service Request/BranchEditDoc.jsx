import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { CustomBtn } from '../../../components';
import { LoaderDark } from '../../../assets';
import { pickDocument } from '../../../utils/pickDocument';
import { toast } from 'react-toastify';
import { errorToast } from '../../../utils';

const BranchEditDoc = () => {
  const [uploadfiles, setUploadFiles] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const [additionaldoc, setAdditionalDoc] = useState([]);
  const [additionalinfo, setAdditionalInfo] = useState([]);
  const [loading, setLoading] = useState({
    files: false,
    additionaldoc: false,
    additionalinfo: false
  })

  const toggleLoading = (key, value) => setLoading({
    ...loading,
    [key]: value
  })

  const updateFilesDetails = async (e, index, name1) => {
    const file = pickDocument(e);
    if (file === null) {
      return;
    }
    let temp = [...uploadfiles];
    temp[index] = {
      ...temp[index],
      [name1]: file,
      ['file_id']: null,
    };
    setUploadFiles(temp);
  };

  const getFiles = async () => {
    try {
      toggleLoading('files', true)
      const res = await axios.get(`api/get-sr/${id}`)
      if (res.data.status === 200) {
        let temp = [];
        res.data.srdocument.forEach((item) => {
          if (item.is_edited) {
            temp.push({
              id: item.service_document_map_id,
              name: item.name,
              value: item.document,
              file_id: item.document_id,
              mandatory: item.mandatory,
              edit: 'edit',
            });
          }
        });
        setUploadFiles(temp);
      }
    } catch (error) {
      errorToast(error)
    } finally {
      toggleLoading('files', false)
    }
  };

  const getAdditionalDocuments = async () => {
    try {
      toggleLoading('additionaldoc', true)
      const res = await axios.get(`api/get-additional-documents/${id}`)
      if (res.data.status === 200) {
        let temp = [];
        (res?.data?.additionaldoc?.sr_additional_document).forEach(
          (element) => {
            temp.push({
              id: element.id,
              document_title: element.document_title,
              value: element.document,
            });
          }
        );
        setAdditionalDoc(temp);
      }
    } catch (error) {
      errorToast(error)
    } finally {
      toggleLoading('additionaldoc', false)
    }
  };

  const getAdditionalInformations = async () => {
    try {
      toggleLoading('additionalinfo', true)
      const res = await axios.get(`api/get-additional-informations/${id}`)
      if (res.data.status === 200) {
        let temp = [];
        (res?.data?.additionalinfo?.sr_additional_information).forEach(
          (element) => {
            temp.push({
              id: element.id,
              information_title: element.information_title,
              value: element.information,
            });
          }
        );
        setAdditionalInfo(temp);
      }
    } catch (error) {
      errorToast(error)
    } finally {
      toggleLoading('additionalinfo', false)
    }
  };

  const submitDocument = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', id);
    formData.append('uploadfiles', JSON.stringify(uploadfiles));

    try {
      await axios({
        method: 'post',
        url: `api/branch/document-update`,
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

          // navigate('/customer/service-request');
        } else {
          console.log(res.data.result);
        }
      });
    } catch (error) {
      errorToast(error)
    }

    const formData1 = new FormData();
    formData1.append('sr_id', id);
    formData1.append('additionaldocs', JSON.stringify(additionaldoc));
    try {
      await axios.post(`api/additional-documents`, formData1).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      });
    } catch (error) {
      errorToast(error)
    }

    const formData2 = new FormData();
    formData2.append('sr_id', id);
    formData2.append('additionalinfo', JSON.stringify(additionalinfo));
    try {
      await axios.post(`api/additional-informations`, formData2).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      });
    } catch (error) {
      errorToast(error)
    }

    navigate('/branch/service-request');
  };

  const updateAdditionalDoc = async (e, index, name1) => {
    e.preventDefault();
    const file = pickDocument(e);
    if (file === null) {
      return;
    }
    let temp = [...additionaldoc];
    temp[index] = { ...temp[index], [name1]: file };
    setAdditionalDoc(temp);
  };

  const updateAdditionalInfo = (e, index, name1) => {
    let temp = [...additionalinfo];
    temp[index] = { ...temp[index], [name1]: e.target.value };
    setAdditionalInfo(temp);
  };

  const isLoading = loading.files === true || loading.additionaldoc === true || loading.additionalinfo === true;

  useEffect(() => {
    getFiles();
    getAdditionalDocuments();
    getAdditionalInformations();
  }, []);

  return (
    <div>
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
        <h1 className="md:text-lg font-semibold ml-3">Service Request</h1>
      </div>

      {isLoading && (<div className="flex flex-1 h-[75vh] justify-center items-center">
        <img src={LoaderDark} className="w-8 h-8" />
      </div>)}

      {!isLoading && (
        <div className="bg-white p-6 rounded-md mb-5 h-fit ">
          <form onSubmit={submitDocument}>
            {uploadfiles.length === 0 && additionaldoc.length === 0 && additionalinfo.length === 0 && (
              <h1>No Documents to upload !!</h1>
            )}

            {/* upload files  */}
            {uploadfiles.length > 0 && (
              <div>
                <h1 className="font-semibold text-md">
                  Upload Files
                </h1>
                <hr className="mt-2 mb-4" />
                {uploadfiles?.map((item, index) => (
                  <div key={index} className='mb-4'>
                    <label
                      className="block text-xs md:text-sm font-medium text-gray-900 mb-2"
                      htmlFor="file_input"
                    >
                      Upload {item?.name} <span className="text-red-500">*</span>
                    </label>
                    <div className='flex items-center gap-3'>
                      <input
                        name="value"
                        type="file"
                        accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv'
                        onChange={(e) => updateFilesDetails(e, index, 'value')}
                        className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                        required={true}
                      />
                      {item.edit === 'edit' && item.value !== '' && (
                        <a
                          href={`${item.value}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 cursor-pointer focus:outline-none "
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>)}

            {/* upload additional documents  */}
            {additionaldoc.length > 0 && (
              <div>
                <h1 className="font-semibold text-md">
                  Additional Documents
                </h1>
                <hr className="mt-2 mb-4" />
                {additionaldoc?.map((item, index) => (
                  <div key={index} className='mb-4'>
                    <label
                      className="block text-xs md:text-sm font-medium text-gray-900 mb-2"
                      htmlFor="file_input"
                    >
                      Upload {item?.document_title}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className='flex items-center gap-3'>
                      <input
                        name="value"
                        type="file"
                        accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv'
                        onChange={(e) => updateAdditionalDoc(e, index, 'value')}
                        className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                        required={item.value === null ? true : false}
                      />
                      {item.value !== null && (
                        <a
                          href={`${item.value}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>)}


            {/* upload additional information  */}
            {additionalinfo.length > 0 && (
              <div>
                <h1 className="font-semibold text-md">
                  Additional Info
                </h1>
                <hr className="mt-2 mb-4" />
                {additionalinfo?.map((item, index) => (
                  <div key={index} className='mb-4' >
                    <label
                      className="block text-xs md:text-sm font-medium text-gray-900 mb-2"
                      htmlFor="file_input"
                    >
                      {item?.information_title}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="value"
                      type="text"
                      onChange={(e) => updateAdditionalInfo(e, index, 'value')}
                      className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                      value={item.value}
                      required={true}
                    />
                  </div>
                ))}
              </div>)}

            <CustomBtn type="submit" >Submit</CustomBtn>
          </form>
        </div>)}
    </div>
  );
};

export default BranchEditDoc;
