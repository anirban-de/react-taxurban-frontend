import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { clearStaffs, setPageCount, setStaffs } from '../../../redux/OfficeSlice';
import { CustomPagination, CustomInput, CustomBtn } from '../../../components';
import DepartmentModal from '../Modals/DepartmentModal';
import { FiEdit, FiRefreshCcw, FiTrash } from 'react-icons/fi';
import { errorToast } from '../../../utils';
import CustomTables from '../../../components/shared/CustomTables';
import ActionBtn from '../../../components/shared/ActionBtn';

const AllStaff = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const tableHeadings = ['SN', 'Name', 'Department', 'Actions'];
  const allstaff = useSelector((state) => state.office.staffs);
  const [loading, setLoading] = useState(false);
  const [departmentModal, setDepartmentModal] = useState(false);
  const toggleDepartmentModal = () => setDepartmentModal(!departmentModal);
  const pageCount = useSelector((state) => state.office.pageCount);
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState(0);

  const getAllStaff = async () => {
    if (allstaff) {
      return;
    }
    try {
      setLoading(true);
      const [response1, response2] = await Promise.all([
        axios.get(`api/admin/all-staff`),
        axios.get(`api/admin/all-staff/0`),
      ]);

      if (response1.data.status === 200) {
        const total = response1.data.countallstaff;
        dispatch(setPageCount(Math.ceil(total / 10)));
      }

      if (response2.data.status === 200) {
        dispatch(
          setStaffs({
            pageno: 0,
            data: response2.data?.all_staff,
          })
        );
      }

      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
    return;
  };

  const searchStaff = async () => {
    setLoading(true);
    setActivePage(0);
    try {
      await axios.get(`api/admin/all-staff/0/${search}`).then((res) => {
        if (res.data.status === 200) {
          dispatch(
            setStaffs({
              pageno: 0,
              data: res.data?.all_staff,
            })
          );
          const total = res.data.countallstaff;
          dispatch(setPageCount(Math.ceil(total / 10)));
        }
      });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
    setLoading(false);
  };

  const deleteStaff = async (id) => {
    const con = window.confirm('Are you sure ?');
    if (!con) {
      return;
    }

    try {
      const res = await axios.get(`api/admin/delete-staff/${id}`);
      if (res.data.status === 200) {
        setActivePage(0);
        dispatch(clearStaffs());
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

  const getPageWiseData = async (page) => {
    if (allstaff?.[page]) {
      return;
    }
    try {
      await axios.get(`api/admin/all-staff/${page}`).then((res) => {
        if (res.data.status === 200) {
          dispatch(
            setStaffs({
              pageno: page,
              data: res.data.all_staff,
            })
          );
          setActivePage(page);
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  const getRowData = (data, index) => {
    if (!data) {
      return [];
    }

    return [index + 1, data?.name, data?.category_name]
  }

  const ActionBtnsElement = ({ data }) => {
    return (
      <div className="flex gap-3">
        <ActionBtn tooltip='View Clients' onClick={() => navigation(`/admin/edit-staff/${data?.user_id}`)} >
          <FiEdit size={15} className=" text-white" />
        </ActionBtn>
        <ActionBtn tooltip='Delete Customer' onClick={() => deleteStaff(`${data.user_id}`)}>
          <FiTrash size={15} className=" text-white" />
        </ActionBtn>
      </div>
    )
  }

  const onRefresh = () => {
    dispatch(clearStaffs());
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

        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <CustomInput
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search By Department"
            />
          </div>
          <CustomBtn onClick={searchStaff} >
            Go
          </CustomBtn>

          <button
            onClick={() => navigation('/admin/add-staff')}
            type="button"
            className="text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-4 py-2"
          >
            Add Staff
          </button>
        </div>
      </div>

      <CustomTables.Table
        loading={loading}
        noDataMessage='No Staff Found ⚠️ '
        TABLE_HEADINGS={tableHeadings}
        DATA={allstaff?.[activePage]}
        ROW_DATA={getRowData}
        ActionBtnsElement={ActionBtnsElement}
      />

      {allstaff && pageCount > 1 && (
        <div className="flex justify-end mt-4 ">
          <CustomPagination
            total={pageCount}
            onPageChange={(page) => getPageWiseData(page)}
          />
        </div>
      )}
      {departmentModal && (
        <DepartmentModal toggleDepartmentModal={toggleDepartmentModal} />
      )}
    </div>
  );
};

export default AllStaff;
