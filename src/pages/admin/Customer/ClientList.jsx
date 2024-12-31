import React, { useState, useEffect } from 'react';
import { TbEdit } from 'react-icons/tb';
import { AiOutlineDelete } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { CustomBtn, InlineLoader } from '../../../components';
import { LoaderLight } from '../../../assets';
import { IoCopy } from 'react-icons/io5';
import { FiArrowLeft } from 'react-icons/fi';
import {
  setClients,
  setPageCount,
  deleteClientSlice,
} from '../../../redux/ClientIDSlice';
import { toast } from 'react-toastify';
import { errorToast } from '../../../utils';

const ClientList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const tableHeadings = [
    'SN',
    'Client Name',
    'Client Type',
    'Trade Name',
    'Client ID',
    'Actions',
  ];
  const allclient = useSelector((state) => state.clientsid.clients);
  const pageCount = useSelector((state) => state.clientsid.pageCount);
  const [activePage, setActivePage] = useState(0);

  const { id } = useParams();

  const getAllClient = async () => {
    try {
      await axios.get(`api/admin/client/list/${id}`).then((res) => {
        if (res.data.status === 200) {
          dispatch(
            setClients({ id: id, pageno: activePage, data: res.data.clients })
          );
          const total = res.data.countclients;
          dispatch(setPageCount(Math.ceil(total / 10)));
        }
      });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  const deleteClient = async (id) => {
    const con = window.confirm('Are you sure ?');

    if (!con) {
      return;
    }

    try {
      await axios.get(`api/admin/delete-client/${id}`).then((res) => {
        if (res.data.status === 200) {
          setActivePage(0);
          dispatch(deleteClientSlice());
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });

          getAllClient();
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  useEffect(() => {
    if (!allclient?.[id]?.[activePage]) getAllClient();
  }, []);

  const copyToClipboard = (client_id) => {
    navigator.clipboard.writeText(client_id).then(
      function () {
        toast.success('Copied to clipboard');
      },
      function (error) { }
    );
  };

  const getPageWiseData = async () => {
    try {
      await axios
        .get(`api/admin/client/list/${id}/${activePage}`)
        .then((res) => {
          if (res.data.status === 200) {
            dispatch(
              setClients({ id: id, pageno: activePage, data: res.data.clients })
            );
          }
        });
    } catch (error) {
      errorToast(error)
    }
  };

  useEffect(() => {
    if (
      !allclient?.[id]?.[activePage] ||
      allclient?.[id]?.[activePage]?.length === 0
    ) {
      getPageWiseData();
    }
  }, [activePage]);

  const handlePageClick = async (data) => {
    setActivePage(data.selected);
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          onClick={() => navigate('/admin/customer')}
          className="cursor-pointer"
        />
        <h1 className="md:text-lg font-semibold ml-3">All Client</h1>
      </div>

      {loading && <InlineLoader loadingText={'client List'} />}

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
                <td className="py-4 px-6">{data?.name}</td>
                <td className="py-4 px-6 capitalize">{data?.client_type}</td>
                <td className="py-4 px-6">{data?.trade_name}</td>
                <td className="py-4 px-6 capitalize">
                  {data?.client_id}{' '}
                  <button onClick={() => copyToClipboard(`${data?.client_id}`)}>
                    <IoCopy size={20} className="text-green-500" />
                  </button>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-3">
                    <div className="bg-green-400 hover:bg-green-500 p-1 cursor-pointer">
                      <Link to={`/admin/client/edit/${data?.id}`}>
                        <TbEdit size={20} className=" text-white" />
                      </Link>
                    </div>{' '}
                    <div className="bg-green-400 hover:bg-green-500 p-1 cursor-pointer">
                      <button onClick={() => deleteClient(`${data.id}`)}>
                        <AiOutlineDelete size={20} className=" text-white" />
                      </button>
                    </div>
                  </div>
                </td>
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
      {pageCount > 0 && (
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
    </div>
  );
};

export default ClientList;
