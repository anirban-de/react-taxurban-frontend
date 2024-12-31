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
  setPackages,
  deletePackage,
} from '../../../redux/GstPackageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiExternalLink, FiRefreshCcw, FiTrash } from 'react-icons/fi';
import { NoAvatarImage } from '../../../assets';
import CustomTables from '../../../components/shared/CustomTables';
import ActionBtn from '../../../components/shared/ActionBtn';
import { errorToast } from '../../../utils';

const GstPackage = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const tableHeadings = ['SN', 'Package', 'Total Price', 'Business Text', 'Plan Duration', 'Status', 'Actions'];
  const dispatch = useDispatch();
  const allPackage = useSelector((state) => state.gstpackage.packages);
  const [activePage, setActivePage] = useState(0);
  const [search, setSearch] = useState('');

  const getAllPackage = async () => {
    // if (allPackage) {
    //   return;
    // }

    try {
      setLoading(true);
      axios.get('api/user-get-gst-package-list')
      .then(data => {
        //console.log("data", data.data )
        dispatch(setPackages(data?.data?.all_gpackage));
      })
      

    } catch (error) {
      errorToast(error)
    } finally {
      setLoading(false);
    }
  };

  // const removeCustomer = async (customer_id) => {
  //   const con = window.confirm('Are you sure ?');

  //   if (!con) {
  //     return;
  //   }

  //   try {
  //     const res = await axios.get(`api/admin/delete-customer/${customer_id}`);

  //     if (res.data.status === 200) {
  //       setActivePage(0);
  //       dispatch(deletePackage());
  //       Swal.fire({
  //         title: 'Success!',
  //         text: res.data.message,
  //         icon: 'success',
  //         confirmButtonText: 'Ok',
  //         timer: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     errorToast(error)
  //   }
  // };

  const getDataPageWise = async (page) => {
    // if (allPackage?.[page]) {
    //   return;
    // }

    try {
      setLoading(true);
      const res = await axios.get(`api/user-get-gst-package-list`);
      if (res.data.status === 200) {
        dispatch(setPackages({ pageno: page, data: res.data.customers }));
        setActivePage(page);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  // const searchCustomer = async () => {
  //   setLoading(true);
  //   setActivePage(0);
  //   try {
  //     await axios.get(`api/admin/all-customser/0/${search}`).then((res) => {
  //       if (res.data.status === 200) {
  //         dispatch(
  //           setPackages({ pageno: activePage, data: res.data.customers })
  //         );
  //         const total = res.data.countcustomers;
  //       }
  //     });
  //   } catch (error) {
  //     setLoading(false);
  //     errorToast(error)
  //   }
  //   setLoading(false);
  // };

  const onRefresh = () => {
    dispatch(deletePackage());
  };

  const getRowData = (data, index) => {
    if (!data) {
      return [];
    }
    return [index + 1, data.package_id, data?.total_price, data?.business_text, `${data?.plan_duration} Month(s)`, data.status]
  }

  const ActionBtnsElement = ({ data }) => {
    return (
      <div className="flex gap-3">
        <ActionBtn tooltip='Edit Package' onClick={() => navigation(`/branch/gst-package/edit/${data?.id}`)}>
          <FiEdit size={15} className=" text-white" />
        </ActionBtn>
        {/* <ActionBtn tooltip='Delete Package' onClick={() => removeCustomer(`${data.id}`)}>
          <FiTrash size={15} className=" text-white" />
        </ActionBtn> */}
      </div>
    )
  }


  useEffect(() => {
    getAllPackage();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <h1 className="font-semibold md:text-lg">All Gst Packages</h1>
          <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} />
        </div>
        <div className="flex items-center gap-3">
          {/* <div className="flex items-center gap-2">
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
          </CustomBtn> */}
          <CustomBtn onClick={() => navigation('/branch/gst-package/add')} >
            Add Package
          </CustomBtn>
        </div>
      </div>

      <CustomTables.Table
        loading={loading}
        noDataMessage='No Package Found ⚠️ '
        TABLE_HEADINGS={tableHeadings}
        DATA={allPackage}
        ROW_DATA={getRowData}
        ActionBtnsElement={ActionBtnsElement}
      />

      {allPackage && (
        <div>
          <nav
            aria-label="Page navigation example"
            className="mt-5 float-right"
          >
            <CustomPagination
              onPageChange={(page) => getDataPageWise(page)}
            />
          </nav>
        </div>
      )}
    </div>
  );
};

export default GstPackage;