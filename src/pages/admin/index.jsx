import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DynamicNavbar, DynamicSideBar } from '../../components';
import { FiGrid, FiBox, FiUser, FiUserPlus, FiBell, FiDownload } from 'react-icons/fi';
import {
  HiOutlineOfficeBuilding,
  HiOutlineCurrencyRupee,
} from 'react-icons/hi';
import { BsWallet2 } from 'react-icons/bs';
import NotificationHandler from '../../components/shared/Notification/NotificationHandler';

const LINKS = [
  {
    icon: <FiGrid size={20} />,
    name: 'service-request',
    route: '/admin/service-request'
  },
  {
    icon: <FiBox size={20} />,
    name: 'services',
    route: '/admin/services',
  },
  {
    icon: <FiDownload size={20} />,
    name: 'reports',
    submenu: [
      {
        icon: <FiGrid size={20} />,
        name: 'sr-status',
        route: '/admin/sr-report',
      },
      {
        icon: <FiGrid size={20} />,
        name: 'voucher-and-invoice',
        route: '/admin/invoice-report',
      },
      {
        icon: <FiGrid size={20} />,
        name: 'branch-received-voucher',
        route: '/admin/branch-received-voucher',
      },
      // {
      //   icon: <FiGrid size={20} />,
      //   name: 'branch-list',
      //   route: '/admin/branch-list',
      // }
    ]
  },
  {
    icon: <FiUser size={20} />,
    name: 'customer',
    route: '/admin/customer',
  },
  {
    icon: <HiOutlineOfficeBuilding size={20} />,
    name: ' branch',
    route: '/admin/branch',
  },
  {
    icon: <FiUserPlus size={20} />,
    name: 'office-management',
    route: '/admin/office-management',
  },
  {
    icon: <BsWallet2 size={20} />,
    name: 'wallet',
    route: '/admin/wallet',
  },
  {
    icon: <HiOutlineCurrencyRupee size={20} />,
    name: 'commission',
    route: '/admin/commission',
  },
  {
    icon: <HiOutlineCurrencyRupee size={20} />,
    name: 'unit',
    route: '/admin/unit',
  },
  {
    icon: <FiUser size={20} />,
    name: 'account',
    route: '/admin/account',
  },
  {
    icon: <FiUser size={20} />,
    name: 'gst-package',
    route: '/admin/gst-package',
    style: {
      color: '#ff0000',  // Red color for text
      fontWeight: 'bold', // Bold font
      fontSize: '16px'    // Larger font size
    }
  }
];



const AdminMain = () => {
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  // Check if current route is inside any submenu
  useEffect(() => {
    const matchedSubmenu = LINKS.find(link => 
      link.submenu && link.submenu.some(sub => sub.route === location.pathname)
    );
    if (matchedSubmenu) {
      setActiveSubmenu(matchedSubmenu.name);
    }
  }, [location.pathname]);
  return (
    <div className="flex overflow-hidden h-screen">
      <DynamicSideBar LINKS={LINKS} activeSubmenu={activeSubmenu} setActiveSubmenu={setActiveSubmenu} />
      <div className="flex flex-1 overflow-scroll flex-col">
        <DynamicNavbar
          type="admin"
        />
        <section className="p-5">
          <Outlet />
        </section>
      </div>
      <NotificationHandler />
    </div>
  );
};

export default AdminMain;
