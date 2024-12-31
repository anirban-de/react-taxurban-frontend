import React from 'react'
import CustomInput from '../CustomInput'
import CustomBtn from '../CustomBtn'
import { FiMessageCircle, FiPhoneCall } from 'react-icons/fi'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { errorToast } from '../../../utils';

const Support = () => {
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const user = useSelector(state => state.auth);

    const ContactDetails = [
        {
            title: 'Call us +91-7086399233',
            link: 'tel:7086399233',
            icon: <FiPhoneCall />
        },
        {
            title: 'Call us +91-6909123836',
            link: 'tel:6909123836',
            icon: <FiPhoneCall />
        },
        {
            title: 'Chat with us',
            link: 'https://wa.me/+916909123836?text=Hi, I need Support',
            icon: <FiMessageCircle />
        }
    ]

    const onMessage = async () => {
        try {
            const data = {
                email: user.email,
                message,
            }
            const response = await axios.post('api/support-msg', data);

            if (response.status === 200) {
                toast.success('Team will contact you soon')
                setMessage('')
            }

        } catch (error) {
            errorToast(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='bg-white p-6 rounded-md'>
            <h1 className='mb-2 font-semibold text-sm'>Report a Issue</h1>
            <div className='flex gap-2 items-center'>
                <CustomInput value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your issue" />
                <CustomBtn loading={loading} onClick={onMessage} >Submit</CustomBtn>
            </div>

            <div>
                {ContactDetails.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 mt-4'>
                        <div className='bg-gray-200 p-2 rounded-full'>
                            {item.icon}
                        </div>
                        <a href={item.link} target='_blank' className='text-sm text-gray-600'>{item.title}</a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Support