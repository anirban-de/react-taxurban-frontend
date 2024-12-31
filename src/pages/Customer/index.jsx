import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicSideBar, DynamicNavbar } from '../../components';
import { FiGrid, FiUser, FiUsers } from 'react-icons/fi';
import NotificationHandler from '../../components/shared/Notification/NotificationHandler';

const links = [
  {
    icon: <FiGrid size={15} />,
    name: 'service-request',
    route: '/customer/service-request',
  },
  {
    icon: <FiUsers size={15} />,
    name: 'clients',
    route: '/customer/clients',
  },
  {
    icon: <FiUser size={15} />,
    name: 'account',
    route: '/customer/account',
  },
  {
    icon: <FiUser size={20} />,
    name: 'gst-package',
    route: '/customer/gst-package',
    style: {
      color: '#ff0000',  // Red color for text
      fontWeight: 'bold', // Bold font
      fontSize: '16px'    // Larger font size
    }
  }
];

const CustomerMain = () => {
  return (
    <div className='md:flex'>
      <DynamicSideBar LINKS={links} />
      <div className="flex flex-1 flex-col">
        <DynamicNavbar type="customer" />
        <section className='flex-1 p-5'>
          <Outlet />
        </section>
      </div>
      <NotificationHandler />
    </div>
  );
};

export default CustomerMain;
