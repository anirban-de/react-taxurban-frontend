import React, { useState, useEffect } from 'react';
import { TbEdit } from 'react-icons/tb';
import { AiOutlineDelete } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CustomBtn, CustomInput, CustomPagination, InlineLoader } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBranchData,
  setPageCount,
  deleteBranchSlice,
} from '../../../redux/BranchesSlice';
import { FiEdit, FiRefreshCcw, FiTrash } from 'react-icons/fi';
import CustomTables from '../../../components/shared/CustomTables';
import ActionBtn from '../../../components/shared/ActionBtn';
import { errorToast } from '../../../utils';

const AllBranch = () => {
  const tableHeadings = [
    'SN',
    'Branch Code',
    'Branch Name',
    'Business Name',
    'Balance',
    'Status',
    'Created Date',
    'Actions',
  ];
  const dispatch = useDispatch();
  const STATUS = ['Pending', 'Approved', 'Rejected'];
  const [activeStatus, setActiveStatus] = useState(STATUS[0]);
  const allbranch = useSelector((state) => state.braches);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const pageCount = allbranch?.[activeStatus]?.pageCount;
  const [search, setSearch] = useState('');
  const navigation = useNavigate();

  const getAllBranch = async () => {
    if (allbranch?.[activeStatus]) {
      return;
    }
    try {
      setLoading(true);

      const [response1, response2] = await Promise.all([
        axios.get(`api/admin/all-branch/${activeStatus}`),
        axios.get(`api/admin/all-branch/${activeStatus}/${activePage}`),
      ]);

      if (response1.data.status === 200) {
        const total = response1.data.countallbranch;
        dispatch(
          setPageCount({
            mode: activeStatus,
            pageCount: Math.ceil(total / 10),
          })
        );
      }

      if (response2.data.status === 200) {
        dispatch(
          setBranchData({
            mode: activeStatus,
            activePage: 0,
            data: response2.data?.allbranch,
          })
        );
      }

      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const searchBranch = async () => {
    setLoading(true);
    setActivePage(0);
    try {
      await axios.get(`api/admin/all-branch/${activeStatus}/0/${search}`).then((res) => {
        if (res.data.status === 200) {
          dispatch(
            setBranchData({
              mode: activeStatus,
              activePage: 0,
              data: res.data?.allbranch,
            })
          );
          const total = res.data.countallbranch;
          dispatch(setPageCount(Math.ceil(total / 10)));
        }
      });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
    setLoading(false);
  };

  const deleteBranch = async (id) => {
    const con = window.confirm('Are you sure ?');

    if (!con) {
      return;
    }

    try {
      await axios.get(`api/admin/delete-branch/${id}`).then((res) => {
        if (res.data.status === 200) {
          dispatch(deleteBranchSlice());
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  const getPageWiseData = async (page) => {
    if (allbranch?.[activeStatus]?.[page]) {
      return;
    }

    try {
      const res = await axios.get(
        `api/admin/all-branch/${activeStatus}/${page}`
      );

      if (res.data.status === 200) {
        dispatch(
          setBranchData({
            mode: activeStatus,
            activePage: page,
            data: res?.data?.allbranch,
          })
        );
        setActivePage(page);
      }
    } catch (error) {
      errorToast(error)
    }
  };

  const getRowData = (data, index) => {
    if (!data) {
      return [];
    }

    const StatusElement = () => {
      if (data?.status === 'Pending') {
        return <span
          className="bg-yellow-100 text-yellow-800 text-xs md:text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200
        dark:text-yellow-900"
        >
          {data?.status}
        </span>
      }

      if (data?.status === 'Approved') {
        return <span
          className="bg-green-100 text-green-800 text-xs md:text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200
        dark:text-yellow-900"
        >
          {data?.status}
        </span>
      }

      if (data?.status === 'Rejected') {
        return <span
          className="bg-red-100 text-red-800 text-xs md:text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200
        dark:text-yellow-900"
        >
          {data?.status}
        </span>
      }
    }

    return [index + 1, data?.branch_code, data?.name, data?.business_name, `₹ ${data?.balance}`, <StatusElement />, new Date(data?.created_at).toDateString()]
  }

  const ActionBtnsElement = ({ data }) => {
    return (
      <div className="flex gap-3">
        <ActionBtn tooltip='Edit service' onClick={() => navigation(`/admin/edit-branch/${data?.user_id}`)} >
          <FiEdit size={15} className=" text-white" />
        </ActionBtn>
        <ActionBtn tooltip='Edit service' onClick={() => deleteBranch(`${data.user_id}`)} >
          <FiTrash size={15} className=" text-white" />
        </ActionBtn>
      </div>
    )
  }

  const onRefresh = () => {
    dispatch(deleteBranchSlice());
  };

  useEffect(() => {
    if (!allbranch[activeStatus]) {
      getAllBranch();
    }
  }, [activeStatus, allbranch]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center mb-4">
          <h1 className="font-semibold md:text-lg">Manage Branch</h1>
          <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CustomInput
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Branch"
            />
          </div>
          <CustomBtn onClick={searchBranch} >
            Go
          </CustomBtn>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-3 ">
          <CustomTables.Modes MODES={STATUS} activeMode={activeStatus} setActivePage={setActivePage} setActiveMode={setActiveStatus} />
        </div>

        <CustomTables.Table
          TABLE_HEADINGS={tableHeadings}
          loading={loading}
          noDataMessage={`No ${activeStatus} Branch ⚠️`}
          DATA={allbranch?.[activeStatus]?.[activePage]}
          ROW_DATA={getRowData}
          ActionBtnsElement={ActionBtnsElement}
        />

        {allbranch && pageCount > 1 && (
          <div className="flex justify-end mt-4 ">
            <CustomPagination
              total={pageCount}
              onPageChange={(page) => getPageWiseData(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBranch;
