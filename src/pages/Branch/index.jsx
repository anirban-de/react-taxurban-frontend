import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicNavbar, DynamicSideBar } from '../../components';
import { FiGrid, FiUser, FiUsers } from 'react-icons/fi';
import { BsWallet2 } from 'react-icons/bs';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import NotificationHandler from '../../components/shared/Notification/NotificationHandler';

const links = [
  {
    icon: <FiGrid size={20} />,
    name: 'service-request',
    route: '/branch/service-request',
  },
  {
    icon: <FiUsers size={20} />,
    name: 'customer',
    route: '/branch/customer',
  },
  {
    icon: <BsWallet2 size={20} />,
    name: 'wallet',
    route: '/branch/wallet',
  },
  {
    icon: <HiOutlineCurrencyRupee size={20} />,
    name: 'commission',
    route: '/branch/commission',
  },
  {
    icon: <FiUser size={20} />,
    name: 'account',
    route: '/branch/account',
  },
  {
    icon: <FiUser size={20} />,
    name: 'gst-package',
    route: '/branch/gst-package',
    style: {
      color: '#ff0000',  // Red color for text
      fontWeight: 'bold', // Bold font
      fontSize: '16px'    // Larger font size
    }
  }
];

const BranchMain = () => {
  return (
    <div className="md:flex">
      <DynamicSideBar LINKS={links} />
      <div className="flex flex-1 flex-col">
        <DynamicNavbar type="branch" />
        <section className="flex-1 p-5">
          <Outlet />
        </section>
      </div>
      <NotificationHandler />
    </div>
  );
};

export default BranchMain;
