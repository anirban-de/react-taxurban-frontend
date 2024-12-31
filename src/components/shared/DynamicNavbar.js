import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteAccountSlice,
  setPhoto,
} from '../../redux/AccountSlice';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { deleteBranchSlice } from '../../redux/BranchesSlice';
import { deleteClientSlice } from '../../redux/ClientSlice';
import { deleteCustomer } from '../../redux/CustomerSlice';
import { deleteOfficeSlice } from '../../redux/OfficeSlice';
import { deleteServiceRequestSlide } from '../../redux/ServiceRequestSlice';
import { deleteServicesSlice } from '../../redux/ServicesSlice';
import { deleteWalletSlice } from '../../redux/WalletSlice';
import { resetAuth } from '../../redux/AuthSlice';
import { secureSessionStorage, secureLocalStorage, errorToast, Swalwait } from '../../utils';
import { useQueryClient } from '@tanstack/react-query';
import NotifcationButton from './Notification/NotificationBtn';

const DynamicNavbar = ({ type, dyamicRightSideComponents }) => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const auth = useSelector((state) => state?.auth);
  const photo = useSelector((state) => state?.account?.photo);
  const queryClient = useQueryClient();

  const CONFIG = {
    admin: {
      urlname: 'admin',
      property: 'setting',
      loadSettings: true,
      name: 'Super Admin',
    },
    customer: {
      urlname: 'customer',
      property: 'customer',
      loadSettings: true,
      name: 'customer',
    },
    branch: {
      urlname: 'branch',
      property: 'branch',
      loadSettings: true,
      name: 'branch',
    },
    department: {
      loadSettings: false,
      name: 'Department Head',
    },
    staff: {
      loadSettings: false,
      name: 'Staff',
    },
    verificationteam: {
      loadSettings: false,
      name: 'Verification Team',
    },
  };

  const getSettings = async () => {
    try {
      await axios.get(`api/${CONFIG[type].urlname}/account`).then((res) => {
        if (res.data.status === 200) {
          let property = CONFIG[type].property;
          dispatch(setPhoto(res?.data?.[property]?.photo));
        }
      });
    } catch (error) {
      errorToast(error);
    }
  };

  const logout = () => {
    Swalwait();

    axios.post(`api/logout`).then((res) => {
      if (res.data.status === 200) {
        secureLocalStorage.clear();
        secureSessionStorage.clear();
        dispatch(resetAuth());
        dispatch(deleteBranchSlice());
        dispatch(deleteClientSlice());
        dispatch(deleteCustomer());
        dispatch(deleteOfficeSlice());
        dispatch(deleteServiceRequestSlide());
        dispatch(deleteServicesSlice());
        dispatch(deleteWalletSlice());
        dispatch(deleteAccountSlice());
        queryClient.clear();

        Swal.fire({
          title: 'Success!',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
          timer: 3000,
        });

        navigation('/login', { replace: true });
      }
    });
  };

  const ToggleSidebar = () => {
    const sidebar = document.getElementById('txn-sidebar');
    sidebar.classList.toggle('hidden');
  }

  useEffect(() => {
    if (!photo && CONFIG[type].loadSettings) {
      getSettings();
    }
  }, []);

  return (
    <nav className="bg-white  px-5 py-4 sticky top-0 z-10  border-b-2 flex justify-between ">
      <div className='flex items-center gap-3'>
        <FiMenu className='md:hidden' onClick={ToggleSidebar} />
        <div>
          <h1 className="font-semibold  text-xs md:text-lg mb-1 capitalize">
            Welcome , {auth?.name?.split(' ')?.[0]} 👋
          </h1>
          <p className="text-gray-700  text-xs md:text-sm capitalize">
            Taxurban {CONFIG[type].name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 ">
        <div className="flex items-center">
          {photo === null ? (
            <div className="bg-green-400 h-9 w-9 rounded-full flex justify-center items-center ">
              <span className="font-semibold text-white">
                {auth?.name?.split(' ')?.[0]?.[0]}
              </span>
            </div>
          ) : (
            <img
              src={photo}
              className="h-8 md:h-10  w-8 md:w-10 rounded-full flex justify-center items-center "
            />
          )}
          <div className="ml-3 flex flex-col gap-0">
            <h1 className=" text-xs md:text-sm font-medium capitalize ">{auth?.name}</h1>
            <span
              onClick={logout}
              className=" text-xs md:text-sm inline-flex items-center gap-2 cursor-pointer  text-red-500"
            >
              Logout <FiLogOut />
            </span>
          </div>
        </div>

        <NotifcationButton />

        {dyamicRightSideComponents}
      </div>
    </nav>
  );
};

export default DynamicNavbar;
