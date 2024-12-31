import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicNavbar, DynamicSideBar } from '../../components';
import { FiGrid, FiUser, FiUsers } from 'react-icons/fi';

const LINKS = [
  {
    icon: <FiGrid size={20} />,
    name: 'service-request',
    route: '/department/service-request',
  },
  {
    name: 'staff',
    route: '/department/staff',
    icon: <FiUsers size={20} />,
  },
  {
    icon: <FiUser size={20} />,
    name: 'account',
    route: '/department/account',
  },
];

const DepartmentMain = () => {
  return (
    <div className="flex">
      <DynamicSideBar LINKS={LINKS} />
      <div className="flex flex-1 flex-col">
        <DynamicNavbar type="department" />
        <section className="p-5">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default DepartmentMain;
