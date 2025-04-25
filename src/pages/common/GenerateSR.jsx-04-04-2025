import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { FiArrowLeft, FiExternalLink, FiTrash } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomInput from '../../components/shared/CustomInput';
import CustomSelect from '../../components/shared/CustomSelect';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import CustomBtn from '../../components/shared/CustomBtn';
import useAwsS3 from '../../hooks/useAwsS3';
import { uploadFolders } from '../../utils/uploadFolders';
import { toast } from 'react-toastify';
import { pickDocument } from '../../utils/pickDocument';
import { errorToast } from '../../utils';

const getAllClients = async () => {
    const response = await axios.get('api/customer/get-all-client')
    return response.data.client.map((client) => ({
        name: `${client.name}-${client.client_id}`,
        value: client.client_id
    }));
}

const GenerateSR = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userType = location.pathname.split('/')[1];

    const { data: allclient } = useQuery({
        queryKey: ['allclients'],
        queryFn: getAllClients,
        staleTime: 10 * 1000
    })

    const { uploadMultipleToS3 } = useAwsS3();
    const [packageSelect, setPackageSelect] = useState(false);

    const [categorySelect, setCategorySelect] = useState("");

    const [remarks, setRemarks] = useState('');
    const [clientPackages, setClientPackages] = useState([]);
    const [tokenmoney, setTokenMoney] = useState(0);
    const [informRequired, setInformRequired] = useState([]);
    const [servicetype, setServiceType] = useState('select');
    const [clienttype, setClientType] = useState('select');
    const [uploadinform, setUploadInform] = useState([]);
    const [uploadfiles, setUploadFiles] = useState([]);
    const [serviceid, setServiceId] = useState(0);
    const [servicehead1, setServiceHead1] = useState([]);
    const [servicehead2, setServiceHead2] = useState([]);
    const [servicehead3, setServiceHead3] = useState(0);
    const [balance, setBalance] = useState(0);
    const [clientDetails, setClientDetails] = useState({
        package_id: '',
        client_tb_id: '',
        client_id: '',
        name: '',
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
    const [searching, setSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [extrainfo, setExtraInfo] = useState({
        panOrg: '',
        kartaName: '',
        directorName: '',
        presidentName: '',
    });
    const [serviceDetails, setServiceDetails] = useState({
        category: '',
        serviceSL1: '',
        serviceSL2: '',
        serviceSL3: '',
        mobile: '',
        email: '',
    });
    const [allcategory, setAllCategory] = useState([]);
    const [moreFileData, setMoreFileData] = useState({
        name: '',
        file: '',
    });
    const [moreFiles, setMoreFiles] = useState([]);
    const ifNull = value => {
        if (value === null) {
            return '';
        }
        return value;
    };


    let address = `${ifNull(clientDetails?.flat_door_block_no)} ${ifNull(
        clientDetails?.name_of_premises,
    )} ${ifNull(clientDetails?.road_street)} ${ifNull(
        clientDetails?.area_locality,
    )} ${ifNull(clientDetails?.city)} ${ifNull(clientDetails?.district)} ${ifNull(
        clientDetails?.pincode,
    )} `;

    const getBranch = async () => {
        try {
            const res = await axios.get(`api/branch/get-branch`)
            if (res.data.status === 200) {
                setBalance(res.data.branch.balance);
            }
        } catch (error) {
            errorToast(error)
        }
    }

    const getServiceHead1 = async (category) => {
        try {
            await axios
                .get(`api/get-service-head1/${servicetype}/${category}`)
                .then((res) => {
                    if (res.data.status === 200) {
                        let temp = res.data.servicehead1.map((element) => ({ name: element.name, value: element.id }));
                        setServiceHead1(temp);
                    }
                });
        } catch (error) {
            errorToast(error)
        }
    };

    const getServiceHead2 = async (head_1_id) => {
        try {
            await axios.get(`api/get-service-head2/${head_1_id}`).then((res) => {
                let temp = res.data.servicehead2.map((element) => ({
                    name: element.name,
                    value: element.id,
                }));
                setServiceHead2(temp);
                setTokenMoney(res.data.service.token_money);
                if (userType === "branch" && res.data.service.token_money > balance) {
                    toast.warning('Insufficient Balance');
                }
                setServiceId(res.data.service.id);
                setInformRequired(res.data.inform_required);
                let temp1 = [];
                setUploadInform([]);
                res.data.inform_required.forEach((item) => {
                    temp1.push({
                        id: item.id,
                        type: item.type,
                        value: '',
                        particulars: item.particulars,
                        mandatory: item.mandatory,
                        edit: '',
                        class: item.class,
                    });
                });
                setUploadInform(temp1);
                getAllDocuments(res.data.service.id);
            });
        } catch (error) {
            errorToast(error)
        }
    };

    const getServiceHead3 = async (head_2_id) => {
        setServiceHead3(head_2_id);
    };

    const getServiceCategories = async (servicetype) => {
        try {
            await axios
                .get(`api/get-service-categories/${servicetype}`)
                .then((res) => {
                    if (res.data.status === 200) {
                        setAllCategory(res.data.allcategory);
                    }
                });
        } catch (error) {
            errorToast(error)
        }
    };

    const getAllDocuments = async (id) => {
        try {
            const type_name = 'sr';
            await axios
                .get(`api/admin/get-documents/${id}/${type_name}`)
                .then((res) => {
                    if (res.data.status === 200) {
                        let temp = [];
                        res.data.docs.forEach((item) => {
                            temp.push({
                                id: item.id,
                                name: item.name,
                                value: '',
                                file_id: '',
                                mandatory: item.mandatory,
                                edit: '',
                            });
                        });
                        setUploadFiles(temp);
                    }
                });
        } catch (error) {
            errorToast(error)
        }
    };

    const getClientDetails = async (id) => {
        setSearching(true);
        getServiceHead1(20);
        try {
            await axios.get(`api/get-client-info/${id}`).then((res) => {
                //console.log(res.data);
                if (res.data.status === 200) {
                    setClientDetails({
                        ...res.data.client,
                        client_tb_id: res.data.client.id,
                        name: res.data.client.name,
                        fatherName: res.data.client.father_name,
                        address:
                            res.data.client.name_of_premises +
                            ', ' +
                            res.data.client.road_street,
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
                    setClientType(res.data.client.client_type);
                    setClientPackages(res.data.client_packages);
                    getServiceCategories(res.data.client.client_type);
                    
                }
            });
        } catch (error) {
            errorToast(error)
        } finally {
            setSearching(false);
        }
    };

    const updateClientDetails = async (e) => {
        const { name, value } = e.target;
        if(value.length < 0){
            setPackageSelect(false);
            setCategorySelect("");
            return;
        }
        setClientDetails({ ...clientDetails, [name]: value });

        if (e.target.type === 'select-one') {
            getClientDetails(value);
        }
        if(name === "package_id" && value !== "")
        {   //console.log(name+" "+value+" "+"true");
            setPackageSelect(true);
            setCategorySelect(20); 
        }  
    };

    const updateCategory = (e) => {
        setCategorySelect(e.target.value);
    };

    const updateExtraDetails = (e) => {
        const { name, value } = e.target;
        setExtraInfo({ ...extrainfo, [name]: value });
    };

    const updateFilesDetails = async (e, index, name1) => {
        e.preventDefault();
        const file = pickDocument(e);
        if (file === null) {
            return;
        }
        let temp = [...uploadfiles];
        temp[index] = { ...temp[index], [name1]: file, file_id: null };
        setUploadFiles(temp);
    };

    const updateServiceDetails = (e) => {
        const { name, value } = e.target;
        setServiceDetails({ ...serviceDetails, [name]: value });
    };

    const dynamicLabel = () => {
        if (servicetype === '') {
            return '';
        }
        return `of ${servicetype}`;
    };

    const handledocumentChange = (e, index) => {
        let temp = [...uploadinform];
        temp[index] = { ...temp[index], [e.target.name]: e.target.value };
        setUploadInform(temp);
    };

    const validateUploadInform = (uploadinform) => {
        uploadinform.forEach((element) => {
            let error_msg = document.getElementById(`error_inform_${element.id}`);
            error_msg.innerHTML = '';
        })

        let flag = 0;

        uploadinform.forEach((item) => {
            if (item.mandatory || (item.value !== '' && !item.mandatory)) {
                if (item.class === 'Name') {
                    const regpan = /^[A-Za-z\s]+$/;

                    if (regpan.test(item.value)) {
                        // valid name
                    } else {
                        let error_msg = document.getElementById(`error_inform_${item.id}`);
                        error_msg.innerHTML = '*Name Not Valid - eg : John Doe';
                        flag = 1;
                    }
                } else if (item.class === 'Date') {
                    const regpan = /^([0-9]){2}-([0-9]){2}-([0-9]){4}/;

                    if (regpan.test(item.value)) {
                        // valid date
                    } else {
                        let error_msg = document.getElementById(`error_inform_${item.id}`);
                        error_msg.innerHTML = '*Date Not Valid - eg : 25-12-2022';
                        flag = 1;
                    }
                } else if (item.class === 'PAN') {
                    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

                    if (regpan.test(item.value)) {
                        // valid pan card number
                    } else {
                        let error_msg = document.getElementById(`error_inform_${item.id}`);
                        error_msg.innerHTML = '*Pan Number Not Valid - eg : ABLPM8988L';
                        flag = 1;
                    }
                } else if (item.class === 'Aadhar') {
                    const regpan = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;

                    if (regpan.test(item.value)) {
                        // valid aadhar card number
                    } else {
                        let error_msg = document.getElementById(`error_inform_${item.id}`);
                        error_msg.innerHTML =
                            '*Aadhar Number Not Valid - eg : 499118665246';
                        flag = 1;
                    }
                } else if (item.class === 'GSTIN') {
                    const regpan =
                        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

                    if (regpan.test(item.value)) {
                        // valid gstin number
                    } else {
                        let error_msg = document.getElementById(`error_inform_${item.id}`);
                        error_msg.innerHTML =
                            '*GSTIN Number Not Valid - eg : 18AABCU9603R1ZM';
                        flag = 1;
                    }
                } else if (item.class === 'Mobile') {
                    const regpan = /^\d{10}$/;

                    if (regpan.test(item.value)) {
                        // valid mobile number
                    } else {
                        let error_msg = document.getElementById(`error_inform_${item.id}`);
                        error_msg.innerHTML = '*Mobile Number Not Valid - eg : 6766188991';
                        flag = 1;
                    }
                } else if (item.class === 'Email') {
                    const regpan =
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    if (item.value.toLowerCase().match(regpan)) {
                        // valid email id
                    } else {
                        let error_msg = document.getElementById(`error_inform_${item.id}`);
                        error_msg.innerHTML = '*Email Not Valid - eg : info@example.com';
                        flag = 1;
                    }
                }
            }
        });

        return flag;
    };

    //console.log(clientDetails);

    const submitSR = async (e) => {
        e.preventDefault();
        setLoading(true);

        let flag = 0;

        flag = validateUploadInform(uploadinform);

        if (flag) {
            setLoading(false);
            return;
        }

        try {

            const Dynamic_upload_AWS_files = [...uploadfiles];
            const Dynamic_upload_AWS_files_more = [...moreFiles];

            const ImagesUploadResponse = await uploadMultipleToS3(uploadfiles.map(item => {
                if (item.value !== '') {
                    return item.value;
                } else {
                    return null;
                }
            }), `${uploadFolders.SRFiles}/${clientDetails.client_id}`);

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

            const ImagesUploadResponseMore = await uploadMultipleToS3(moreFiles.map(item => {
                if (item.file !== '') {
                    return item.file;
                } else {
                    return null;
                }
            }), `${uploadFolders.SRFiles}/${clientDetails.client_id}`);

            if (ImagesUploadResponseMore.success) {
                ImagesUploadResponseMore.responses.forEach((item, index) => {
                    if (item?.data?.file_path) {
                        Dynamic_upload_AWS_files_more[index] = {
                            ...Dynamic_upload_AWS_files_more[index],
                            file: item.data.file_path,
                        }
                    }
                });
            }

            // console.log(Dynamic_upload_AWS_files);
            // console.log(Dynamic_upload_AWS_files_more);

            const formData = new FormData();
            // formData.append('id', 0);
            formData.append('servicetype', servicetype);
            formData.append('service_id', serviceid);
            formData.append('servive_head_level_1_id', serviceDetails.serviceSL1);
            formData.append('servive_head_level_2_id', serviceDetails.serviceSL2);
            formData.append('servive_head_level_3', serviceDetails.serviceSL3);
            formData.append('client_tb_id', clientDetails.client_tb_id);
            formData.append('package_id', clientDetails.package_id);
            formData.append('sr_by', userType);
            formData.append('remarks', remarks);
            formData.append('informRequired', informRequired);
            formData.append('uploadinform', JSON.stringify(uploadinform));
            formData.append('uploadfiles', JSON.stringify(Dynamic_upload_AWS_files));
            formData.append('moreFiles', JSON.stringify(Dynamic_upload_AWS_files_more));

            setUploadFiles(Dynamic_upload_AWS_files);
            setMoreFiles(Dynamic_upload_AWS_files_more);

            await axios({
                method: 'post',
                url: `api/generate-sr`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then((res) => {
                if (res.data.status === 200) {
                    Swal.fire({
                        title: 'Success!',
                        text: res.data.message,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        timer: 3000,
                    });

                    navigate(-1);
                } else if (res.data.status === 400) {
                    let error = '';
                    for (let key in res.data?.validation_errors) {
                        error += res.data?.validation_errors[key] + ' ';
                    }
                    errorToast(error);
                }
            });
        } catch (error) {
            errorToast(error)
        } finally {
            setLoading(false);
        }
    };

    const moreFilesInputRef = useRef();

    const updateMoreFilesDetails = async (e) => {
        e.preventDefault();
        const file = pickDocument(e);
        if (file === null) {
            return;
        }
        setMoreFileData({ ...moreFileData, file: file });
    };

    const addFiles = (e) => {
        e.preventDefault();

        if (moreFileData.name === '' || moreFileData.file === '') {
            return alert('both fields are required');
        }

        let temp = [...moreFiles];
        temp.push(moreFileData);
        setMoreFiles(temp);
        setMoreFileData({ name: '', file: '' });
        moreFilesInputRef.current.value = '';
    };

    const deleteImage = (idx) => {
        let temp = [...moreFiles].filter((_, index) => index !== idx);
        setMoreFiles(temp);
    };

    const renderSubmitBtn = () => {
        if (userType === "branch" && balance < tokenmoney) {
            return null;
        } else {
            return (
                <CustomBtn type="submit" loading={loading}>
                    Submit
                </CustomBtn>
            )
        }
    }

    useEffect(() => {
        if (userType === 'branch') {
            getBranch();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className="flex items-center mb-4">
                <FiArrowLeft
                    size={24}
                    onClick={() => navigate(-1)}
                    className="cursor-pointer"
                />
                <h1 className="md:text-lg font-semibold ml-3">Generate Service Request</h1>
            </div>

            <section>
                <form onSubmit={submitSR} encType="multipart/form-data">
                    {/* select client */}
                    <div className="bg-white p-6 rounded-md mb-5">
                        <h1 className="font-semibold md:text-lg">Client Selection</h1>
                        <hr className="my-3" />
                        {(userType === "branch" || userType === "admin" || userType === "verificationteam") ?
                            <div className="flex mt-3 justify-between items-end gap-3">
                                <div className="w-full">
                                    <CustomInput
                                        placeholder={'Enter Client ID'}
                                        label={`Enter Client ID`}
                                        value={clientDetails.client_id}
                                        name="client_id"
                                        onChange={updateClientDetails}
                                    />
                                </div>
                                <CustomBtn loading={searching} onClick={() => getClientDetails(clientDetails.client_id)} >Search </CustomBtn>
                            </div> :
                            <div className="flex mt-3 justify-between items-start gap-3">
                                <div className="w-full">
                                    <CustomSelect
                                        label={'Select Client'}
                                        options={allclient}
                                        value={clientDetails.client_id}
                                        name="client_id"
                                        onChange={updateClientDetails}
                                        defaultOption={'Select'}
                                    />
                                </div>
                            </div>
                        }
                        {clientPackages.length > 0 && clientDetails.client_id !== '' && (
                            <div className="flex mt-3 justify-between items-end gap-3">
                                <div className="w-full">
                                    <label className="block mb-2  text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Select Package
                                    </label>
                                    <select
                                        onChange={updateClientDetails}
                                        name="package_id"
                                        className=" mb-2bg-gray-50 border border-gray-300 text-gray-900  text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                    >
                                        <option value="">Select Package</option>
                                        {clientPackages.map((option, index) => (
                                            <option value={option?.id} key={index}>
                                                {`${option?.package_id} (${clientDetails.name} ${clientDetails.gst})`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {clienttype !== 'select' && (
                        <div className="grid md:grid-cols-2 md:gap-5">
                            {/* client details  */}
                            <div className="bg-white p-6 rounded-md mb-5">
                                <h1 className="font-semibold md:text-lg">Client's Details</h1>
                                <hr className="my-3" />
                                <div className="flex flex-col gap-4">
                                    <CustomInput
                                        placeholder={'Client Type'}
                                        label={`Client Type`}
                                        value={clienttype}
                                        readOnly
                                    />
                                    <CustomInput
                                        placeholder={'Enter name'}
                                        label={`Name ${dynamicLabel()}`}
                                        value={clientDetails.name}
                                        name="name"
                                        onChange={updateClientDetails}
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
                                        onChange={updateClientDetails}
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
                                            value={address.trim()}
                                            name="address"
                                            onChange={updateClientDetails}
                                            readOnly
                                        ></textarea>
                                    </div>
                                    {servicetype === 'HUF' && (
                                        <CustomInput
                                            label={`Karta's Name`}
                                            value={extrainfo.kartaName}
                                            name="kartaName"
                                            onChange={updateExtraDetails}
                                            readOnly
                                        />
                                    )}
                                    {servicetype === 'Company' && (
                                        <CustomInput
                                            label={`Director's Name`}
                                            value={extrainfo.directorName}
                                            name="directorName"
                                            onChange={updateExtraDetails}
                                            readOnly
                                        />
                                    )}
                                    {servicetype === 'Trust' && (
                                        <CustomInput
                                            label={`President's/Trustee's Name`}
                                            value={extrainfo.presidentName}
                                            name="presidentName"
                                            onChange={updateExtraDetails}
                                            readOnly
                                        />
                                    )}
                                    <CustomInput
                                        label={`PAN`}
                                        value={clientDetails.pan}
                                        name="pan"
                                        readOnly
                                    />

                                    <CustomInput
                                        label={`Adhar`}
                                        value={clientDetails.adhar}
                                        name="adhar"
                                        readOnly
                                    />
                                    <CustomInput
                                        label={`GSTIN`}
                                        value={clientDetails.gst}
                                        name="gst"
                                        readOnly
                                    />
                                    <CustomInput
                                        label={`Mobile`}
                                        value={clientDetails.mobile}
                                        name="mobile"
                                        readOnly
                                    />
                                    <CustomInput
                                        label={`Alt Mobile`}
                                        value={clientDetails.altMobile}
                                        name="altMobile"
                                        readOnly
                                    />
                                    <CustomInput
                                        label={`Email`}
                                        value={clientDetails.email}
                                        name="email"
                                        onChange={updateClientDetails}
                                        readOnly
                                    />
                                    <CustomInput
                                        placeholder={`Select State`}
                                        label={`State`}
                                        value={clientDetails.state}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* service details  && documents */}
                            <div>
                                <div className="bg-white p-6 rounded-md mb-5 h-fit ">
                                    <div className="flex  md:items-center justify-between flex-col md:flex-row ">
                                        <h1 className="font-semibold md:text-lg">Service Details</h1>
                                        <span>Token Money : ₹ {tokenmoney}</span>
                                    </div>
                                    <hr className="my-3" />
                                    <div className="flex flex-col gap-4">
                                        <label className="block mb-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Select Category
                                        </label>
                                        <select
                                            name="category"
                                            onChange={(e) => {
                                                updateCategory(e);
                                                updateServiceDetails(e);
                                                getServiceHead1(e.target.value);
                                            }}
                                            value={categorySelect}
                                            className=" mb-2bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                        >
                                            <option>Select</option>
                                            {allcategory.map((option, index) => (
                                                <option
                                                    value={option?.id}
                                                    key={index}
                                                    disabled={packageSelect}
                                                    // selected={option?.id === 20}

                                                >
                                                    {option?.category_name}
                                                </option>
                                            ))}
                                        </select> 
                                        <CustomSelect
                                            label={'Service Head Level 1'}
                                            options={servicehead1}
                                            value={serviceDetails.serviceSL1}
                                            name="serviceSL1"
                                            onChange={(e) => {
                                                updateServiceDetails(e);
                                                getServiceHead2(e.target.value);
                                            }}
                                            defaultOption={'Select'}
                                        />
                                        <CustomSelect
                                            label={'Service Head Level 2'}
                                            options={servicehead2}
                                            value={serviceDetails.serviceSL2}
                                            name="serviceSL2"
                                            onChange={(e) => {
                                                updateServiceDetails(e);
                                                getServiceHead3(e.target.value);
                                            }}
                                            defaultOption={'Select'}
                                        />
                                        {servicehead3 === 22 && (
                                            <input
                                                placeholder={`Enter Here`}
                                                name="serviceSL3"
                                                defaultValue={serviceDetails.serviceSL3}
                                                className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                                onChange={updateServiceDetails}
                                                type="text"
                                            />
                                        )}
                                    </div>
                                </div>

                                {uploadinform?.length > 0 && (
                                    <div className="bg-white p-6 rounded-md mb-5 h-fit ">
                                        <h1 className="font-semibold md:text-lg">More Informations</h1>
                                        <hr className="my-3" />
                                        <div className="flex flex-col gap-4">
                                            {uploadinform?.map((doc, index) => (
                                                <div key={index}>
                                                    <label
                                                        className="block text-xs md:text-sm font-medium capitalize text-gray-900 mb-2"
                                                        htmlFor="file_input"
                                                    >
                                                        {doc.particulars}{' '}
                                                        {doc.mandatory ? (
                                                            <span className="text-red-500">*</span>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </label>
                                                    {doc.type === 'text' && (
                                                        <input
                                                            name="value"
                                                            value={doc.value}
                                                            onChange={(e) => handledocumentChange(e, index)}
                                                            className="block w-full text-xs md:text-sm text-gray-900 rounded-lg border border-gray-300"
                                                            id="file_input"
                                                            type="text"
                                                            required={doc.mandatory ? true : false}
                                                        />
                                                    )}
                                                    {doc.type === 'date' && (
                                                        <input
                                                            name="value"
                                                            value={doc.value}
                                                            onChange={(e) => handledocumentChange(e, index)}
                                                            className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                                            id="file_input"
                                                            type="text"
                                                            required={doc.mandatory ? true : false}
                                                        />
                                                    )}
                                                    {doc.type === 'number' && (
                                                        <input
                                                            name="value"
                                                            value={doc.value}
                                                            onChange={(e) => handledocumentChange(e, index)}
                                                            className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                                            id="file_input"
                                                            type="text"
                                                        />
                                                    )}
                                                    {doc.type === 'checkbox' && (
                                                        <select
                                                            name="value"
                                                            value={doc.value}
                                                            onChange={(e) => handledocumentChange(e, index)}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    )}
                                                    <small
                                                        className="text-red-500 error_inform"
                                                        id={`error_inform_${doc.id}`}
                                                    ></small>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {uploadfiles?.length > 0 && (
                                    <div className="bg-white p-6 rounded-md mb-5 h-fit ">
                                        <h1 className="font-semibold md:text-lg">Upload Documents</h1>
                                        <hr className="my-3" />
                                        {/* dynamic files */}
                                        <div className="flex flex-col gap-4 mb-4">
                                            {uploadfiles?.map((item, index) => (
                                                <div key={index}>
                                                    <label
                                                        className="block text-xs md:text-sm font-medium text-gray-900 mb-2"
                                                        htmlFor="file_input"
                                                    >
                                                        Upload {item?.name}{' '}
                                                        {item.mandatory ? (
                                                            <span className="text-red-500">*</span>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </label>
                                                    <input
                                                        name="value"
                                                        onChange={(e) =>
                                                            updateFilesDetails(e, index, 'value')
                                                        }
                                                        className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                                                        id="file_input"
                                                        type="file"
                                                        accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv'
                                                        required={
                                                            item.mandatory && item.edit !== 'edit'
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {item.edit === 'edit' && item.value !== null && (
                                                        <a
                                                            href={`${item.value}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-blue-500"
                                                        >
                                                            View
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* more files section  */}
                                        <div className="flex flex-col gap-4 ">
                                            {/* add more files section  */}
                                            <h2 className='text-sm' >Add More Files</h2>
                                            <CustomInput
                                                value={moreFileData.name}
                                                onChange={(e) =>
                                                    setMoreFileData({
                                                        ...moreFileData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter File Name"
                                            />

                                            <div className="flex flex-col md:flex-row gap-3">
                                                <input
                                                    ref={moreFilesInputRef}
                                                    onChange={updateMoreFilesDetails}
                                                    className="block flex-1 text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                                                    type="file"
                                                    accept='image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv'
                                                />
                                                <CustomBtn onClick={addFiles}>
                                                    Add +
                                                </CustomBtn>
                                            </div>
                                            {/* show all more files  */}
                                            {moreFiles.length > 0 && (
                                                <div className="flex flex-col gap-3">
                                                    <h1>More Files</h1>
                                                    {moreFiles?.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="border-2 px-3 py-2 bg-white flex items-center justify-between "
                                                        >
                                                            <p>{item.name}</p>
                                                            <div className="flex gap-2">
                                                                <a
                                                                    href={item.file}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    <FiExternalLink />
                                                                </a>
                                                                <FiTrash onClick={() => deleteImage(index)} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* remarks section  */}
                    {clienttype !== 'select' && (
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
                                    />
                                </div>
                                {renderSubmitBtn()}
                            </div>
                        </div>)}
                </form>
            </section>
        </div>
    );
}

export default GenerateSR;