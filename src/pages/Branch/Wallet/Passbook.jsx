import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { IoReloadCircle } from 'react-icons/io5';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { CustomBtn, CustomInput, InlineLoader } from '../../../components';
import { setReport, setPageCount } from '../../../redux/WalletSlice';
import AddMoneyModal from '../Modals/MoneyModal';
import usePaymentHook from '../../../hooks/usePaymentHook';
import { errorToast } from '../../../utils';
import { FiRefreshCcw } from 'react-icons/fi';

const tableHeadings = [
  'Date',
  'Particulars',
  'Ref.No.',
  'Credit',
  'Debit',
  'Balance',
];

const Passbook = () => {
  const dispatch = useDispatch();
  let modifyDate = (date) => {
    if (date !== '') {
      date.toLocaleDateString().split('/').reverse().join('-');
    }
  };
  const [Dates, setDates] = useState({
    from: modifyDate(''),
    to: modifyDate(''),
  });
  const [loading, setLoading] = useState(false);
  const transreport = useSelector((state) => state.wallet.report);
  const [branch, setBranch] = useState({
    balance: 0,
    name: '',
    email: '',
    mobile: '',
  });
  const pageCount = useSelector((state) => state.wallet.pageCount);
  const [activePage, setActivePage] = useState(0);
  const [isdateavailable, setIsDateAvailable] = useState(false);
  const [datewalletresport, setDateWalletReport] = useState([]);

  const getBranch = async () => {
    try {
      axios.get(`api/branch/get-branch`).then((res) => {
        if (res.data.status === 200) {
          setBranch({
            balance: res.data.branch.balance,
            name: res.data.branch.applicant_name,
            email: res.data.user.email,
            mobile: res.data.branch.mobile_no,
          });
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  const getTransactionReport = async () => {
    setLoading(true);
    try {
      await axios.get(`api/transaction-report`).then((res) => {
        if (res.data.status === 200) {
          handlePageClick({ selected: 0 });
          const total = res.data.countresult;
          dispatch(setPageCount(Math.ceil(total / 4)));
          setLoading(false);
        }
      });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  const reload = async () => {
    try {
      await getTransactionReport();
      await getBranch();
    } catch (error) {
      errorToast(error)
    }
  }


  const { makePayment } = usePaymentHook({ verifyApiUrl: 'api/branch/branch-wallet-process', callback: reload });

  useEffect(() => {
    if (!transreport) {
      getTransactionReport();
      //getBranch();
    }
  }, []);

  useEffect(() => {
    getBranch();
  });

  const getPageWiseData = async () => {
    try {
      await axios
        .get(`api/transaction-report/${activePage}/${Dates.from}/${Dates.to}`)
        .then((res) => {
          if (res.data.status === 200) {
            dispatch(
              setReport({
                pageno: activePage,
                data: res.data?.result,
              })
            );
          }
        });
    } catch (error) {
      errorToast(error)
    }
  };

  useEffect(() => {
    if (!transreport?.[activePage] || transreport?.[activePage]?.length === 0) {
      getPageWiseData();
    }
  }, [activePage]);

  const handlePageClick = (data) => {
    setActivePage(data.selected);
  };

  const updateDates = (e) => {
    const { name, value } = e.target;
    setDates({ ...Dates, [name]: value });
  };

  const [moneyModal, setMoneyModal] = useState(false);
  const toggleMoneyModal = () => setMoneyModal(!moneyModal);

  const submitWalletFilter = async () => {
    setLoading(true);
    try {
      await axios
        .get(`api/transaction-report/0/${Dates.from}/${Dates.to}`)
        .then((res) => {
          if (res.data.status === 200) {
            setLoading(false);
            setIsDateAvailable(true);
            setDateWalletReport(res.data.result);
          }
        });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className='flex flex-row items-center gap-3'>
          <h1 className="font-semibold md:text-lg align-top">Branch Wallet</h1>
          <FiRefreshCcw onClick={reload} />
        </div>
        <div>
          <button
            type="button"
            onClick={toggleMoneyModal}
            className="text-white mr-3 bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-4 py-2"
          >
            Manage Money
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md my-5">
        <div className="flex justify-between items-start">
          <div className="flex items-start flex-col">
            <h1 className="font-medium "> Wallet Passbook</h1>
            <h5 className="text-black-500">Balance : ₹ {branch.balance}</h5>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <IoReloadCircle
                size={20}
                className="text-black"
                onClick={() => {
                  Dates.from = '';
                  Dates.to = '';
                  setIsDateAvailable(false);
                }}
                cursor="pointer"
              />
              <span>From</span>
              <CustomInput
                type="date"
                value={Dates.from}
                name="from"
                onChange={updateDates}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>To</span>
              <CustomInput
                type="date"
                name="to"
                value={Dates.to}
                onChange={updateDates}
              />
            </div>
            <CustomBtn type="button" onClick={submitWalletFilter}>Go</CustomBtn>
          </div>
        </div>

        {loading && <InlineLoader loadingText={'wallet data'} />}

        {!loading && transreport?.[activePage]?.length > 0 && (
          <table className="w-full text-xs md:text-sm text-left my-5 text-gray-500 dark:text-gray-400">
            <thead className=" text-xs uppercase text-white  bg-green-400">
              <tr>
                {tableHeadings?.map((tableHeading, index) => (
                  <th scope="col" className="py-3 px-6" key={index}>
                    {tableHeading}
                  </th>
                ))}
              </tr>
            </thead>
            {!isdateavailable &&
              transreport?.[activePage]?.map((data, index) => (
                <tbody key={index}>
                  <tr>
                    <td className="bg-gray-50 px-5 py-3 border-b" colSpan={7}>
                      <h1 className="font-semibold text-gray-700 ">
                        {data[0]}
                      </h1>
                    </td>
                  </tr>
                  {data[1].map((item, index) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={index}
                    >
                      <th
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {new Date(item?.created_at).toDateString()}
                      </th>
                      <td className="py-4 px-6">{item?.reason}</td>
                      <td className="py-4 px-6">{item?.ref_no}</td>
                      <td className="py-4 px-6">
                        {item?.transaction_type === 'Credit' &&
                          '₹ ' + item?.amount}
                      </td>
                      <td className="py-4 px-6">
                        {item?.transaction_type === 'Debit' &&
                          '₹ ' + item?.amount}
                      </td>
                      <td className="py-4 px-6">
                        {'₹ ' + item?.wallet_balance}
                      </td>
                    </tr>
                  ))}
                  {data[1].length === 0 && (
                    <tr className="text-center">
                      <td className="px-5 py-3 border-b" colSpan={7}>
                        No Data Available!
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}

            {isdateavailable &&
              datewalletresport?.map((data, index) => (
                <tbody key={index}>
                  <td className="bg-gray-50 px-5 py-3 border-b" colSpan={7}>
                    <h1 className="font-semibold text-gray-700 ">{data[0]}</h1>
                  </td>
                  {data[1].map((item, index) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={index}
                    >
                      <th
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {new Date(item?.created_at).toDateString()}
                      </th>
                      <td className="py-4 px-6">{item?.reason}</td>
                      <td className="py-4 px-6">{item?.ref_no}</td>
                      <td className="py-4 px-6">
                        {item?.transaction_type === 'Credit' &&
                          '₹ ' + item?.amount}
                      </td>
                      <td className="py-4 px-6">
                        {item?.transaction_type === 'Debit' &&
                          '₹ ' + item?.amount}
                      </td>
                      <td className="py-4 px-6">
                        {'₹ ' + item?.wallet_balance}
                      </td>
                    </tr>
                  ))}
                  {data[1].length === 0 && (
                    <tr className="text-center">
                      <td className="px-5 py-3 border-b" colSpan={7}>
                        No Data Available!
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}
          </table>
        )}
      </div>
      {transreport && pageCount > 1 && (
        <div>
          <nav
            aria-label="Page navigation example"
            className="mt-5 float-right"
          >
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={6}
              pageCount={pageCount}
              marginPagesDisplayed={3}
              previousLabel="Previous"
              //renderOnZeroPageCount={null}
              containerClassName="inline-flex -space-x-px"
              pageClassName=""
              pageLinkClassName="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              previousClassName=""
              previousLinkClassName="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              nextClassName=""
              nextLinkClassName="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              breakClassName=""
              breakLinkClassName="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              activeClassName=""
              activeLinkClassName="text-blue-600 bg-blue-50"
            />
          </nav>
        </div>
      )}
      {moneyModal && (
        <AddMoneyModal
          onPayment={makePayment}
          toggleMoneyModal={toggleMoneyModal}
          branch={branch}
        />
      )}
    </div>
  );
};

export default Passbook;
