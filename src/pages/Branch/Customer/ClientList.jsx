import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CustomPagination, InlineLoader } from '../../../components';
import { FiArrowLeft } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setClients, setPageCount } from '../../../redux/ClientIDSlice';
import { toast } from 'react-toastify';
import { errorToast } from '../../../utils';

const ClientList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const tableHeadings = ['SN', 'ID', 'Name', 'Email', 'Mobile'];
  const allclient = useSelector((state) => state.clientsid.clients);
  const pageCount = useSelector((state) => state.clientsid.pageCount);
  const [activePage, setActivePage] = useState(0);

  const { id } = useParams();

  const getAllClient = async () => {
    try {
      setLoading(true);
      await axios.get(`api/branch/client/list/${id}`).then((res) => {
        if (res.data.status === 200) {
          dispatch(
            setClients({ id: id, pageno: activePage, data: res.data.clients })
          );
          const total = res.data.countclients;
          dispatch(setPageCount(Math.ceil(total / 10)));
        }
      });
    } catch (error) {
      errorToast(error)
    } finally {
      setLoading(false);
    }
  };

  const getPageWiseData = async (page) => {
    try {
      setLoading(true);
      await axios
        .get(`api/branch/client/list/${id}/${page}`)
        .then((res) => {
          if (res.data.status === 200) {
            dispatch(
              setClients({ id: id, pageno: page, data: res.data.clients })
            );
          }
        });
    } catch (error) {
      errorToast(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!allclient?.[id]?.[activePage]) getAllClient();
  }, []);

  return (
    <div>
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          onClick={() => navigate('/branch/customer')}
          className="cursor-pointer"
        />
        <h1 className="font-semibold md:text-lg">All Client</h1>
      </div>

      {loading && <InlineLoader loadingText={'Client List'} />}

      {!loading &&
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
              {allclient?.[id]?.[activePage]?.map((data, index) => (
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
                  <td className="py-4 px-6">{data?.client_id}</td>
                  <td className="py-4 px-6 capitalize">{data?.name}</td>
                  <td className="py-4 px-6">{data?.email}</td>
                  <td className="py-4 px-6">{data?.mobile}</td>
                </tr>
              ))}
              {allclient?.[id]?.[activePage]?.length === 0 && (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="py-4 px-6 text-center" colSpan={5}>
                    No Data Available!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }
      {pageCount > 1 && (
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

export default ClientList;
