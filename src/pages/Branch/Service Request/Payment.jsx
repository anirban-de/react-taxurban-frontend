import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CustomBtn, CustomInput } from '../../../components';
import { FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { LoaderDark } from '../../../assets';
import { deleteServiceRequestSlide } from '../../../redux/ServiceRequestSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Swalwait, errorToast } from '../../../utils';

const CUSTOMER_DETAILS_TABLE_HEADINGS = [
  'Customer Name',
  'Client Name',
  'SR No.',
]

const CUSTOMER_PAYMENT_HISTORY_TABLE_HEADINGS = ['Payment ID', 'Amount']

const CUSTOMER_PAYABLE_AMOUNT_TABLE_HEADINGS = ['Total Amount', 'Paid Amount', 'Remaining Amount'];


const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payment, setPayment] = useState([]);
  const [client, setClient] = useState(null);
  const { status, id } = useParams();
  const [tokenmoney, setTokenMoney] = useState('');
  const [preferredamt, setPreferredAmt] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);

  const getDetails = async () => {
    try {
      setLoading(true);
      const response = Promise.all([
        axios.get(`api/get-payment-details/${id}`),
        axios.get(`api/branch/get-branch`),
      ]);

      const data = await response;
      if (data[0].data.status === 200) {
        setPayment(data[0].data.sr);
        setTokenMoney(data[0].data.token_money);
        setClient(data[0].data.client);
        setCustomer(data[0].data.customer);
        dispatch(deleteServiceRequestSlide())
      }

      if (data[1].data.status === 200) {
        setBalance(data[1].data.branch.balance);
      }
    } catch (error) {
      errorToast(error)
    } finally {
      setLoading(false);
    }
  };

  const paymentStatus = async () => {
    const con = window.confirm('Are you sure to accept this amount ?');

    if (!con) {
      return;
    }

    try {
      await axios.get(`api/set-payment-status/${id}/2`).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
          getDetails();
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  const paymentStatusDecline = async () => {
    const con = window.confirm('Are you sure ?');

    if (!con) {
      return;
    }

    Swalwait();

    try {
      await axios.get(`api/set-payment-status/${id}/3`).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
          getDetails();
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  const submitPreferredPayment = async () => {
    const con = window.confirm('Are you sure ?');

    if (!con) {
      return;
    }

    Swalwait();

    try {
      const data = {
        id: id,
        preferred_amt: preferredamt,
      };

      await axios
        .post(`api/customer/set-preferred-amount`, data)
        .then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              title: 'Success!',
              text: res.data.message,
              icon: 'success',
              confirmButtonText: 'Ok',
              timer: 3000,
            });
            getDetails();
          }
        });
    } catch (error) {
      errorToast(error)
    }
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

  const submitPayment = () => {
    const con = window.confirm('Are you sure ?');

    if (!con) {
      return;
    }

    const type = document.querySelector('input[name="pay"]:checked').value;

    let amount = type === 'token' ? tokenmoney : payment.total_amount;

    if (
      payment.request_status === 2 &&
      payment.payment_id_token &&
      payment.payment_id_total === null
    ) {
      amount = payment.total_amount - payment.token_amount;
    }

    if (amount > balance) {
      Swal.fire({
        title: 'Warning!',
        text: 'Insufficient Balance',
        icon: 'warning',
        confirmButtonText: 'Ok',
        timer: 3000,
      });

      return;
    }

    const data = {
      type: type,
      id: id,
      amount: amount,
    };

    Swal.fire({
      title: 'Warning!',
      text: 'Please wait...',
      icon: 'warming',
    });

    axios.post(`api/branch-sr-payment`, data).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
          timer: 3000,
        });

        getDetails();
      }
    });
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div>
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          onClick={() => {
            navigate(`/branch/service-request/${status}`, { replace: true });
          }}
          className="cursor-pointer"
        />
        <h1 className="md:text-lg font-semibold ml-3">Payment</h1>
      </div>

      {loading && (
        <div className="flex flex-1 h-[75vh] justify-center items-center">
          <img src={LoaderDark} className="w-8 h-8" />
        </div>
      )}

      {!loading && (
        <section>
          <div className="bg-white p-6 rounded-md mb-5">
            <section className='flex items-center justify-between mb-5'>
              {/* payment sectors  */}
              <div>
                {/* accept or reject  */}
                {payment.request_status === 1 && (
                  <div className="flex justify-between items-end gap-3">
                    <div className="w-full">
                      <CustomInput
                        placeholder={'Total Amount'}
                        label={`Total Amount`}
                        value={`₹ ${payment.total_amount}`}
                        disabled={true}
                      />
                    </div>
                    <CustomBtn onClick={paymentStatus} >Accept</CustomBtn>
                    <CustomBtn color='red' onClick={paymentStatusDecline} >Reject</CustomBtn>
                  </div>
                )}
                {/* select amount type  */}
                {payment.request_status === 2 &&
                  payment.payment_id_token === null &&
                  payment.payment_id_total === null && (
                    <div className="flex justify-between items-center gap-4">
                      <div>
                        {payment.total_amount !== tokenmoney && (
                          <div className='flex items-center gap-3'>
                            <input
                              type="radio"
                              value="token"
                              name="pay"
                              defaultChecked
                            />
                            <label> Token Amount ₹ {tokenmoney}</label>
                            <input type="radio" value="total" name="pay" />
                            <label> Total Amount ₹ {payment.total_amount}</label>
                          </div>
                        )}
                        {payment.total_amount === tokenmoney && (
                          <div className='flex items-center gap-3'>
                            <input
                              type="radio"
                              value="total"
                              name="pay"
                              defaultChecked
                              disabled
                            />
                            <label> Total Amount ₹ {payment.total_amount}</label>
                          </div>
                        )}
                      </div>
                      <CustomBtn customClasses='px-5' onClick={submitPayment}>Pay</CustomBtn>
                    </div>
                  )}

                {/* remaining amount  */}
                {payment.request_status === 2 &&
                  payment.payment_id_token &&
                  payment.payment_id_total === null && (
                    <div className="flex justify-between items-center gap-4">
                      <div className='flex items-center gap-3'>
                        <input
                          type="radio"
                          value="total"
                          name="pay"
                          defaultChecked
                          disabled={true}
                        />
                        <label> Remaining Amount ₹ {payment.rest_amount}</label>
                      </div>
                      <CustomBtn onClick={submitPayment}>Pay</CustomBtn>
                    </div>
                  )}

                {/* set preffered amount  */}
                {payment.request_status === 3 && (
                  <div className="flex items-end gap-3">
                    <CustomInput
                      placeholder={`Enter Your Preferred Amount`}
                      label={`Enter Your Preferred Amount`}
                      value={preferredamt}
                      name="preferredamt"
                      onChange={(e) => setPreferredAmt(e.target.value)}
                      required
                    />
                    <CustomBtn onClick={submitPreferredPayment} >Submit</CustomBtn>
                  </div>
                )}

                {payment.request_status === 4 && (
                  <p className="text-green-500 mt-5">
                    Your preferred amount : {payment.preferred_amt}, please wait for
                    a while until and unless taxurban accept this amount or contact
                    with you
                  </p>
                )}

              </div>

              {/* <div>
                {payment.payment_id_token && payment.payment_id_total &&
                  <CustomBtn onClick={() => window.print()} >Download Recipt</CustomBtn>
                }
              </div> */}
            </section>

            <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className=" text-xs uppercase text-white  bg-green-400 ">
                <tr>
                  {CUSTOMER_DETAILS_TABLE_HEADINGS.map((tableHeading, index) => (
                    <th scope="col" className="py-3 px-6" key={index}>
                      {tableHeading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {customer?.name}
                  </td>
                  <td
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {client?.name}
                  </td>
                  <td
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {payment.request_id}
                  </td>
                </tr>
              </tbody>
            </table>

            {(payment.payment_id_token !== null || payment.payment_id_total !== null) &&
              <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
                <thead className=" text-xs uppercase text-white  bg-green-400">
                  <tr>
                    {CUSTOMER_PAYMENT_HISTORY_TABLE_HEADINGS.map((tableHeading, index) => (
                      <th scope="col" className="py-3 px-6" key={index}>
                        {tableHeading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payment.payment_id_token && (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="py-4 px-6">{payment.payment_id_token}</td>
                      <td className="py-4 px-6">{'₹ ' + payment.token_amount}</td>
                    </tr>
                  )}
                  {payment.payment_id_token && payment.payment_id_total && (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="py-4 px-6">{payment.payment_id_total}</td>
                      <td className="py-4 px-6">
                        {'₹ '}
                        {payment.rest_amount}
                      </td>
                    </tr>
                  )}
                  {payment.payment_id_token === null &&
                    payment.payment_id_total && (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="py-4 px-6">{payment.payment_id_total}</td>
                        <td className="py-4 px-6">
                          {'₹ '}
                          {payment.total_amount}
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            }

            <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
              <thead className=" text-xs uppercase text-white  bg-green-400">
                <tr>
                  {CUSTOMER_PAYABLE_AMOUNT_TABLE_HEADINGS.map((tableHeading, index) => (
                    <th scope="col" className="py-3 px-6" key={index}>
                      {tableHeading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="col" className="py-3 px-6">
                    {'₹ '} {payment.total_amount}
                  </th>
                  <th scope="col" className="py-3 px-6">
                    {'₹ '} {paymentinfo()['paid']}
                  </th>
                  <th scope="col" className="py-3 px-6">
                    {'₹ '} {paymentinfo()['remain']}
                  </th>
                </tr>
              </tbody>
            </table>
            {payment.payment_id_total && (
              <p className="text-green-500 mt-5">
                Thank you!. You have paid the full amount of Service Request
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Payment;
