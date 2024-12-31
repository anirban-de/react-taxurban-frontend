import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteOfficeSlice,
  setPageCount,
  setStaffs,
} from '../../../redux/OfficeSlice';
import { CustomPagination, InlineLoader } from '../../../components';
import { FiRefreshCcw } from 'react-icons/fi';
import { errorToast } from '../../../utils';

const List = () => {
  const dispatch = useDispatch();
  const tableHeadings = ['SN', 'Name', 'Email', 'Phone', 'Status'];
  const allstaff = useSelector((state) => state.office.staffs);
  const [loading, setLoading] = useState(false);
  const pageCount = useSelector((state) => state.office.pageCount);
  const [activePage, setActivePage] = useState(0);

  const getAllStaff = async () => {
    setLoading(true);
    try {
      const [response1, response2] = await Promise.all([
        axios.get(`api/department/all-department-staff`),
        axios.get(`api/department/all-department-staff/0`),
      ]);

      if (response1.data?.status === 200) {
        const total = response1.data.countallstaff;
        dispatch(setPageCount(Math.ceil(total / 10)));
      }

      if (response2.data?.status === 200) {
        dispatch(
          setStaffs({
            pageno: 0,
            data: response2.data.all_staff,
          })
        );
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorToast(error?.response?.data?.message || error?.message || 'Something went wrong')
    }
  };

  const getPageWiseData = async (page) => {
    if (allstaff?.[page]) {
      setActivePage(page);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `api/department/all-department-staff/${page}`
      );

      if (res.data.status === 200) {
        dispatch(
          setStaffs({
            pageno: activePage,
            data: res.data.all_staff,
          })
        );
        setActivePage(page);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorToast(error?.response?.data?.message || error?.message || 'Something went wrong')
    }
  };

  const onRefresh = () => {
    dispatch(deleteOfficeSlice());
  };

  useEffect(() => {
    if (!allstaff) {
      getAllStaff();
    }
  }, [allstaff]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <h1 className="font-semibold md:text-lg">Manage Staffs</h1>
          <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} />
        </div>
      </div>

      {loading && <InlineLoader loadingText={'Staffs'} />}

      {!loading && allstaff?.[activePage]?.length > 0 && (
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
              {allstaff?.[activePage]?.map((data, index) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th>
                  <td className="py-4 px-6">{data?.name}</td>
                  <td className="py-4 px-6">{data?.email}</td>
                  <td className="py-4 px-6">{data?.phone}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`${data?.status === 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }  text-xs font-semibold mr-2 px-2.5 py-0.5 rounded `}
                    >
                      {data?.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {/* <td className="py-4 px-6">
                    <div className="flex gap-3">
                      <div className="bg-green-400 hover:bg-green-500 p-1 cursor-pointer">
                        <Link to={`/department/staff/view/${data?.user_id}`}>
                          <BiShow size={20} className=" text-white" />
                        </Link>
                      </div>{' '}
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {allstaff && pageCount > 1 && (
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

export default List;
