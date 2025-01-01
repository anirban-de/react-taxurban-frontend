import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomInput } from '../../../components/index.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { InlineLoader } from '../../../components/index.js';
import { errorToast } from '../../../utils/index.js';
import CustomNumber from '../../../components/shared/CustomNumber.js';
//import AdminReplyModal from '../Modals/AdminReplyModal.jsx';

const Action = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    client: 0,
    category: 0,
    business_text: '',
    plan_duration: ''
  });
  const [allCategory, setAllCategory] = useState([]);
  const [allClient, setAllClient] = useState([]);
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const toggleRequestModal = () => setRequestModal(!requestModal);
  const [packageDetails, setPackageDetails] = useState({
    client: 0,
    category: 0,
    gst_no: '',
    business_text: '',
    plan_duration: '',
    start_month: '',
    end_month: '',
    base_price: ''
  });

  const { id } = useParams();

  const updateFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const setMandatory = () => {
    setFormData({ ...formData, mandatory: !formData.mandatory });
  };

  const getClients = async () => {
    try {
      await axios
          .get(`api/customer/get-all-client`)
          .then((res) => {
              if (res.data.status === 200) {
                setAllClient(res.data.client);
              }
          });
    } catch (error) {
        errorToast(error)
    }
  }

  const getCategories = async (servicetype) => {
    try {
        await axios
            .get(`api/get-service-categories/Individual`)
            .then((res) => {
                if (res.data.status === 200) {
                    setAllCategory(res.data.allcategory);
                }
            });
    } catch (error) {
        errorToast(error)
    }
  };

  const getPackageDetails = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`api/user-get-gst-package-detail/${id}`)
      console.log("res", res.data.detail.client_name);
      setPackageDetails({
        customer: res.data.detail.customer,
        client: res.data.detail.client_name,
        category: res.data.detail.category,
        gst_no: res.data.detail.gst_no,
        business_text: res.data.detail.business_text,
        plan_duration: res.data.detail.plan_duration,
        start_month: res.data.detail.start_month,
        end_month: res.data.detail.end_month,
        base_price: res.data.detail.base_price,
        total_price: res.data.detail.total_price,
        customer_request: res.data.detail.customer_request,
        srlist: res.data.srlist,
        wallet_balance: res.data.package_remaining_balance,
        package_invoice: res.data.detail.package_invoice,
        status: res.data.detail.status,
        paymentstatus: res.data.detail.paymentstatus,
        paymentdate: res.data.detail.paymentdate
      })

      setFormData({
        customer: res.data.detail.customer,
        client: res.data.detail.client_name,
        category: res.data.detail.category,
        gst_no: res.data.detail.gst_no,
        business_text: res.data.detail.business_text,
        plan_duration: res.data.detail.plan_duration,
        start_month: res.data.detail.start_month,
        end_month: res.data.detail.end_month,
        base_price: res.data.detail.base_price,
        total_price: res.data.detail.total_price,
        trade_name: res.data.detail.client_trade_name
      })
    } catch (error) {
      errorToast(error)
    } finally {
      setLoading(false);
    }
  }

  const handleOpenPdf = () => {
    const pdfUrl = packageDetails?.package_invoice; // URL of the PDF
    if (pdfUrl) {
      window.open(pdfUrl, '_blank'); // Opens the PDF in a new tab
    } else {
      console.error('No PDF URL available');
    }
  };

  useEffect(() => {
    getClients();
    getCategories();
    
  }, []);

  useEffect(() => {
    if (id) {
      getPackageDetails();
    }
  }, [id])

  const cancelPackage = async() => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this package?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let data = {
          id: id
        }
        await axios.post(`api/admin-cancel-package`, data).then((res) => {
          navigate('/admin/gst-package');
    
          Swal.fire({
            title: 'Success!',
            text: res.data.msg,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        });
      }
    })

    
  }

  const submitPackage = async () => {
    setErrors([]);

    try {
      formData.id = id;
      let obj = {
        "id": id,
        "start_month": formData.start_month,
        "end_month": formData.end_month,
        "base_price": formData.base_price
      }
      await axios.post(`api/admin-update-gst-package`, obj).then((res) => {
        navigate('/verificationteam/gst-package');

        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
          timer: 3000,
        });
      });
    } catch (error) { }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="md:text-lg font-semibold ml-3">Manage GST Package</h1>
      </div>

      {loading && <InlineLoader loadingText="Package data" />}

      {!loading && (
        <section>
          <form>
            {/* category details  */}
            <div className="bg-white p-6 rounded-md mb-5">
              <h1 className="font-semibold md:text-lg">
                {id > 0 ? 'Edit' : 'Add'} Package
              </h1>
              <hr className="my-3" />
              <div className="grid grid-cols-3 gap-4 ">
              <div>
                  <CustomInput
                    value={formData?.customer}
                    disabled
                    label={'Customer Name'}
                  />
                </div>

                <div>
                  <CustomInput
                    value={formData?.client}
                    disabled
                    label={'Client Name'}
                  />
                </div>

                <div>
                  <CustomInput
                    disabled
                    value="GST"
                    label={'Category'}
                  />
                </div>

                <CustomInput
                  type="text"
                  value={packageDetails?.gst_no}
                  name="total_price"
                  placeholder="GST No"
                  //onChange={updateFormData}
                  required
                  errorMsg={errors?.gst_no}
                  label={'GST No'}
                />

                <CustomInput
                  type="tex"
                  value={formData?.trade_name}
                  disabled
                  //disabled={id}
                  name="trade_name"
                  placeholder="Trade Name"
                  onChange={updateFormData}
                  required
                  errorMsg={errors?.trade_name}
                  label={'Trade Name'}
                />

                {/* <div>
                  <label className="block mb-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                    Select Category
                  </label>
                  <select
                    name="category"
                    disabled
                    onChange={updateFormData}
                    className=" mb-2bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  >
                    <option>Select</option>
                    {allCategory.map((option, index) => (
                      <option
                        value={option?.id}
                        key={index}
                        selected={
                          option.id === formData.category ? true : false
                        }
                      >
                        {option?.category_name}
                      </option>
                    ))}
                  </select>
                </div> */}


                <CustomInput
                  value={formData?.business_text}
                  disabled
                  name="business_text"
                  onChange={updateFormData}
                  placeholder="Business"
                  required
                  errorMsg={errors?.business_text}
                  label={'Details What You Want*'}
                />

                {!id ? (
                  <div>
                    <label className="block mb-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                      Plan Duration
                    </label>
                    <select
                      name="plan_duration"
                      disabled={formData.plan_duration == ""? false: true}
                      onChange={updateFormData}
                      className=" mb-2bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    >
                      <option>Select</option>
                      <option value="3" selected={formData.plan_duration == 3? true: false }>3</option>
                      <option value="6" selected={formData.plan_duration == 6? true: false }>6</option>
                      <option value="12" selected={formData.plan_duration == 12? true: false }>12</option>
                    </select>
                  </div>
                ):(
                  <CustomNumber
                    value={`${formData?.plan_duration}`}
                    name="plan_duration"
                    onChange={updateFormData}
                    required
                    errorMsg={errors?.plan_duration}
                    label={'Plan Duration'}
                  />
                )}

                <CustomInput
                  //disabled={formData.start_month == ""? false: true}
                  type="date"
                  name="start_month"
                  label={'From Month'}
                  onChange={updateFormData}
                  value={formData?.start_month}
                />

                <CustomInput
                  //disabled={formData.end_month == ""? false: true}
                  type="date"
                  name="end_month"
                  label={'To Month'}
                  onChange={updateFormData}
                  value={formData?.end_month}
                />

                <CustomInput
                  type="text"
                  value={formData?.base_price}
                  name="base_price"
                  onChange={updateFormData}
                  placeholder="Basic Monthly Price"
                  required
                  errorMsg={errors?.business_text}
                  label={'Basic Monthly Price'}
                />

                <CustomInput
                  disabled
                  type="text"
                  value={packageDetails?.total_price}
                  name="total_price"
                  //onChange={updateFormData}
                  placeholder="Pricing"
                  required
                  errorMsg={errors?.total_price}
                  label={'Total Amount'}
                /> 

                <CustomInput
                  disabled
                  type="text"
                  value={packageDetails?.wallet_balance}
                  label={'Balance Amount'}
                /> 

                {id && (
                  <>
                    <CustomInput
                      disabled
                      type="text"
                      value={packageDetails?.paymentstatus}
                      label={'Payment Status'}
                    /> 
                    <CustomInput
                      disabled
                      type="text"
                      value={packageDetails?.paymentdate}
                      label={'Payment Date'}
                    /> 
                  </>
                )}

                {packageDetails?.customer_request != "" && (
                  <CustomInput
                    value={packageDetails?.customer_request}
                    disabled
                    label={'Edit Request'}
                  />
                )}

              </div>
            </div>

            {/* SR Table section */}
            {packageDetails.srlist?.length > 0 && (
              <div className="bg-white p-6 rounded-md mb-5">
                <h2 className="font-semibold md:text-lg mb-4">SR Details</h2>
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2 text-center">SR ID</th>
                      <th className="border px-4 py-2 text-center">Month</th>
                      <th className="border px-4 py-2 text-center">Year</th>
                      <th className="border px-4 py-2 text-center">Created Date</th>
                      <th className="border px-4 py-2 text-center">SR Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packageDetails.srlist?.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2 text-center">{item.request_id}</td>
                        <td className="border px-4 py-2 text-center">{item.month}</td>
                        <td className="border px-4 py-2 text-center">{item.year}</td>
                        <td className="border px-4 py-2 text-center">{item.created_at}</td>
                        <td className="border px-4 py-2 text-center">{item.total_amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {id && packageDetails?.status != 'Complete' && (
              <>
                <button
                  type="button"
                  className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg
                  text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                  onClick={submitPackage}
                >
                  Submit
                </button>

                <button
                  type="button"
                  className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg
                  text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                  onClick={cancelPackage}
                >
                Cancel
                </button>
              </>
            )}

            {id && packageDetails?.package_invoice != undefined && (
              <button
                onClick={() => handleOpenPdf(packageDetails?.package_invoice)}
                type="button"
                className="text-white mr-3 bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-4 py-2"
              >
                Download Invoice
              </button>
            )}

            {id && packageDetails?.customer_request != "" && (
              <button
                onClick={() => setRequestModal(true)}
                type="button"
                className="text-white mr-3 bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-4 py-2"
              >
                Reply as Admin
              </button>
            )}
          </form>
        </section>
      )}
      {/*{requestModal && (
        <AdminReplyModal
          toggleRequestModal={toggleRequestModal}
          packageId={id}
        />
      )}*/}
    </div>
  );
};

export default Action;