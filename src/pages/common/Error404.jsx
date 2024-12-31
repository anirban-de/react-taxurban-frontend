import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FiHome, FiRefreshCcw } from 'react-icons/fi';

const Error404 = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/', { replace: true })
    }

    const reloadPage = () => {
        window.location.reload();
    }

    return (
        <div className='flex flex-1 flex-col gap-3 justify-center items-center h-screen'>
            <h1>404 Not Found</h1>
            <div className='flex items-center gap-3'>
                <button onClick={goHome} className='inline-flex items-center gap-2 hover:text-green-500 '><FiHome /> Go to Home</button>
                <button onClick={reloadPage} className='inline-flex items-center gap-2 hover:text-green-500'><FiRefreshCcw /> Reload Page</button>
            </div>
        </div>
    )
}

export default Error404