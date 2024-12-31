import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CustomInput,
  CustomPagination,
  InlineLoader,
} from '../../../components';
import { setPageCount, setReport } from '../../../redux/WalletSlice';
import AddMoneyModal from '../Modals/MoneyModal';
import { errorToast } from '../../../utils';

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

  //const [transreport, setTransReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const transreport = useSelector((state) => state.wallet.report);
  const pageCount = useSelector((state) => state.wallet.pageCount);
  const [activePage, setActivePage] = useState(0);

  const getTransactionReport = async () => {
    setLoading(true);
    try {
      await axios.get(`api/transaction-report`).then((res) => {
        if (res.data.status === 200) {
          //dispatch(setReport(res.data?.result));
          handlePageClick({ selected: 0 });
          const total = res.data.countresult;
          dispatch(setPageCount(Math.ceil(total / 1)));
          setLoading(false);
        }
      });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  useEffect(() => {
    if (!transreport) {
      getTransactionReport();
    }
  }, []);

  const updateDates = (e) => {
    const { name, value } = e.target;
    setDates({ ...Dates, [name]: value });
  };

  const [branchid, setBranchId] = useState('');

  const [moneyModal, setMoneyModal] = useState(false);
  const toggleMoneyModal = () => setMoneyModal(!moneyModal);

  const getPageWiseData = async () => {
    try {
      await axios
        .get(
          `api/transaction-report/${activePage}/${Dates.from}/${Dates.to}/${branchid}`
        )
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

  const handlePageClick = (page) => {
    setActivePage(page);
  };

  const submitWalletFilter = async () => {
    setLoading(true);
    const active = 'null';
    try {
      await axios
        .get(
          `api/transaction-report/${active}/${Dates.from}/${Dates.to}/${branchid}`
        )
        .then((res) => {
          if (res.data.status === 200) {
            handlePageClick({ selected: 0 });
            const total = res.data.countresult;
            dispatch(setPageCount(Math.ceil(total / 1)));
            dispatch(
              setReport({
                pageno: activePage,
                data: res.data?.result,
              })
            );
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  const generateReport = async () => {
    setLoading(true);
    const active = 'null';
    try {
      await axios
        .get(
          `api/customer-wallet-pdf-report`
        )
        .then((res) => {
          setLoading(false);
          window.open(res.data.report)
        });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold md:text-lg align-top">Admin Wallet</h1>
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
            <span className=" text-xs text-gray-500">All branches records</span>
          </div>
          <div className="flex items-center gap-3">
            <CustomInput
              placeholder="Search by branch id"
              name="branchid"
              value={branchid}
              onChange={(e) => setBranchId(e.target.value)}
            />
            <div className="flex items-center gap-2">
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
            <button
              type="button"
              onClick={submitWalletFilter}
              className="mt-2 text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
            >
              Go
            </button>
            <button
              type="button"
              onClick={generateReport}
              className="mt-2 text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
            >
              Report
            </button>
          </div>
        </div>

        {loading && <InlineLoader loadingText={'wallet data'} />}
        {/* {console.log(transreport)} */}
        {!loading && transreport?.[activePage]?.length > 0 && (
          <table className="w-full text-xs md:text-sm text-left my-5 text-gray-500 dark:text-gray-400">
            <thead className=" text-xs uppercase text-white  bg-green-400 ">
              <tr>
                {tableHeadings?.map((tableHeading, index) => (
                  <th scope="col" className="py-3 px-6" key={index}>
                    {tableHeading}
                  </th>
                ))}
              </tr>
            </thead>
            {transreport?.[activePage]?.map((data, index) => (
              <tbody key={index}>
                <tr>
                  <td className="bg-gray-50 px-5 py-3 border-b" colSpan={7}>
                    <h1 className="font-semibold text-gray-700 ">{data[0]}</h1>
                  </td>
                </tr>
                {data[1]?.map((item, index) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    key={index}
                  >
                    <td
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {new Date(item?.created_at).toDateString()}
                    </td>
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
                    <td className="py-4 px-6">{'₹ ' + item?.wallet_balance}</td>
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
        <div className="flex justify-end mt-4 ">
          <CustomPagination total={pageCount} onPageChange={handlePageClick} />
        </div>
      )}
      {moneyModal && (
        <AddMoneyModal
          toggleMoneyModal={toggleMoneyModal}
          getTransactionReport={getTransactionReport}
        />
      )}
    </div>
  );
};

export default Passbook;
