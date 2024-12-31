import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    clearNotificationCount,
    clearNotifications,
} from '../../redux/notificationSlice';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const NotificationModel = ({ toggleModal }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notify = useSelector((state) => state.notify.notifcations);

    console.log(notify);

    useEffect(() => {
        dispatch(clearNotificationCount());
    }, []);


    return (
        <div className="fixed w-1/4 text-black p-5 border-l-2  z-40 right-0 top-0 bottom-0 overflow-auto bg-white flex flex-col  ">
            <div className="flex mb-4 items-center gap-2 justify-between ">
                <p className='font-semibold text-base' >Notifications</p>
                <FiX size={20} onClick={toggleModal} className='cursor-pointer' />
            </div>

            <div className="bg-white rounded-md ">
                {notify.length === 0 && <h1>No Notification found ⚠️</h1>}

                {notify.length > 0 && (
                    <div>
                        {notify?.map((item, index) => (
                            <div key={index} className='border p-3 flex flex-col gap-2' >
                                <div>
                                    <p className='text-sm md:text-base capitalize font-medium' >{item.notification.title}</p>
                                    <p className=' text-xs md:text-sm ' >{item.notification.body}</p>
                                </div>
                                <p className=' text-xs text-gray-500 ' > 🗓️ {moment(item.timestamp).format('MMMM Do YYYY')} - ⏰ {moment(item.timestamp).format('h:mm a')}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div onClick={() => dispatch(clearNotifications())} className='w-8 h-8 rounded-full bg-green-400 hover:bg-green-500 flex items-center justify-center absolute bottom-5 right-5'>
                    <FiX className='text-white' />
                </div>

            </div>
        </div>
    )
}

export default NotificationModel