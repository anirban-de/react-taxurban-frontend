import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  CustomBtn,
  CustomInput,
  CustomPagination,
} from '../../../components';
import {
  setCustomers,
  setPageCount,
  deleteCustomer,
} from '../../../redux/CustomerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiExternalLink, FiRefreshCcw, FiTrash } from 'react-icons/fi';
import { NoAvatarImage } from '../../../assets';
import CustomTables from '../../../components/shared/CustomTables';
import ActionBtn from '../../../components/shared/ActionBtn';
import { errorToast } from '../../../utils';

const CustomerList = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const tableHeadings = ['SN', 'Name', 'Photo', 'Email', 'Mobile', 'Actions'];
  const dispatch = useDispatch();
  const allcustomer = useSelector((state) => state.customer.customers);
  const pageCount = useSelector((state) => state.customer.pageCount);
  const [activePage, setActivePage] = useState(0);
  const [search, setSearch] = useState('');

  const getAllCustomer = async () => {
    if (allcustomer) {
      return;
    }

    try {
      setLoading(true);
      const [response1, response2] = await Promise.all([
        axios.get(`api/admin/all-customer`),
        axios.get(`api/admin/all-customer/0`),
      ]);

      if (response1.data.status === 200) {
        const total = response1.data.countcustomers;
        dispatch(setPageCount(Math.ceil(total / 10)));
      }

      if (response2.data.status === 200) {
        dispatch(setCustomers({ pageno: 0, data: response2.data.customers }));
      }

    } catch (error) {
      errorToast(error)
    } finally {
      setLoading(false);
    }
  };

  const removeCustomer = async (customer_id) => {
    const con = window.confirm('Are you sure ?');

    if (!con) {
      return;
    }

    try {
      const res = await axios.get(`api/admin/delete-customer/${customer_id}`);

      if (res.data.status === 200) {
        setActivePage(0);
        dispatch(deleteCustomer());
        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
          timer: 3000,
        });
      }
    } catch (error) {
      errorToast(error)
    }
  };

  const getDataPageWise = async (page) => {
    if (allcustomer?.[page]) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`api/admin/all-customer/${page}`);
      if (res.data.status === 200) {
        dispatch(setCustomers({ pageno: page, data: res.data.customers }));
        setActivePage(page);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  const searchCustomer = async () => {
    setLoading(true);
    setActivePage(0);
    try {
      await axios.get(`api/admin/all-customer/0/${search}`).then((res) => {
        if (res.data.status === 200) {
          dispatch(
            setCustomers({ pageno: activePage, data: res.data.customers })
          );
          const total = res.data.countcustomers;
          dispatch(setPageCount(Math.ceil(total / 10)));
        }
      });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
    setLoading(false);
  };

  const onRefresh = () => {
    dispatch(deleteCustomer());
  };

  const getRowData = (data, index) => {
    if (!data) {
      return [];
    }

    const PhotoElement = () => {
      return (
        <div className="w-[40px] h-[40px]">
          <img
            className="rounded-full object-fill w-full h-full "
            src={data?.photo ? data.photo : NoAvatarImage}
          />
        </div>
      )
    }
    return [index + 1, data?.name, <PhotoElement />, data?.email, data?.mobile]
  }

  const ActionBtnsElement = ({ data }) => {
    return (
      <div className="flex gap-3">
        <ActionBtn tooltip='View Clients' onClick={() => navigation(`/admin/client/list/${data?.user_id}`)} >
          <FiExternalLink size={15} className=" text-white" />
        </ActionBtn>
        <ActionBtn tooltip='Edit Customer' onClick={() => navigation(`/admin/customer/edit/${data?.user_id}`)}>
          <FiEdit size={15} className=" text-white" />
        </ActionBtn>
        <ActionBtn tooltip='Delete Customer' onClick={() => removeCustomer(`${data.user_id}`)}>
          <FiTrash size={15} className=" text-white" />
        </ActionBtn>
      </div>
    )
  }


  useEffect(() => {
    if (!allcustomer) {
      getAllCustomer();
    }
  }, [allcustomer]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <h1 className="font-semibold md:text-lg">All Customer</h1>
          <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CustomInput
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Customer"
            />
          </div>
          <CustomBtn onClick={searchCustomer} >
            Go
          </CustomBtn>
        </div>
      </div>

      <CustomTables.Table
        loading={loading}
        noDataMessage='No Customer Found ⚠️ '
        TABLE_HEADINGS={tableHeadings}
        DATA={allcustomer?.[activePage]}
        ROW_DATA={getRowData}
        ActionBtnsElement={ActionBtnsElement}
      />

      {allcustomer && pageCount > 1 && (
        <div>
          <nav
            aria-label="Page navigation example"
            className="mt-5 float-right"
          >
            <CustomPagination
              total={pageCount}
              onPageChange={(page) => getDataPageWise(page)}
            />
          </nav>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
