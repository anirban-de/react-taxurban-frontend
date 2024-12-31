import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CustomBtn, CustomInput } from '../../../components';
import { FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { LoaderDark } from '../../../assets';
import { useDispatch } from 'react-redux';
import { deleteServiceRequestSlide } from '../../../redux/ServiceRequestSlice';
import CustomTables from '../../../components/shared/CustomTables';
import usePaymentHook from '../../../hooks/usePaymentHook';
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
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payment, setPayment] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState([]);
  const { status, id } = useParams();
  const [tokenmoney, setTokenMoney] = useState('');
  const [preferredamt, setPreferredAmt] = useState(0);

  const getPayment = async () => {
    try {
      setLoading(true);
      await axios.get(`api/get-payment-details/${id}`).then((res) => {
        if (res.data.status === 200) {
          setPayment(res.data.sr);
          setTokenMoney(res.data.token_money);
          setClient(res.data.client);
          setCustomer(res.data.customer);
          dispatch(deleteServiceRequestSlide())
        }
      });
      setLoading(false);
    } catch (error) {
      errorToast(error)
      setLoading(false);
    }
  };

  const paymentStatus = async () => {
    const con = window.confirm('Are you sure to accept this amount ?');

    if (!con) {
      return;
    }

    Swalwait();

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
          getPayment();
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
          getPayment();
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
            getPayment();
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

  const { makePayment } = usePaymentHook({ verifyApiUrl: 'api/sr-payment', callback: getPayment });

  const submitPayment = async () => {
    const type = document.querySelector('input[name="pay"]:checked').value;

    let amount = type === 'token' ? tokenmoney : payment.total_amount;

    if (
      payment.request_status === 2 &&
      payment.payment_id_token &&
      payment.payment_id_total === null
    ) {
      amount = payment.total_amount - payment.token_amount;
    }

    await makePayment({
      name: client.name,
      email: client.email,
      payerMobile: client.mobile,
      amount: amount,
      mobile: client.mobile,
      extra: [id, type]
    })

    return;
  }

  useEffect(() => {
    getPayment();
  }, []);

  return (
    <div>
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          onClick={() => {
            navigate(`/customer/service-request/${status}`, { replace: true });
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

      {!loading && payment?.total_amount && (
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
                    <div className="flex justify-between md:flex-row flex-col items-center gap-4">
                      <div>
                        {payment.total_amount !== tokenmoney && (
                          <div className='flex items-center gap-3'>
                            <input
                              type="radio"
                              value="token"
                              name="pay"
                              defaultChecked
                            />
                            <label className=' text-xs md:text-sm'> Token Amount ₹ {tokenmoney}</label>
                            <input type="radio" value="total" name="pay" />
                            <label className=' text-xs md:text-sm'> Total Amount ₹ {payment.total_amount}</label>
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
                            <label className=' text-xs md:text-sm'> Total Amount ₹ {payment.total_amount}</label>
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

            {/* payment details  */}
            <CustomTables.Table
              DATA={[1]}
              ROW_DATA={() => [customer.name, client.name, payment.request_id]}
              TABLE_HEADINGS={CUSTOMER_DETAILS_TABLE_HEADINGS}
            />
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
                TABLE_HEADINGS={CUSTOMER_PAYMENT_HISTORY_TABLE_HEADINGS}
              />}

            <CustomTables.Table
              DATA={[1]}
              ROW_DATA={() => [payment.total_amount, `₹ ${paymentinfo()['paid']}`, `₹ ${paymentinfo()['remain']}`]}
              TABLE_HEADINGS={CUSTOMER_PAYABLE_AMOUNT_TABLE_HEADINGS}
            />

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
