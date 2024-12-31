import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { clearUnits, setUnits } from '../../../redux/UnitSlice';
//import { CustomInput, CustomBtn } from '../../../components';
import { FiEdit, FiRefreshCcw, FiTrash } from 'react-icons/fi';
import { errorToast } from '../../../utils';
import CustomTables from '../../../components/shared/CustomTables';
import ActionBtn from '../../../components/shared/ActionBtn';

const AllUnit = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const tableHeadings = ['SN', 'Unit', 'Actions'];
  const allunit = useSelector((state) => state.unit.units);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState(0);

  const getAllUnit = async () => {
    // if (allunit) {
    //   return;
    // }
    try {
      setLoading(true);
      const [response1] = await Promise.all([
        axios.get(`api/admin/all-unit`)
      ]);

      if (response1.data.status === 200) {
        dispatch(
          setUnits({
            data: response1.data?.all_unit,
          })
        );
      }

      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
    return;
  };

  // const searchStaff = async () => {
  //   setLoading(true);
  //   setActivePage(0);
  //   try {
  //     await axios.get(`api/admin/all-unit/0/${search}`).then((res) => {
  //       if (res.data.status === 200) {
  //         dispatch(
  //           setStaffs({
  //             pageno: 0,
  //             data: res.data?.all_unit,
  //           })
  //         );
  //         const total = res.data.countallunit;
  //         dispatch(setPageCount(Math.ceil(total / 10)));
  //       }
  //     });
  //   } catch (error) {
  //     setLoading(false);
  //     errorToast(error)
  //   }
  //   setLoading(false);
  // };

  const deleteUnit = async (id) => {
    const con = window.confirm('Are you sure ?');
    if (!con) {
      return;
    }

    try {
      var form = new FormData();
      form.append("id", id);
      const res = await axios.post(`api/admin/delete-unit`, form);
      if (res.data.status === 200) {
        getAllUnit();
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

  

  const getRowData = (data, index) => {
    if (!data) {
      return [];
    }

    return [index + 1, data?.unit_name]
  }

  const ActionBtnsElement = ({ data }) => {
    return (
      <div className="flex gap-3">
        <ActionBtn tooltip='Edit Unit' onClick={() => navigation(`/admin/unit/edit/${data?.id}`)} >
          <FiEdit size={15} className=" text-white" />
        </ActionBtn>
        <ActionBtn tooltip='Delete Unit' onClick={() => deleteUnit(`${data.id}`)}>
          <FiTrash size={15} className=" text-white" />
        </ActionBtn>
      </div>
    )
  }

  const onRefresh = () => {
    dispatch(clearUnits());
  };

  useEffect(() => {
    if (!allunit) {
      getAllUnit();
    }
  }, [allunit]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <h1 className="font-semibold md:text-lg">Manage Units</h1>
          <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} />
        </div>

        <div className="flex gap-3 items-center">

          <button
            onClick={() => navigation('/admin/unit/add')}
            type="button"
            className="text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-4 py-2"
          >
            Add Unit
          </button>
        </div>
      </div>

      <CustomTables.Table
        loading={loading}
        noDataMessage='No Unit Found ⚠️ '
        TABLE_HEADINGS={tableHeadings}
        DATA={allunit!=null?allunit: []}
        ROW_DATA={getRowData}
        ActionBtnsElement={ActionBtnsElement}
      />
    </div>
  );
};

export default AllUnit;
