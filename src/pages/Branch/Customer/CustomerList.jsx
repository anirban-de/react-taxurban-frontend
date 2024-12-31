import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CustomPagination, InlineLoader } from '../../../components';
import { BiShow } from 'react-icons/bi';
import { setCustomers, setPageCount } from '../../../redux/CustomerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { errorToast } from '../../../utils';

const CustomerList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const tableHeadings = ['SN', 'Name', 'Email', 'Mobile', 'Action'];
  const allcustomer = useSelector((state) => state.customer.customers);
  const pageCount = useSelector((state) => state.customer.pageCount);
  const [activePage, setActivePage] = useState(0);

  const getAllCustomer = async () => {
    try {
      setLoading(true);
      await axios.get(`api/branch/customer/list/0`).then((res) => {
        if (res.data.status === 200) {
          const total = res.data.countcustomers;
          dispatch(setPageCount(Math.ceil(total / 10)));
          dispatch(setCustomers({ pageno: 0, data: res.data.customers }));
          setLoading(false);
        }
      });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  const getPageWiseData = async (page) => {
    if (allcustomer?.[page]) {
      return;
    }

    setLoading(true);
    try {
      await axios.get(`api/branch/customer/list/${page}`).then((res) => {
        if (res.data.status === 200) {
          dispatch(
            setCustomers({ pageno: activePage, data: res.data.customers })
          );
          setActivePage(page);
        }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  useEffect(() => {
    if (!allcustomer) getAllCustomer();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold md:text-lg">All Customer</h1>
      </div>

      {loading && <InlineLoader loadingText={'Customer List'} />}

      {allcustomer && (
        <div className="overflow-x-auto relative">
          <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className=" text-xs uppercase text-white  bg-green-400">
              <tr>
                {tableHeadings?.map((tableHeading, index) => (
                  <th scope="col" className="py-3 px-6" key={index}>
                    {tableHeading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allcustomer?.[activePage]?.map((data, index) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={index}
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th>
                  <td className="py-4 px-6 capitalize">{data?.name}</td>
                  <td className="py-4 px-6">{data?.email}</td>
                  <td className="py-4 px-6">{data?.mobile}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3">
                      <div className="bg-green-400 hover:bg-green-500 p-1 cursor-pointer">
                        <Link to={`/branch/client/list/${data?.user_id}`}>
                          <BiShow size={20} className=" text-white" />
                        </Link>
                      </div>{' '}
                    </div>
                  </td>
                </tr>
              ))}
              {allcustomer?.[activePage]?.length === 0 && (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="py-4 px-6 text-center" colSpan={5}>
                    No Data Available!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {allcustomer && pageCount > 1 && (
        <div className="flex justify-end mt-4 ">
          <CustomPagination
            total={pageCount}
            onPageChange={(page) => getPageWiseData(page)}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerList;
