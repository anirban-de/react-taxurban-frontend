import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicNavbar, DynamicSideBar } from '../../components';
import { FiGrid, FiHome, FiUser } from 'react-icons/fi';

const links = [
  {
    icon: <FiGrid size={20} />,
    name: 'service-request',
    route: '/staff/service-request',
  },
  {
    icon: <FiUser size={20} />,
    name: 'account',
    route: '/staff/account',
  },
];

const StaffMain = () => {
  return (
    <div className="flex">
      <DynamicSideBar LINKS={links} />
      <div className="flex flex-1 flex-col">
        <DynamicNavbar type="staff" />
        <section className="p-5">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default StaffMain;
