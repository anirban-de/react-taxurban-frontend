import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import { CustomBtn, CustomInput, CustomSelect } from '../../components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { AiOutlineDelete } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { deleteServiceRequestSlide } from '../../redux/ServiceRequestSlice';
import ActionBtn from '../../components/shared/ActionBtn';
import useAwsS3 from '../../hooks/useAwsS3';
import { LoaderDark } from '../../assets';
import { uploadFolders } from '../../utils/uploadFolders';
import { pickDocument } from '../../utils/pickDocument';
import CustomTables from '../../components/shared/CustomTables';
import { Swalwait, errorToast } from '../../utils';

const EditServiceRequest = () => {
    const dispatch = useDispatch();
    const tableHeadingsClientDoc = ['Document', 'View', 'Action'];
    const additionalHeadings = ['Title', 'View', 'Delete'];
    const additionalInfoHeadings = ['Title', 'Value', 'Delete'];
    const { id } = useParams();
    const location = useLocation();
    const { deleteFromS3 } = useAwsS3();
    const userType = location.pathname.split('/')[1];
    const [payment, setPayment] = useState([]);
    const navigate = useNavigate();
    const [remarks, setRemarks] = useState('');
    const [tokenmoney, setTokenMoney] = useState(0);
    const [informRequired, setInformRequired] = useState([]);
    const [allstaff, setAllStaff] = useState([]);
    const [assignstaff, setAssignStaff] = useState('');
    const [servicetype, setServiceType] = useState('select');
    const [clienttype, setClientType] = useState('select');
    const [clientPackages, setClientPackages] = useState([]);
    const [uploadinform, setUploadInform] = useState([]);
    const [uploadfiles, setUploadFiles] = useState([]);
    const [srinformation, setSRInformation] = useState([]);
    const [srdocument, setSRDocument] = useState([]);
    const [SRPackage, setSRPackage] = useState(0);
    // const [editedcategory, setEditedCategory] = useState(0);
    const [serviceid, setServiceId] = useState(0);
    const [servicehead1, setServiceHead1] = useState([]);
    const [servicehead2, setServiceHead2] = useState([]);
    const { downloadFromS3, isFileDownloading, uploadToS3 } = useAwsS3();
    const [servicehead3, setServiceHead3] = useState(0);
    const [clientDetails, setClientDetails] = useState({
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
        package_id: ''
    });
    const [preferredamt, setPreferredAmt] = useState(null);
    const [allcustomer, setAllcustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
    const [category, setCategory] = useState(0);
    const [allcategory, setAllCategory] = useState([]);
    const [headlevel1, setHeadLevel1] = useState('');
    const [totalamount, setTotalAmount] = useState(0);
    const [showStatusAccept, setShowStatusAccept] = useState({});
    const [showFinalDocument, setShowFinalDocument] = useState({});
    const [showEditDocBtn, setShowEditDocBtn] = useState(0);
    const [clientextradoc, setClientextradoc] = useState([]);
    const [clientdoc, setClientDoc] = useState([
        {
            id: 0,
            value: '',
            file_id: '',
        },
    ]);

    const [btnDisable,setBtnDisable] = useState("");
    const [packageDisable,setPackageDisable] = useState("");

    const [gstpackage,setGstPackage] = useState({});

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

    const SR_STATUS_MODES = () => {
        let MODES = [
            {
                name: 'Accepted',
                value: 'Accepted',
            },
            {
                name: 'Pending',
                value: 'Pending',
            },
            {
                name: 'Rejected',
                value: 'Rejected',
            },
            {
                name: 'Verification',
                value: 'Verification',
            },
        ];

        if (srstatus.mode === 'Processing') {
            return MODES.filter((item) => item.value !== 'Accepted');
        }


        return MODES;
    }

    const [srstatus, setSRStatus] = useState({
        mode: '',
        reason: '',
    });

    const [additionaldoc, setAdditionalDoc] = useState([
        {
            id: 0,
            document_title: '',
            value: '',
        },
    ]);

    const [additionalinfo, setAdditionalInfo] = useState([
        {
            id: 0,
            information_title: '',
            value: '',
        },
    ]);

    const getStaff = async () => {
        try {
            await axios.get(`api/department/all-department-staff`).then((res) => {
                if (res.data.status === 200) {
                    let temp = [];
                    res.data.all_staff.forEach((element) => {
                        temp.push({
                            name: element.name,
                            value: element.user_id,
                        });
                    });
                    setAllStaff(temp);
                }
            });
        } catch (error) {
            errorToast(error)
        }
    };

    const getAssignStaff = async () => {
        try {
            await axios.get(`api/department/get-assign-staff/${id}`).then((res) => {
                if (res.data.status === 200) {
                    setAssignStaff(res.data.srstaff.staff_id);
                }
            });
        } catch (error) {
            errorToast(error)
        }
    };

    const getClientAddiDocs = async (id) => {
        try {
            await axios.get(`api/get-sr-client-addi-docs/${id}`).then((res) => {
                if (res.data.status === 200) {
                    let temp = res.data.result.map((element) => ({ doc: element.doc_type, link: element.doc_link }));
                    setClientextradoc(temp);
                }
            });
        } catch (error) {
            errorToast(error)
        }
    };

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
                let temp = res.data.servicehead2.map((element) => ({ name: element.name, value: element.id }));
                setServiceHead2(temp);
                setTokenMoney(res.data.service.token_money);
                setServiceId(res.data.service.id);
                setInformRequired(res.data.inform_required);
                if (headlevel1 === head_1_id && typeof id !== 'undefined') {
                    setUploadInform(srinformation);
                    setUploadFiles(srdocument);
                } else {
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
                }
            });
        } catch (error) {
            errorToast(error)
        }
    };

    const getServiceHeadEdit = async (
        level_1_id,
        level_2_id,
        level_3,
        srdocs,
        information,
        service_type,
        category
    ) => {
        try {
            await axios
                .get(`api/get-service-head1/${service_type}/${category}`)
                .then((res) => {
                    if (res.data.status === 200) {
                        let temp_array = res.data.servicehead1.map((element) => ({ name: element.name, value: element.id }));
                        setServiceHead1(temp_array);
                        axios.get(`api/get-service-head2/${level_1_id}`).then((res) => {
                            let temp_array1 = res.data.servicehead2.map((element) => ({ name: element.name, value: element.id }));
                            setServiceHead2(temp_array1);
                        });
                        serviceDetails.serviceSL2 = level_2_id;

                        setServiceHead3(level_2_id);
                        serviceDetails.serviceSL3 = level_3;

                        // setTokenMoney(res.data.tokenmoney);
                        // setInformRequired(res.data.inform_required);
                        setUploadInform([]);
                        let temp = [];
                        information.forEach((item) => {
                            temp.push({
                                id: item.inform_id,
                                type: item.type,
                                value: item.value,
                                particulars: item.particulars,
                                mandatory: item.mandatory,
                                edit: 'edit',
                                class: item.class,
                            });
                        });
                        setUploadInform(temp);
                        //getAllDocuments(res.data.service_id);
                        let temp1 = [];
                        srdocs.forEach((item) => {
                            temp1.push({
                                id: item.service_document_map_id,
                                name: item.name,
                                value: item.document,
                                file_id: item.document_id,
                                mandatory: item.mandatory,
                                edit: 'edit',
                                is_edited: item.is_edited,
                            });
                        });
                        setUploadFiles(temp1);
                        setSRDocument(temp1);
                        //setServiceId(res.data.service_id);
                    }
                });
        } catch (error) {
            errorToast(error)
        }
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

    const getSR = async (id) => {
        try {
            await axios.get(`api/get-sr/${id}`).then((res) => {
                if (res.data.status === 200) {

                    let package_id = res.data.package_id;

                    if(res.data.package_id > 0){
                        
                        setGstPackage(res.data.package);


                        //added later
                        //const selectedPackage = res.data.client_packages.find((item) => item.id == res.data.package_id);
                        //setTotalAmount(selectedPackage?.base_price);
                    }


                    try {
                        axios
                            .get(`api/get-client-info/${res.data.client.client_id}`)
                            .then((rese) => {
                                if (rese.data.status === 200) {

                                    if(res.data.package_id > 0)
                                    {

                                        const selectedPackage = res.data.client_packages.find((item) => item.id == package_id);
                                        setTotalAmount(selectedPackage?.base_price);
                                        
                                    }

                                    setClientDetails({
                                        ...rese.data.client,
                                        client_tb_id: rese.data.client.id,
                                        client_id: rese.data.client.client_id,
                                        name: rese.data.client.name,
                                        fatherName: rese.data.client.father_name,
                                        address: rese.data.client.address,
                                        pan: rese.data.client.pan,
                                        adhar: rese.data.client.aadhar,
                                        gst: rese.data.client.gst,
                                        mobile: rese.data.client.mobile,
                                        altMobile: rese.data.client.alt_mobile,
                                        email: rese.data.client.email,
                                        state: rese.data.state.name,
                                        package_id: package_id
                                    });

                                    setExtraInfo({
                                        panOrg: rese.data.client.panOrg,
                                        kartaName: rese.data.client.kartaName,
                                        directorName: rese.data.client.directorName,
                                        presidentName: rese.data.client.presidentName,
                                    });
                                    setServiceType(rese.data.client.client_type);
                                    setClientType(rese.data.client.client_type);
                                    setClientPackages(res.data.client_packages);

                                }
                            });
                    } catch (error) {
                        errorToast(error)
                    }


                    setSRStatus({
                        mode: res.data.sr.status,
                        reason: res.data.sr.status_reason,
                    });

                    setSRPackage(res.data.sr.package_id);
                    setShowStatusAccept(res.data.sr_status_accepted_by);
                    setShowFinalDocument(res.data.sr_final_document_uploaded_by);
                    setShowEditDocBtn(res.data.sr.show_edit_doc_btn);
                    setTotalAmount(res.data.sr.total_amount);
                    setPreferredAmt(res.data.sr.preferred_amt);
                    serviceDetails.serviceSL1 = res.data.sr.service_head_level_1_id;
                    setHeadLevel1(res.data.sr.service_head_level_1_id);
                    setRemarks(res.data.sr.remarks);
                    setServiceType(res.data.service.service_type);
                    getServiceCategories(res.data.service.service_type);
                    setCategory(res.data.service.category_id);
                    setAllcustomer(res.data.customer);
                    // setEditedCategory(res.data.service.category_id);
                    setServiceId(res.data.service.id);
                    setTokenMoney(res.data.service.token_money);
                    let temp = [];
                    res.data.srinformation.forEach((item) => {
                        temp.push({
                            id: item.inform_id,
                            type: item.type,
                            value: item.value,
                            particulars: item.particulars,
                            mandatory: item.mandatory,
                            edit: 'edit',
                        });
                    });
                    setSRInformation(temp);
                    getServiceHeadEdit(
                        res.data.sr.service_head_level_1_id,
                        res.data.sr.service_head_level_2_id,
                        res.data.sr.service_head_level_3,
                        res.data.srdocument,
                        res.data.srinformation,
                        res.data.service.service_type,
                        res.data.service.category_id
                    );
                    if(res.data.sr.status == 'Processing'||res.data.sr.status == 'Completed'||res.data.sr.status == 'Closed'){
                        console.log('srstatus '+res.data.sr.status);
                        console.log('paymentstatus '+res.data.package.paymentstatus);
                        setBtnDisable("disabled");
                        setPackageDisable('paid');
                    }

                }
            });

        } catch (error) {
            errorToast(error)
        }
    };










    const getPayment = async () => {
        try {
            await axios.get(`api/get-payment-details/${id}`).then((res) => {
                if (res.data.status === 200) {
                    setPayment(res.data.sr);
                }
            });
        } catch (error) {
            errorToast(error)
        }
    };

    const getAdditionalDocuments = async () => {
        try {
            await axios.get(`api/get-additional-documents/${id}`).then((res) => {
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
            });
        } catch (error) {
            errorToast(error)
        }
    };

    const getAdditionalInformations = async () => {
        try {
            await axios.get(`api/get-additional-informations/${id}`).then((res) => {
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

    const updateClientDetails = async (e) => {
        const { name, value } = e.target;
        setClientDetails({ ...clientDetails, [name]: value });
        if(name === "package_id" && value !== "")
        {
            const selectedPackage = clientPackages.find((item) => item.id === value);
            setTotalAmount(selectedPackage.base_price);
        }
    };

    const updateSRStatus = async (e) => {
        const { name, value } = e.target;
        setSRStatus({ ...srstatus, [name]: value });
    };

    const updateExtraDetails = (e) => {
        const { name, value } = e.target;
        setExtraInfo({ ...extrainfo, [name]: value });
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

    const submitTotalAmount = async () => {
        const con = window.confirm('Are you sure to set this amount?');

        if (!con) {
            return;
        }

        if (tokenmoney > totalamount) {
            Swal.fire({
                title: 'Warning!',
                text: 'Total amount must be greater than token money',
                icon: 'warning',
                confirmButtonText: 'Ok',
            });
            return;
        }

        try {
            const data = {
                id: id,
                totalamount: totalamount,
            };

            await axios.post(`api/set-total-amount`, data).then((res) => {
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
    };

    const toggleSRDocEdit = async (service_doc_map_id, is_edited) => {
        const data = {
            sr_id: id,
            service_doc_map_id: service_doc_map_id,
            is_edited: is_edited === '0' ? 1 : 0,
        };

        await axios.post(`api/toggle-sr-document-edit`, data).then((res) => {
            if (res.data.status === 200) {
            }
        });
    };

    const toggleShowEditDocBtn = async (show_edit_doc_btn) => {
        setShowEditDocBtn(parseInt(show_edit_doc_btn) ? 0 : 1);

        const data = {
            sr_id: id,
            show_edit_doc_btn: parseInt(show_edit_doc_btn) ? 0 : 1,
        };

        await axios.post(`api/toggle-showeditdocbtn`, data).then((res) => {
            if (res.data.status === 200) {
            }
        });
    };

    const validateUploadInform = (uploadinform) => {
        uploadinform.forEach((element) => {
            let error_msg = document.getElementById(`error_inform_${element.id}`);
            error_msg.innerHTML = '';
        });

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

    const addAdditionalDocument = async () => {
        const formData = new FormData();
        formData.append('sr_id', id);
        formData.append('additionaldocs', JSON.stringify(additionaldoc));
        try {
            Swalwait();
            await axios.post(`api/additional-documents`, formData).then((res) => {
                if (res.data.status === 200) {
                    toast.success(res.data.message);
                }
                getAdditionalDocuments();
            });
        } catch (error) {
            errorToast(error)
        } finally {
            Swal.close();
        }
    };

    const addAdditionalInformation = async () => {
        const formData = new FormData();
        formData.append('sr_id', id);
        formData.append('additionalinfo', JSON.stringify(additionalinfo));
        try {
            Swalwait();
            await axios.post(`api/additional-informations`, formData).then((res) => {
                if (res.data.status === 200) {
                    toast.success(res.data.message);
                }
                getAdditionalInformations();
            });
        } catch (error) {
            errorToast(error)
        } finally {
            Swal.close();
        }
    };

    const assignStaff = async () => {
        if (assignstaff === '') {
            return;
        }

        const data = {
            sr_id: id,
            staff_id: assignstaff,
        };

        try {
            await axios.post(`api/department/assign-staff`, data).then((res) => {
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
    };

    const submitSR = async (e) => {
        setSubmitting(true);
        e.preventDefault();

        let flag = 0;

        flag = validateUploadInform(uploadinform);

        if (flag) return;

        const formData = new FormData();
        formData.append('id', id);
        formData.append('servicetype', servicetype);
        formData.append('service_id', serviceid);
        formData.append('servive_head_level_1_id', serviceDetails.serviceSL1);
        formData.append('servive_head_level_2_id', serviceDetails.serviceSL2);
        formData.append('servive_head_level_3', serviceDetails.serviceSL3);
        formData.append('client_tb_id', clientDetails.client_tb_id);
        formData.append('package_id', clientDetails.package_id);
        formData.append('sr_by', 'admin');
        formData.append('remarks', remarks);
        formData.append('informRequired', informRequired);
        formData.append('uploadinform', JSON.stringify(uploadinform));
        formData.append('uploadfiles', JSON.stringify(uploadfiles));

        try {
            await axios({
                method: 'post',
                url: `api/generate-sr`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then((res) => {
                if (res.data.status === 200) {
                    dispatch(deleteServiceRequestSlide());
                    Swal.fire({
                        title: 'Success!',
                        text: res.data.message,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        timer: 3000,
                    });

                    navigate(-1);
                } else {
                    console.log(res.data.result);
                    console.log(res.data.user_id);
                }
            });
        } catch (error) {
            errorToast(error)
        } finally {
            setSubmitting(false);
        }
    };

    const addMoreAdditionalDoc = (e) => {
        e.preventDefault();
        let temp = [...additionaldoc];
        temp.push({
            id: 0,
            document_title: '',
            value: '',
        });
        setAdditionalDoc(temp);
    };

    const addMoreAdditionalInfo = (e) => {
        e.preventDefault();
        let temp = [...additionalinfo];
        temp.push({
            id: 0,
            information_title: '',
            value: '',
        });
        setAdditionalInfo(temp);
    };

    const deleteAdditionalDoc = async (doc_id, index, imageURL) => {
        const con = window.confirm('Are you sure to delete this document ?');
        if (!con) {
            return;
        }

        let temp = [...additionaldoc];
        temp.splice(index, 1);
        setAdditionalDoc(temp);

        if (doc_id > 0) {
            try {
                Swalwait();
                const imagedeleteRes = await deleteFromS3(imageURL);
                if (imagedeleteRes?.success) {
                    const res = await axios.get(`api/delete-additional-doc/${doc_id}`)
                    if (res.data.status === 200) {
                        toast.success(res.data.message);
                    }
                }
            } catch (error) {
                errorToast(error)
            } finally {
                Swal.close();
            }
        }
    };

    const deleteAdditionalInfo = async (doc_id, index) => {
        const con = window.confirm('Are you sure to delete this information ?');

        if (!con) {
            return;
        }

        let temp = [...additionalinfo];
        temp.splice(index, 1);
        setAdditionalInfo(temp);

        if (doc_id > 0) {
            try {
                await axios.get(`api/delete-information-doc/${doc_id}`).then((res) => {
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
        }
    };

    const getClientDetails = async () => {
        let client_id = clientDetails.client_id;
        try {
            await axios.get(`api/get-client-info/${client_id}`).then((res) => {
                if (res.data.status === 200) {
                    setClientDetails({
                        client_tb_id: res.data.client.id,
                        name: res.data.client.name,
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
                    setClientType(res.data.client.client_type);
                    getServiceCategories(res.data.client.client_type);
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
            errorToast(error)
        }
    };

    const submitUpdateSRStatus = async () => {
        if (srstatus.mode === '') {
            return;
        }

        const con = window.confirm('Are you sure ?');

        if (!con) {
            return;
        }

        const data = {
            id: id,
            status: srstatus.mode,
            reason: srstatus.reason,
        };

        await axios.post(`api/update-sr-status`, data).then((res) => {
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
    };

    const deductSRCharge = async () => {
        if (srstatus.mode === '') {
            return;
        }

        const con = window.confirm('Are you sure ?');

        if (!con) {
            return;
        }

        const data = {
            sr_id: id
        };

        await axios.post(`api/admin-deduct-customer-wallet`, data).then((res) => {
            if (res.data.status === 200) {
                Swal.fire({
                    title: 'Success!',
                    text: res.data.message,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    timer: 3000,
                });
                setBtnDisable("disabled");
            }
        });
    }

    const updateAdditionalDoc = (e, index, name1) => {
        let temp = [...additionaldoc];
        temp[index] = { ...temp[index], [name1]: e.target.value };
        setAdditionalDoc(temp);
    };

    const updateAdditionalInfo = (e, index, name1) => {
        let temp = [...additionalinfo];
        temp[index] = { ...temp[index], [name1]: e.target.value };
        setAdditionalInfo(temp);
    };

    const getClientDocuments = async () => {
        try {
            await axios.get(`api/get-client-documents/${id}`).then((res) => {
                if (res.data.status === 200) {
                    let temp = [];
                    res.data.clientdoc.forEach((element) => {
                        temp.push({
                            id: element.id,
                            value: element.document,
                            file_id: element.file_id,
                        });
                    });
                    setClientDoc(temp);
                }
            });
        } catch (error) {
            errorToast(error)
        }
    };

    const addClientDocument = async () => {
        const formData = new FormData();
        formData.append('sr_id', id);
        formData.append('uploadfiles', JSON.stringify(clientdoc));
        try {
            Swalwait();
            const res = await axios.post(`api/client-documents`, formData)
            if (res.data.status === 200) {
                toast.success(res.data.message);
            }
            getClientDocuments();
        } catch (error) {
            errorToast(error)
        } finally {
            Swal.close();
        }
    };

    const updateClientDoc = async (e, index, name1) => {
        e.preventDefault();
        const file = pickDocument(e);
        if (file === null) {
            return;
        }
        try {
            Swalwait();
            let temp = [...clientdoc];
            const imageFileResponse = await uploadToS3(file, `${uploadFolders.SRFiles}/${clientDetails.client_id}`);
            if (imageFileResponse?.url) {
                temp[index] = {
                    ...temp[index],
                    [name1]: imageFileResponse?.url,
                    file_id: null,
                };
                setClientDoc(temp);
            }
        } catch (error) {
            errorToast(error)
        } finally {
            Swal.close();
        }
    };

    const deleteClientDoc = async (doc_id, index) => {
        const con = window.confirm('Are you sure to delete this document ?');

        if (!con) {
            return;
        }

        let temp = [...clientdoc];
        temp.splice(index, 1);
        setClientDoc(temp);

        if (doc_id > 0) {
            try {
                await axios.get(`api/delete-client-doc/${doc_id}`).then((res) => {
                    if (res.data.status === 200) {
                        Swal.fire({
                            title: 'Success!',
                            text: res.data.message,
                            icon: 'success',
                            confirmButtonText: 'Ok',
                            timer: 3000,
                        });

                        getClientDocuments();
                    }
                });
            } catch (error) {
                errorToast(error)
            }
        }
    };

    const addMoreInfoClientDoc = (e) => {
        e.preventDefault();
        let temp = [...clientdoc];
        temp.push({
            id: 0,
            value: '',
            file_id: '',
        });
        setClientDoc(temp);
    };

    const paymentinfo = () => {
        let paid = 0,
            remain = 0,
            payinfo = [];
        if (payment.payment_id_token !== null) {
            paid += payment.token_amount;
        }
        if (payment.payment_id_total !== null) {
            paid += payment.rest_amount;
        }
        remain = payment.total_amount - paid;
        payinfo['paid'] = paid;
        payinfo['remain'] = remain;
        return payinfo;
    };

    const getAllData = async () => {
        try {
            setLoading(true);
            await getSR(id);
            await getPayment();
            await getClientAddiDocs(id);

            if (userType === 'admin' || userType === 'staff') {
                await getAdditionalDocuments();
                await getAdditionalInformations();
                await getClientDocuments();
            }

            if (userType === 'department') {
                await getStaff();
                await getAssignStaff();
            }

        } catch (error) {
            errorToast(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllData();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return (
            <div className='flex flex-1 h-[85vh] justify-center items-center'>
                <img src={LoaderDark} className='w-10 h-10' alt='loader' />
            </div>
        )
    }


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
                    {/* select branch */}
                    <div className="bg-white p-6 rounded-md mb-5">
                        <h1 className="font-semibold md:text-lg">Client Selection</h1>
                        <hr className="my-3" />
                        {id === undefined ? (
                            <div className="flex mt-3 justify-between items-start gap-3">
                                <div className="w-full">
                                    <CustomInput
                                        placeholder={'Enter Client ID'}
                                        label={`Enter Client ID`}
                                        value={clientDetails.client_id}
                                        name="client_id"
                                        onChange={updateClientDetails}
                                    />
                                </div>
                                <CustomBtn
                                    type="button"
                                    onClick={() => getClientDetails()}
                                >
                                    Search
                                </CustomBtn>
                            </div>
                        ) : (
                            <CustomInput
                                placeholder={'Enter Client ID'}
                                label={`Enter Client ID`}
                                value={clientDetails.client_id}
                                name="client_id"
                                onChange={updateClientDetails}
                                readOnly
                            />
                        )}

                        {category === 20 && clientPackages && (
                            <div className="flex mt-3 justify-between items-end gap-3">
                                <div className="w-full">
                                    {/*{SRPackage}*/}
                                    { packageDisable !== 'paid' ?
                                    <>
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
                                            <option value={option?.id} selected={option.id === SRPackage} key={index}>
                                                {`${option?.package_id} (${clientDetails.name} ${clientDetails.gst})`}
                                            </option>
                                        ))}
                                    </select>
                                    </>
                                    : <CustomInput
                                            placeholder={'Selected Package'}
                                            label={`Selected Package`}
                                            value={clientPackages.find((option) => option.id === SRPackage)?.package_id + " (" + clientDetails.name + " " + clientDetails.gst + ")" || ""}  
                                            readOnly
                                        />
                                    }
                                </div>
                            </div>
                        )}

                        {/*{clientPackages.find((option) => option.id === SRPackage)?.id + " (" + clientDetails.name + " " + clientDetails.gst + ")" || ""}

                        test= { gstpackage.package_id }

                        {console.log('console.log '+gstpackage.id)}*/}

                    </div>

                    <div className="grid grid-cols-2 gap-5">
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
                                        value={address}
                                        name="address"
                                        onChange={updateClientDetails}
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
                                    onChange={updateClientDetails}
                                    readOnly
                                />

                                <CustomInput
                                    placeholder={`Enter Adhar`}
                                    label={`Adhar`}
                                    value={clientDetails.adhar}
                                    name="adhar"
                                    onChange={updateClientDetails}
                                    readOnly
                                />
                                <CustomInput
                                    placeholder={`Enter GSTIN`}
                                    label={`GSTIN`}
                                    value={clientDetails.gst}
                                    name="gst"
                                    onChange={updateClientDetails}
                                    readOnly
                                />
                                <CustomInput
                                    placeholder={`Enter mobile`}
                                    label={`Mobile`}
                                    value={clientDetails.mobile}
                                    name="mobile"
                                    onChange={updateClientDetails}
                                    readOnly
                                />
                                <CustomInput
                                    placeholder={`Enter Alt mobile`}
                                    label={`Alt Mobile`}
                                    value={clientDetails.altMobile}
                                    name="altMobile"
                                    onChange={updateClientDetails}
                                    readOnly
                                />
                                <CustomInput
                                    placeholder={`Enter Email`}
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
                                <CustomInput
                                    placeholder={`Trade Name`}
                                    label={`Trade Name`}
                                    value={clientDetails.trade_name}
                                    readOnly
                                />
                            </div>
                            {allcustomer &&
                                <>
                                    <h1 className="font-semibold md:text-lg mt-5">Customer's Details</h1>
                                    <hr className="my-3" />
                                    <div className="flex flex-col gap-4">
                                        <img src={allcustomer?.photo} width="200" height="200" alt='customer avatar' />
                                        <CustomInput
                                            placeholder={'Name'}
                                            label={`Name`}
                                            value={allcustomer?.name}
                                            readOnly
                                        />
                                        <CustomInput
                                            placeholder={'Email'}
                                            label={`Email`}
                                            value={allcustomer?.email}
                                            readOnly
                                        />
                                        <CustomInput
                                            placeholder={'Mobile No.'}
                                            label={`Mobile No.`}
                                            value={allcustomer?.mobile}
                                            readOnly
                                        />
                                    </div>
                                </>}

                        </div>

                        {/* service details  && documents */}
                        <div>
                            {/* service details  */}
                            <div className="bg-white p-6 rounded-md mb-5 h-fit ">
                                <div className="flex items-center justify-between">
                                    <h1 className="font-semibold md:text-lg">Service Details</h1>
                                    <span>Token Money : ₹ {tokenmoney}</span>
                                </div>
                                <hr className="my-3" />
                                <div className="flex flex-col gap-4">
                                    <label className="block text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Select Category
                                    </label>
                                    <select
                                        name="category"
                                        //disabled={userType !== 'admin'}
                                        disabled={userType !== 'admin'}
                                        onChange={(e) => {
                                            updateServiceDetails(e);
                                            getServiceHead1(e.target.value);
                                        }}
                                        className=" mb-2bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                    >
                                        <option>Select</option>
                                        {allcategory.map((option, index) => (
                                            <option
                                                value={option?.id}
                                                selected={option?.id === category}
                                                key={index}
                                            >
                                                {option?.category_name}
                                            </option>
                                        ))}
                                    </select>
                                    <CustomSelect
                                        label={'Service Head Level 1'}
                                        disabled={userType !== 'admin'}
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
                                        disabled={userType !== 'admin'}
                                        label={'Service Head Level 2'}
                                        options={servicehead2}
                                        value={serviceDetails.serviceSL2}
                                        name="serviceSL2"
                                        onChange={updateServiceDetails}
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

                            {/* additional feilds  */}
                            {uploadinform?.length > 0 &&
                                <div className="bg-white p-6 rounded-md mb-5 h-fit ">
                                    <h1 className="font-semibold md:text-lg">More Informations</h1>
                                    <hr className="my-3" />
                                    <div className="flex flex-col gap-4">
                                        {uploadinform?.map((doc, index) => (
                                            <div key={index}>
                                                <label
                                                    className="block text-xs md:text-sm font-medium text-gray-900 mb-2"
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
                                                        className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
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
                            }

                            {uploadfiles?.length > 0 &&
                                <div className="bg-white p-6 rounded-md mb-5 h-fit ">
                                    <h1 className="font-semibold md:text-lg">Upload Documents</h1>
                                    <hr className="my-3" />
                                    <div className="flex flex-col gap-4">
                                        {uploadfiles?.map((item, index) => (
                                            <div key={index} className='flex border items-center justify-between p-2'>
                                                <div className='flex items-center gap-3'>
                                                    {item.edit === 'edit' && ' ' && (
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked={item.is_edited}
                                                            onClick={() =>
                                                                toggleSRDocEdit(`${item.id}`, `${item.is_edited}`)
                                                            }
                                                        />
                                                    )}
                                                    <p>{item.name}</p>
                                                </div>
                                                {item.value &&
                                                    <div className='flex items-center gap-3'>
                                                        <a className='font-normal text-xs cursor-pointer  text-green-400 underline underline-offset-2 '
                                                            href={`${item.value}`}
                                                            target="_blank"
                                                            rel="noreferrer">
                                                            View Document
                                                        </a>
                                                        <ActionBtn loading={isFileDownloading(`${item.value}${index}`)} onClick={() => downloadFromS3(item.value, index)} tooltip='Download Document' >
                                                            <FiDownload className='text-white' />
                                                        </ActionBtn>
                                                    </div>
                                                }
                                            </div>
                                        ))}
                                        {uploadfiles.length > 0 && id !== undefined && (
                                            <div className='flex items-center p-2 gap-2'>
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={showEditDocBtn}
                                                    onClick={() =>
                                                        toggleShowEditDocBtn(`${showEditDocBtn}`)
                                                    }
                                                />
                                                <p>Show Edit Document Button</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            }

                            {clientextradoc.length !== 0 &&
                                <div className="bg-white p-6 rounded-md mb-5 h-fit ">
                                    <h1 className="font-semibold md:text-lg">Client Extra Documents</h1>
                                    <hr className="my-3" />
                                    <div className="flex flex-col gap-4">
                                        {clientextradoc?.map((data, index) => (
                                            <div key={index} className='flex border items-center justify-between p-2'>
                                                <div className='flex items-center gap-3'>
                                                    <p>{data.doc}</p>
                                                </div>
                                                <div className='flex items-center gap-3'>
                                                    <a className='font-normal text-xs cursor-pointer  text-green-400 underline underline-offset-2 '
                                                        href={`${data.link}`}
                                                        target="_blank"
                                                        rel="noreferrer">
                                                        View Document
                                                    </a>
                                                    <ActionBtn loading={isFileDownloading(`${data.link}${index}`)} onClick={() => downloadFromS3(data.link, index)} tooltip='Download Document' >
                                                        <FiDownload className='text-white' />
                                                    </ActionBtn>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    {userType === "department" &&
                        <div className="bg-white p-6 rounded-md mb-5">
                            <h1 className="font-semibold md:text-lg">Assign Staff</h1>
                            <div className="flex mt-3 justify-between items-start gap-3 ">
                                <div className="w-full">
                                    <CustomSelect
                                        label={'Select Staff'}
                                        options={allstaff}
                                        name="assignstaff"
                                        value={assignstaff}
                                        onChange={(e) => {
                                            setAssignStaff(e.target.value);
                                        }}
                                        defaultOption={'Select'}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 mt-7 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                                    onClick={assignStaff}
                                >
                                    Assign
                                </button>
                            </div>
                        </div>
                    }


                    {/* Set Amount  */}
                    {(userType === 'admin' || userType === 'verificationteam') && (srstatus.mode !== 'Closed' && srstatus.mode !== 'Rejected') &&
                        <div className="bg-white p-6 rounded-md mb-5">
                            <h1 className="font-semibold md:text-lg">Set Total Amount</h1>

                            <div className="flex mt-3 justify-between items-start gap-3 ">
                                <input
                                    value={totalamount}
                                    onChange={(e) => setTotalAmount(e.target.value)}
                                    type="text"
                                    className=" border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                                    placeholder="Enter total amount"
                                    readOnly={payment.payment_id_total ? true : false}
                                />
                                {payment.payment_id_total === null && (
                                    <CustomBtn
                                        type="button"
                                        onClick={submitTotalAmount}
                                    >
                                        Set
                                    </CustomBtn>
                                )}
                            </div>
                            <div className='mt-3' >
                                {preferredamt &&
                                    <CustomInput
                                        placeholder={`Customer Preferred Amount`}
                                        label={`Customer Preferred Amount`}
                                        value={preferredamt}
                                        name="preferredamt"
                                        readOnly
                                    />
                                }
                            </div>

                        </div>
                    }

                    {/* Payment Details */}
                    <div className="bg-white p-6 rounded-md mb-5">
                        <h1 className="font-semibold md:text-lg">Payment Details </h1>
                        {(payment.payment_id_token !== null || payment.payment_id_total !== null) &&
                            <CustomTables.Table
                                DATA={(() => {
                                    const data = [];
                                    if (payment.payment_id_token) {
                                        data.push([payment.payment_id_token, `₹ ${payment.token_amount}`])
                                    }
                                    if (payment.payment_id_token && payment.payment_id_total) {
                                        data.push([payment.payment_id_total, `₹ ${payment.rest_amount}`])
                                    }
                                    if (payment.payment_id_token === null && payment.payment_id_total) {
                                        data.push([payment.payment_id_total, `₹ ${payment.total_amount}`])
                                    }
                                    return data;
                                })()}
                                ROW_DATA={(data) => {
                                    return [data[0], data[1]]
                                }}
                                TABLE_HEADINGS={['Payment ID', 'Amount']}
                            />}

                        <CustomTables.Table
                            DATA={[1]}
                            ROW_DATA={() => {
                                return [`₹ ${payment.total_amount}`, `₹ ${paymentinfo()['paid']}`, `₹ ${paymentinfo()['remain']}`]
                            }}
                            TABLE_HEADINGS={['Total Amount', 'Paid Amount', 'Remaining Amount']}
                        />

                        {payment.payment_id_total && (
                            <p className="text-green-500 mt-5">
                                Congratulations!. Client has paid the full amount of Service
                                Request
                            </p>
                        )}
                    </div>

                    {/* SR Status  */}
                    {/*ADD userType === 'verificationteam' && IN BELOW SEGMENT DURING THIS POINT: add sr status to verify user*/}
                    {(userType === 'admin' || userType === 'staff') &&
                        <div className="bg-white p-6 rounded-md mb-5">

                            <h1 className="font-semibold md:text-lg">SR Status</h1>
                            <div className="flex mt-3 justify-between items-start gap-3 ">
                                <div className="w-full">
                                    <CustomSelect
                                        label={`Current status is : ${srstatus.mode}`}
                                        options={SR_STATUS_MODES()}
                                        value={srstatus.mode}
                                        name="mode"
                                        onChange={updateSRStatus}
                                        defaultOption={'Select Status'}
                                    />
                                    <label className="mt-2 block mb-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Enter Reason
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        className="mt-2 block p-2.5 w-full text-xs md:text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Enter Reason"
                                        value={srstatus.reason}
                                        name="reason"
                                        onChange={updateSRStatus}
                                    ></textarea>
                                    <div className='flex gap-2 mt-5'>
                                    <CustomBtn
                                        type="button"
                                        onClick={submitUpdateSRStatus}
                                        customClasses='mt-3'
                                    >
                                        Submit
                                    </CustomBtn>
                                    {
                                        category === 20 && clientDetails?.package_id > 0 && 
                                        <CustomBtn
                                            type="button"
                                            onClick={deductSRCharge}
                                            disabled={btnDisable}
                                            customClasses='mt-3'
                                        >
                                            Deduct SR Charge
                                        </CustomBtn>
                                    }
                                    {/* {clientDetails?.package_id && (
                                        
                                    )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }




                    {/* REMOVE BELOW CODES AND ADD userType === 'verificationteam' && IN PREVIOUS SEGMENT DURING THIS POINT: add sr status to verify user */}
                    {(userType === 'verificationteam') &&
                        <div className="bg-white p-6 rounded-md mb-5">
                            <div className="flex mt-3 justify-between items-start gap-3 ">
                                <div className="w-full">
                                    {
                                        category === 20 && clientDetails?.package_id > 0 && 
                                        <CustomBtn
                                            type="button"
                                            onClick={deductSRCharge}
                                            disabled={btnDisable}
                                            customClasses='mt-3'
                                        >
                                            Deduct SR Charge
                                        </CustomBtn>
                                    }
                                </div>
                            </div>
                        </div>
                    }



















                    {/* Additional Documents  */}
                    {showStatusAccept?.operator_name && (
                        <p style={{ textAlign: 'center' }}>
                            Accepted By: {showStatusAccept.operator_name} on {showStatusAccept.action_date}
                        </p>
                    )}
                    {(userType === 'admin' || userType === 'staff') &&
                        <div className="bg-white p-6 rounded-md mb-5">
                            <h1 className="font-semibold md:text-lg">Additional Documents</h1>

                            {additionaldoc.length !== 0 && (
                                <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
                                    <thead className=" text-xs uppercase text-white  bg-green-400">
                                        <tr>
                                            {additionalHeadings?.map((tableHeading, index) => (
                                                <th scope="col" className="py-3 px-6" key={index}>
                                                    {tableHeading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {additionaldoc?.map((data, index) => (
                                            <tr
                                                key={index}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            >
                                                <td className="py-4 px-6">
                                                    <input
                                                        name="document_title"
                                                        type="text"
                                                        onChange={(e) =>
                                                            updateAdditionalDoc(e, index, 'document_title')
                                                        }
                                                        className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                                        value={data.document_title}
                                                        required={true}
                                                    />
                                                </td>
                                                <td className="py-4 px-6">
                                                    {data.id > 0 && data.value && (
                                                        <a className='font-normal text-xs cursor-pointer  text-green-400 underline underline-offset-2 '
                                                            href={data.value}
                                                            target="_blank"
                                                            rel="noreferrer">
                                                            View
                                                        </a>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 flex justify-between items-center">
                                                    <div
                                                        onClick={() => deleteAdditionalDoc(data.id, index, data.value)}
                                                        className="bg-green-400 hover:bg-green-500 p-1 cursor-pointer"
                                                    >
                                                        <AiOutlineDelete size={20} className="text-white" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            <div className='flex gap-2 mt-5'>
                                <CustomBtn
                                    onClick={addMoreAdditionalDoc}
                                    type="button"
                                >
                                    Add more +
                                </CustomBtn>
                                <CustomBtn
                                    onClick={addAdditionalDocument}
                                    type="button"
                                >
                                    Submit
                                </CustomBtn>
                            </div>
                        </div>
                        
                    }

                    {/* Additional Informatiton  */}
                    {(userType === 'admin' || userType === 'staff') &&
                        <div className="bg-white p-6 rounded-md mb-5">
                            <h1 className="font-semibold md:text-lg">Additional Informations</h1>

                            {additionalinfo.length !== 0 && (
                                <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
                                    <thead className=" text-xs uppercase text-white  bg-green-400">
                                        <tr>
                                            {additionalInfoHeadings?.map((tableHeading, index) => (
                                                <th scope="col" className="py-3 px-6" key={index}>
                                                    {tableHeading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {additionalinfo?.map((data, index) => (
                                            <tr
                                                key={index}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            >
                                                <td className="py-4 px-6">
                                                    <input
                                                        name="information_title"
                                                        type="text"
                                                        onChange={(e) =>
                                                            updateAdditionalInfo(
                                                                e,
                                                                index,
                                                                'information_title'
                                                            )
                                                        }
                                                        className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                                        value={data.information_title}
                                                        required={true}
                                                    />
                                                </td>
                                                <td className="py-4 px-6">
                                                    {data.id > 0 && data.value && (
                                                        <input
                                                            type="text"
                                                            className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                                            value={data.value}
                                                            readOnly
                                                        />
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 flex justify-between items-center">
                                                    <div
                                                        onClick={() =>
                                                            deleteAdditionalInfo(data.id, `${index}`)
                                                        }
                                                        className="bg-green-400 hover:bg-green-500 p-1 cursor-pointer"
                                                    >
                                                        <AiOutlineDelete size={20} className="text-white" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            <div className='flex gap-2 mt-5'>
                                <CustomBtn
                                    onClick={addMoreAdditionalInfo}
                                    type="button"
                                >
                                    Add more +
                                </CustomBtn>
                                <CustomBtn
                                    onClick={addAdditionalInformation}
                                    type="button"
                                >
                                    Submit
                                </CustomBtn>
                            </div>
                        </div>
                    }

                    {/* upload final documents section  */}
                    {(userType === 'admin' || userType === 'staff') &&
                        <div className="bg-white p-6 rounded-md mb-5">
                            <h1 className="font-semibold md:text-lg">Upload Final Documents</h1>
                            {clientdoc.length !== 0 && (
                                <>
                                    <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
                                        <thead className=" text-xs uppercase text-white  bg-green-400">
                                            <tr>
                                                {tableHeadingsClientDoc?.map((tableHeading, index) => (
                                                    <th scope="col" className="py-3 px-6" key={index}>
                                                        {tableHeading}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clientdoc?.map((data, index) => (
                                                <tr
                                                    key={index}
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                >
                                                    <td className="py-4 px-6">
                                                        <input
                                                            name="value"
                                                            type="file"
                                                            onChange={(e) => updateClientDoc(e, index, 'value')}
                                                            className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                                                            required={data.id > 0 ? false : true}
                                                        />
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {data.id > 0 && (
                                                            <a
                                                                href={data.value}
                                                                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                View
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6 flex justify-between items-center">
                                                        <div
                                                            onClick={() => deleteClientDoc(data.id, `${index}`)}
                                                            className="bg-green-400 hover:bg-green-500 p-1 cursor-pointer"
                                                        >
                                                            <AiOutlineDelete size={20} className="text-white" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p style={{ textAlign: 'center' }}>
                                        Uploaded By: {showFinalDocument?.operator_name} on {showFinalDocument?.action_date}
                                    </p>
                                </>
                            )}
                            <div className='flex gap-2 mt-5'>
                                <CustomBtn
                                    onClick={addMoreInfoClientDoc}
                                    type="button"

                                >
                                    Add more +
                                </CustomBtn>
                                <CustomBtn
                                    onClick={addClientDocument}
                                    type="button"
                                >
                                    Submit
                                </CustomBtn>
                            </div>
                        </div>
                    }

                    {/* remarks section  */}
                    <div className="bg-white p-6 rounded-md mb-5">
                        <h1 className="font-semibold md:text-lg">Remarks</h1>
                        <div className="flex mt-3 justify-between items-start gap-3 ">
                            <div className="w-full">
                                <input
                                    disabled={userType !== 'admin'}
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    type="text"
                                    className=" border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                                    placeholder="Enter your remarks"
                                />
                            </div>

                            {userType === 'admin' &&
                                <CustomBtn type="submit" loading={submitting}>
                                    Submit
                                </CustomBtn>
                            }
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default EditServiceRequest;
