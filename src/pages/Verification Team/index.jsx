import React from 'react';
import { Outlet } from 'react-router-dom';
import { DynamicNavbar, DynamicSideBar } from '../../components';
import { FiGrid, FiUser } from 'react-icons/fi';

const LINKS = [
  {
    icon: <FiGrid size={20} />,
    name: 'service-request',
    route: '/verificationteam/service-request',
  },
  {
    icon: <FiUser size={20} />,
    name: 'account',
    route: '/verificationteam/account',
  },
];

const VerificationTeamMain = () => {
  return (
    <div className="flex">
      <DynamicSideBar LINKS={LINKS} />
      <div className="flex flex-1 flex-col">
        <DynamicNavbar type="verificationteam" />
        <section className="p-5">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default VerificationTeamMain;
