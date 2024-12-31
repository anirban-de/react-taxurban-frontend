import { FiBell } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationModel from "../../Modals/NotificationModel";
import { useState } from "react";

const NotifcationButton = () => {
    const navigation = useNavigate();
    const notify = useSelector((state) => state.notify);
    const location = useLocation();

    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const toggleModal = () => setShowNotificationModal(!showNotificationModal);

    return (
        <div className="relative text-gray-400 p-2 rounded-md border border-gray-400">
            <FiBell
                className="cursor-pointer"
                onClick={toggleModal}
                size={20}
            />
            {notify.count > 0 && (
                <div className="absolute bg-green-400 w-5 h-5 text-white items-center justify-center flex rounded-full  -right-2 -bottom-3">
                    <span className=" text-xs">{notify.count}</span>
                </div>
            )}
            {showNotificationModal &&
                <NotificationModel toggleModal={toggleModal} />
            }
        </div>
    );
};

export default NotifcationButton;