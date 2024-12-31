import React, { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ServiceCategoriesModal from '../Modals/ServiceCategoriesModal';
import { useDispatch, useSelector } from 'react-redux';
import { setServices, deleteServicesSlice } from '../../../redux/ServicesSlice';
import { CustomBtn } from '../../../components';
import { FiEdit, FiRefreshCcw } from 'react-icons/fi';
import ActionBtn from '../../../components/shared/ActionBtn';
import CustomTables from '../../../components/shared/CustomTables';
import { errorToast } from '../../../utils';

const TABLE_HEADINGS = [
  'SN',
  'SR ID',
  'Client ID',
  'Service Category',
  'Created On',
  'Actions',
];

const AdminServices = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const activepage = 0;

  const allservices = useSelector((state) => state.services.services);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const toggleCategoryModal = () => setCategoryModal(!categoryModal);

  const getAllService = async () => {
    if (allservices?.[0]) {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`api/admin/all-service`);
      if (res.data.status === 200) {
        dispatch(
          setServices({
            pageno: 0,
            data: res.data.all_service,
          })
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  const deleteService = async (id) => {
    const con = window.confirm('Are you sure ?');

    if (!con) {
      return;
    }

    setDeleting(true);
    try {
      await axios.get(`api/admin/delete-service/${id}`).then((res) => {
        if (res.data.status === 200) {
          dispatch(deleteServicesSlice());
          setDeleting(false);

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
      setDeleting(false);
      errorToast(error)
    }
  };

  const onRefresh = () => {
    dispatch(deleteServicesSlice());
  };

  const getRowData = (data, index) => {
    if (!data) {
      return [];
    }
    return [index + 1, data?.service_type, data?.category_name, data?.service_head_1_name, `₹ ${data?.token_money}`]
  }

  const ActionBtnsElement = ({ data }) => {
    return (
      <div className="flex gap-3">
        <ActionBtn tooltip='Edit service' onClick={() => navigation(`/admin/services/editService/${data?.service_id}`)} >
          <FiEdit size={15} className=" text-white" />
        </ActionBtn>
        <ActionBtn loading={deleting &&
          currentSelection.id === data?.service_id} tooltip='Delete service' onClick={() => {
            setCurrentSelection({ id: data.service_id });
            deleteService(`${data.service_id}`);
          }} >
          <AiOutlineDelete
            size={15}
            className=" text-white"
          />
        </ActionBtn>
      </div>
    )
  }

  useEffect(() => {
    if (!allservices) {
      console.log('loaded service');
      getAllService();
    }
  }, [allservices]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <h1 className="font-semibold md:text-lg">All Services</h1>
          <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} />
        </div>

        <div className='flex items-center gap-3'>
          <CustomBtn onClick={toggleCategoryModal} >
            Manage Category
          </CustomBtn>
          <CustomBtn onClick={() => navigation('/admin/services/addService')} >
            Add Services
          </CustomBtn>
        </div>
      </div>

      <CustomTables.Table
        loading={loading}
        noDataMessage='No Services Found ⚠️'
        TABLE_HEADINGS={TABLE_HEADINGS}
        DATA={allservices?.[activepage]}
        ROW_DATA={getRowData}
        ActionBtnsElement={ActionBtnsElement}
      />

      {categoryModal && (
        <ServiceCategoriesModal toggleCategoryModal={toggleCategoryModal} />
      )}
    </div>
  );
};

export default AdminServices;
