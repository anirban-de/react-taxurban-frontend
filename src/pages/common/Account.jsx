import React, { useState } from 'react'
import UpdateProfileImage from '../../components/shared/Account/UpdateProfileImage'
import ChangePassword from '../../components/shared/Account/ChangePassword'
import { FiInfo, FiLock, FiPhoneCall, FiSettings, FiUser } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'
import AdminSettings from '../../components/shared/Account/AdminSettings'
import BranchDetails from '../../components/shared/Account/BranchDetails'
import Support from '../../components/shared/Account/Support'

const Account = () => {
    const location = useLocation()
    const userType = location.pathname.split('/')[1]

    const isProfileAllowed = userType === "admin" || userType === "customer" || userType === "branch";
    const isBranchDetailsAllowed = userType === "branch";
    const isSettingsAllowed = userType === "admin";

    const TABS_OPTIONS = [
        { ...(isProfileAllowed && { name: "profile", icon: <FiUser /> }) },
        { ...(isBranchDetailsAllowed && { name: "details", icon: <FiInfo /> }) },
        { name: "password", icon: <FiLock /> },
        // { name: "support", icon: <FiPhoneCall /> },
        { ...(isSettingsAllowed && { name: "settings", icon: <FiSettings /> }) }
    ]

    const TABS_VIEWS = {
        profile: <UpdateProfileImage />,
        password: <ChangePassword />,
        settings: <AdminSettings />,
        details: <BranchDetails />,
        support: <Support />
    }


    const [activeTab, setActiveTab] = useState(TABS_OPTIONS.filter(item => item?.name !== undefined)[0].name);

    return (
        <div >
            <h1 className="font-semibold md:text-lg mb-4">My Account</h1>
            <div className=" border-gray-200 dark:border-gray-700 bg-white">
                {TABS_OPTIONS.map((item, index) => {

                    if (!item.name) return null

                    return (
                        <button
                            onClick={() => setActiveTab(item.name)}
                            key={index}
                            className={` capitalize text-xs md:text-sm inline-flex p-4 items-center gap-2 rounded-t-lg border-b-2 border-transparent ${activeTab === item.name
                                ? 'text-blue-600 border-blue-600 border-b-2 border-b-blue-600'
                                : 'border-b-white border-b-2'
                                }`}
                        >
                            {item.icon}
                            {item.name === 'settings' ? 'Branch Settings' : item.name}
                        </button>
                    )
                })}
            </div>
            <hr />
            {TABS_VIEWS[activeTab]}
        </div>
    )
}

export default Account