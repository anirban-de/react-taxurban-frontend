import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DynamicSideBar = ({ LINKS = [], activeSubmenu, setActiveSubmenu }) => {
  const divRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClickOutside = (e) => {
    if (divRef.current && !divRef.current.contains(e.target)) {
      const sidebar = document.getElementById('txn-sidebar');
      if (!sidebar.classList.contains('hidden')) {
        sidebar.classList.toggle('hidden');
      }
    }
  };

  const navigateOnClick = (route) => {
    handleClickOutside({ target: document });
    navigate(route, { replace: true });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    divRef?.current?.addEventListener('mousedown', () => null);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      divRef?.current?.removeEventListener('mousedown', () => null);
    };
  }, []);

  const SidebarItems = (props) => {
    
    const location = useLocation();
    // Check if the current item or its submenu is active based on the route
    const locationSplit = location.pathname.split('/');
    const isActive = locationSplit[2] == props.name.trim().toLowerCase();
    //console.log(location.pathname, props.name.trim().toLowerCase());
    const hasActiveSubmenu = props.submenu && props.submenu.some(sub => location.pathname.includes(sub.route));
    const [submenuVisible, setSubmenuVisible] = useState(activeSubmenu === props.name || hasActiveSubmenu);

    const toggleSubmenu = () => {
      setSubmenuVisible(!submenuVisible);
      // Set active submenu to keep it open after load
      if (!submenuVisible) {
        setActiveSubmenu(props.name);
      } else {
        setActiveSubmenu(null);
      }
    };

    return (
      <div>
        <div
          onClick={() => {
            if (props.submenu && props.submenu.length > 0) {
              toggleSubmenu();
            } else {
              navigateOnClick(props.route);
            }
          }}
          style={props.style ? props.style : {}}
          className={`flex items-center px-3 py-2 text-base cursor-pointer font-normal rounded-lg border-2 ${isActive
            ? 'bg-green-400 text-white border-green-400 font-semibold'
            : 'hover:bg-gray-100 hover:border-gray-200'
            } border-gray-100`}
        >
          {props.icon}
          <span className="ml-3 capitalize text-xs md:text-sm">
            {props.name.split('-').join(' ')}
          </span>
          {props.submenu && props.submenu.length > 0 && (
            <span className="ml-auto">{submenuVisible ? '▲' : '▼'}</span>
          )}
        </div>
        {submenuVisible && props.submenu && props.submenu.length > 0 && (
          <div className="pl-4">
            {props.submenu.map((subItem, index) => (
              <div
                key={index}
                onClick={() => navigateOnClick(subItem.route)}
                className={`flex items-center px-3 py-2 text-sm cursor-pointer font-normal rounded-lg border-2 ${location.pathname.includes(subItem.route)
                  ? 'bg-green-400 text-white border-green-400 font-semibold'
                  : 'hover:bg-gray-100 hover:border-gray-200'
                  } border-gray-100`}
              >
                <span className="ml-3 capitalize">
                  {subItem.name.split('-').join(' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      ref={divRef}
      id="txn-sidebar"
      className="w-56 md:sticky absolute hidden md:block lg:z-0 top-0 bottom-0 left-0 z-20 h-screen max-h-screen bg-white px-3 border"
      aria-label="Sidebar"
    >
      <div className="px-2 pt-5 pb-2">
        <img src='https://taxurbanmis.s3.ap-south-1.amazonaws.com/assets/taxurban+logo.png' alt="logo" width={150} />
      </div>
      <div className="overflow-y-auto py-4 px-0 rounded">
        <div className="space-y-3">
          {LINKS?.map((link, index) => {
            return <SidebarItems {...link} key={index} />;
          })}
        </div>
      </div>
    </aside>
  );
};

export default DynamicSideBar;