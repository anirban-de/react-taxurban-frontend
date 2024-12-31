import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomInput, CustomTextArea } from '../../../components/index.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { InlineLoader } from '../../../components/index.js';
import { errorToast } from '../../../utils/index.js';
import AddMoneyModal from '../../Branch/Modals/MoneyModal.jsx';
import usePaymentHook from '../../../hooks/usePaymentHook';
import { Textarea } from 'flowbite-react';
import EditRequestModal from '../Modals/EditRequest.jsx';

const Action = () => {
  const navigate = useNavigate();
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [formData, setFormData] = useState({
    client: 0,
    client_id: '',
    category: 0,
    business_text: '',
    plan_duration: '',
    gst_no: '',
    client_name: '',
    trade_name: ''
  });
  const [allCategory, setAllCategory] = useState([]);
  const [allClient, setAllClient] = useState([]);
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const toggleRequestModal = () => setRequestModal(!requestModal);
  const [packageDetails, setPackageDetails] = useState({});

  const { id } = useParams();

  const updateFormData = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const setClient = (e) => {
    let value = JSON.parse(e.target.value);
    let updateFormDataValue = {...formData};
    updateFormDataValue.client = value.id || ""; // Fallback to empty string if null
    updateFormDataValue.client_name = value.name || "";
    updateFormDataValue.gst_no = value.gst || "";
    updateFormDataValue.trade_name = value.trade_name || "";
    //console.log(updateFormDataValue);
    setFormData(updateFormDataValue);
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
      //console.log("res", res)
      setFormData({
        client: res.data.detail.client,
        category: res.data.detail.category,
        business_text: res.data.detail.business_text,
        plan_duration: res.data.detail.plan_duration,
        gst_no: res.data.detail.gst_no,
        client_id: res.data.detail.client_id,
        client_name: res.data.detail.client_name,
        trade_name: res.data.detail.client_trade_name
      })
      
      setPackageDetails({
        client: res.data.detail.client,
        client_id: res.data.detail.client_id,
        category: res.data.detail.category,
        customer: res.data.detail.customer,
        gst_no: res.data.detail.gst_no,
        business_text: res.data.detail.business_text,
        plan_duration: res.data.detail.plan_duration,
        base_price: res.data.detail.base_price,
        total_price: res.data.detail.total_price,
        //balance_amount: res.data.wallet_balance.amount,
        start_month: res.data.detail.start_month,
        end_month: res.data.detail.end_month,
        client_name: res.data.detail.client_name,
        client_mobile: res.data.detail.client_mobile,
        client_email: res.data.detail.client_email,
        srlist: res.data.srlist,
        status: res.data.detail.status,
        package_invoice: res.data.detail.package_invoice,
        paymentstatus: res.data.detail.paymentstatus,
        paymentdate: res.data.detail.paymentdate,
        admin_reply: res.data.detail.admin_reply
      })
      setStartMonth(res.data.detail.start_month);
      setEndMonth(res.data.detail.end_month);
      setTotalPrice(res.data.detail.total_price);
      setBasePrice(res.data.detail.base_price);
      setBalanceAmount(res.data.package_remaining_balance);
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
  

  const reload = async () => {
    try {
      await getClients();
      await getCategories();
    } catch (error) {
      errorToast(error)
    }
  }

  const { makePayment } = usePaymentHook({ verifyApiUrl: 'api/customer-wallet-process', callback: reload });

  const handlePayment = () => {
    const paymentDetails = {
      amount: packageDetails?.base_price,
      mobile: packageDetails?.client_mobile,  // Example mobile number
      name: packageDetails?.client_name,  // Example payer's name
      email: packageDetails?.client_email,  // Example payer's email
      //extra: ['Payments for GST package'],  // Optional extra data
      extra: [id, 'Payments for GST package']
    };
    //console.log('paymentDetails', paymentDetails);
    // Call the makePayment function and pass paymentDetails
    makePayment(paymentDetails);
  };

  const submitPackage = async () => {
    setErrors([]);

    try {
      const data = {
        formData: formData,
      };

      await axios.post(`api/user-generate-gst-package`, formData).then((res) => {
        navigate('/customer/gst-package');

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
                {!id ? (
                  <div>
                    <label className="block mb-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                      Select Client
                    </label>
                    <select
                      name="client"
                      onChange={(e) => setClient(e)}
                      className=" mb-2bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    >
                      <option>Select Client</option>
                      {allClient.map((option, index) => (
                        <option
                          value={JSON.stringify(option)}
                          key={index}
                          selected={
                            option.id == packageDetails.client ? true : false
                          }
                        >
                          {option?.client_id}
                        </option>
                      ))}
                    </select>
                  </div> ) :

                  (<CustomInput
                    disabled
                    value={formData.client_id || ""}
                    label={"Client ID"}
                    //onChange={updateFormData}
                  />)
                }

                <div>
                  <CustomInput
                    disabled
                    value="GST"
                    label={"Category"}
                  />
                </div>

                <CustomInput
                  type="tex"
                  value={formData?.gst_no}
                  disabled
                  //disabled={id}
                  name="gst_no"
                  placeholder="GST No"
                  onChange={updateFormData}
                  required
                  errorMsg={errors?.gst_no}
                  label={'GST No'}
                />
                <CustomInput
                  type="tex"
                  value={formData?.client_name}
                  disabled
                  name="client_name"
                  placeholder="Client Name"
                  onChange={updateFormData}
                  required
                  errorMsg={errors?.client_name}
                  label={'Client'}
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
              </div>
              <div className="grid grid-cols-3 gap-4" style={{margin: "20px 0"}}>
                <CustomTextArea
                  value={formData?.business_text}
                  disabled={id}
                  name="business_text"
                  onChange={updateFormData}
                  //placeholder="Business"
                  required
                  errorMsg={errors?.business_text}
                  label={'Details What You Want'}
                />
                {!id ? (
                  <div>
                    <label className="block mb-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                      Plan Duration
                    </label>
                    <select
                      name="plan_duration"
                      onChange={updateFormData}
                      className=" mb-2bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    >
                      <option>Select</option>
                      <option value="3" selected={formData.plan_duration == 3? true: false }>3 months</option>
                      <option value="6" selected={formData.plan_duration == 6? true: false }>6 months</option>
                      <option value="12" selected={formData.plan_duration == 12? true: false }>12 months</option>
                    </select>
                  </div>
                ):(
                  <CustomInput
                    type="text"
                    disabled
                    value={`${formData?.plan_duration} months`}
                    name="plan_duration"
                    onChange={updateFormData}
                    required
                    errorMsg={errors?.plan_duration}
                    label={'Plan Duration'}
                  />
                )}
                {id && (
                  <>
                    <CustomInput
                      disabled
                      type="text"
                      name="start_month"
                      label={'From Month'}
                      //onChange={updateFormData}
                      value={startMonth}
                    />

                    <CustomInput
                      disabled
                      type="text"
                      label={'To Month'}
                      //onChange={updateFormData}
                      value={endMonth}
                    />

                    <CustomInput
                      type="text"
                      value={basePrice}
                      name="total_price"
                      disabled={id}
                      //onChange={updateFormData}
                      placeholder="Pricing"
                      required
                      errorMsg={errors?.business_text}
                      label={'Basic Monthly Price'}
                    />

                    <CustomInput
                      type="text"
                      value={totalPrice}
                      name="total_price"
                      disabled={id}
                      //onChange={updateFormData}
                      placeholder="Pricing"
                      required
                      errorMsg={errors?.total_price}
                      label={'Total Amount'}
                    />  
                    <CustomInput
                      type="text"
                      value={balanceAmount}
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
                    {id && packageDetails?.admin_reply != null && (
                      <>
                        <CustomInput
                          disabled
                          type="text"
                          value={packageDetails?.admin_reply}
                          label={'Admin Reply'}
                        /> 
                      </>
                    )}     
                  </>
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
            
            {!id && (
              <button
                type="button"
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg
                text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                onClick={submitPackage}
              >
                Submit
              </button>
            )}
            {id && (packageDetails?.status != "Processing" && packageDetails?.base_price != "0.00") && (
              <button
                type="button"
                onClick={handlePayment}
                className="text-white mr-3 bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-4 py-2"
              >
                Pay Money
              </button>
            )}
            {id && (
              <button
                onClick={() => setRequestModal(true)}
                type="button"
                className="text-white mr-3 bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-4 py-2"
              >
                Edit Request
              </button>
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
          </form>
        </section>
      )}
      {requestModal && (
        <EditRequestModal
          toggleRequestModal={toggleRequestModal}
          packageId={id}
        />
      )}
    </div>
  );
};

export default Action;