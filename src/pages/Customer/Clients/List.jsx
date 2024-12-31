import React from 'react';
import { TbEdit } from 'react-icons/tb';
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CustomBtn } from '../../../components';
import { FiRefreshCcw } from 'react-icons/fi';
import loadable from '@loadable/component';
import CustomTables from '../../../components/shared/CustomTables';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { errorToast } from '../../../utils';

const ActionBtn = loadable(() => import('../../../components/shared/ActionBtn'));

const TABLE_HEADINGS = ['SN', 'User Name', 'User Type', 'User ID', 'Actions'];

const List = () => {
  const navigation = useNavigate();

  const getClients = async () => {
    const response = await axios.get(`api/customer/get-all-client`)
    return response.data;
  }

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    staleTime: 10 * 1000
  })

  const deleteClient = async (id) => {
    const con = window.confirm('Are you sure ?');

    if (!con) {
      return;
    }

    try {
      await axios.get(`api/customer/delete-client/${id}`).then((res) => {
        if (res.data.status === 200) {
          refetch();
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
      errorToast(error?.response?.data?.message || error?.message || 'Something went wrong')
    }
  };


  const ActionBtnsElement = ({ data }) => {
    return (
      <div className="flex gap-3 items-center">
        <ActionBtn tooltip='Edit User' onClick={() => navigation(`/customer/clients/edit/${data?.id}`)}>
          <TbEdit size={15} className=" text-white" />
        </ActionBtn>
        {/* delete action btn  */}
        <ActionBtn tooltip='Delete User' onClick={() => deleteClient(`${data.id}`)}>
          <AiOutlineDelete size={15} className=" text-white" />
        </ActionBtn>
      </div>
    )
  }

  const onRefresh = () => {
    refetch();
  };

  const getRowData = (data, index) => {
    if (!data) {
      return [];
    }
    return [index + 1, data.name, data.client_type, data.client_id]
  }

  if (error) {
    errorToast(error.message)
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <h1 className="font-semibold md:text-lg">All Clients</h1>
          <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} />
        </div>
        <div>
          <CustomBtn onClick={() => navigation('/customer/clients/add')} >Add User</CustomBtn>
        </div>
      </div>

      <CustomTables.Table
        DATA={data?.client}
        loading={isLoading}
        ROW_DATA={getRowData}
        TABLE_HEADINGS={TABLE_HEADINGS}
        ActionBtnsElement={ActionBtnsElement}
      />

    </div>
  );
};

export default List;
