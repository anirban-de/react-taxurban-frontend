import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { CustomBtn, CustomInput } from '../../components';
import { LoaderDark } from '../../assets';
import { uploadFolders } from '../../utils/uploadFolders';
import { useQueryClient } from '@tanstack/react-query';
import useAwsS3 from '../../hooks/useAwsS3';
import { useLocation } from 'react-router-dom';
import { pickDocument } from '../../utils/pickDocument';
import { toast } from 'react-toastify';
import { errorToast } from '../../utils';

const UpdateClientDocument = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { id, clientId } = useParams();
    const { uploadMultipleToS3 } = useAwsS3();
    const [loading, setLoading] = useState(true);
    const [uploadfiles, setUploadFiles] = useState([]);
    const [additionaldoc, setAdditionalDoc] = useState([]);
    const [additionalinfo, setAdditionalInfo] = useState([]);
    const userType = location.pathname.split('/')[1];

    const getPendingDetails = async () => {
        try {
            const response = await Promise.all([
                axios.get(`api/get-sr/${id}`),
                axios.get(`api/get-additional-documents/${id}`),
                axios.get(`api/get-additional-informations/${id}`)
            ])

            if (response[0].data.status === 200) {
                let temp = [];
                response[0].data.srdocument.forEach((item) => {
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

            if (response[1].data.status === 200) {
                let temp = [];
                response[1]?.data?.additionaldoc?.sr_additional_document?.forEach(
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

            if (response[2].data.status === 200) {
                let temp = [];
                response[2]?.data?.additionalinfo?.sr_additional_information?.forEach(
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
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    const updateFilesDetails = async (e, index, name1) => {
        e.preventDefault();
        const file = pickDocument(e);
        if (file === null) {
            return;
        }
        let temp = [...uploadfiles];
        temp[index] = { ...temp[index], [name1]: file };
        setUploadFiles(temp);
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

    const submitDocument = async (e) => {
        e.preventDefault();

        const Dynamic_upload_AWS_files = [...uploadfiles];

        const ImagesUploadResponse = await uploadMultipleToS3(Dynamic_upload_AWS_files.map(item => {
            if (item.value !== '') {
                return item.value;
            } else {
                return null;
            }
        }), `${uploadFolders.SRFiles}/${clientId}`);

        if (ImagesUploadResponse.success) {
            ImagesUploadResponse.responses.forEach((item, index) => {
                if (item?.data?.file_path) {
                    Dynamic_upload_AWS_files[index] = {
                        ...Dynamic_upload_AWS_files[index],
                        value: item.data.file_path,
                    }
                }
            });
        }

        console.log(Dynamic_upload_AWS_files);
        setUploadFiles(Dynamic_upload_AWS_files);

        const formData = new FormData();
        formData.append('id', id);
        formData.append('uploadfiles', JSON.stringify(Dynamic_upload_AWS_files));

        try {
            await axios({
                method: 'post',
                url: `api/${userType}/document-update`,
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

        const Dynamic_upload_AWS_additional_files = [...additionaldoc];

        const ImagesUploadResponseAdditional = await uploadMultipleToS3(Dynamic_upload_AWS_additional_files.map(item => {
            if (item.value !== '') {
                return item.value;
            } else {
                return null;
            }
        }), `${uploadFolders.SRFiles}/${clientId}`);

        if (ImagesUploadResponseAdditional.success) {
            ImagesUploadResponseAdditional.responses.forEach((item, index) => {
                if (item?.data?.file_path) {
                    Dynamic_upload_AWS_additional_files[index] = {
                        ...Dynamic_upload_AWS_additional_files[index],
                        value: item.data.file_path,
                    }
                }
            });
        }

        console.log(Dynamic_upload_AWS_additional_files);
        setAdditionalDoc(Dynamic_upload_AWS_additional_files);

        const formData1 = new FormData();
        formData1.append('sr_id', id);
        formData1.append('additionaldocs', JSON.stringify(Dynamic_upload_AWS_additional_files));
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

        queryClient.removeQueries(['SR']);
        navigate(-1);
    };

    const noDocuments = uploadfiles.length === 0 && additionaldoc.length === 0 && additionalinfo.length === 0

    useEffect(() => {
        getPendingDetails();
    }, []);

    return (
        <div>
            <div className="flex items-center mb-4">
                <FiArrowLeft
                    size={24}
                    onClick={() => navigate(-1)}
                    className="cursor-pointer"
                />
                <h1 className="md:text-lg font-semibold ml-3">Upload Document & Info</h1>
            </div>

            {loading && (<div className="flex flex-1 h-[75vh] justify-center items-center">
                <img src={LoaderDark} className="w-8 h-8" />
            </div>)}

            {!loading &&
                <div className='bg-white p-6 rounded-md mb-5 h-fit'>
                    <form onSubmit={submitDocument}>

                        {noDocuments && (
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
                                            <CustomInput
                                                name="value"
                                                type="file"
                                                accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv'
                                                placeholder={`Enter ${item?.name}`}
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
                                            <CustomInput
                                                name="value"
                                                type="file"
                                                accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv'
                                                placeholder={`Enter ${item?.document_title}`}
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
                                        <CustomInput
                                            name="value"
                                            type="text"
                                            placeholder={`Enter ${item?.information_title}`}
                                            onChange={(e) => updateAdditionalInfo(e, index, 'value')}
                                            className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                            value={item.value}
                                            required={true}
                                        />
                                    </div>
                                ))}
                            </div>)}

                        {!noDocuments &&
                            <div className='mt-4'>
                                <CustomBtn type="submit" >Submit</CustomBtn>
                            </div>
                        }
                    </form>
                </div>
            }
        </div>
    );
};

export default UpdateClientDocument;
