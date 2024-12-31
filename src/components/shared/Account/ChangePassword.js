import axios from 'axios';
import React, { useState } from 'react'
import CustomInput from '../CustomInput';
import Swal from 'sweetalert2';
import { errorToast } from '../../../utils';

const ChangePassword = () => {
    const [userpassword, setUserPassword] = useState({
        current_password: '',
        password: '',
        confirm_password: '',
    });
    const [error, setError] = useState([]);

    const updateUserPassword = async (e) => {
        const { name, value } = e.target;
        setUserPassword({ ...userpassword, [name]: value });
    };

    const submitPassword = async () => {
        setError([]);
        const data = {
            current_password: userpassword.current_password,
            password: userpassword.password,
            confirm_password: userpassword.confirm_password,
        };
        try {
            const res = await axios.post(`api/update-password`, data)
            if (res.data.status === 200) {
                setUserPassword({
                    current_password: '',
                    password: '',
                    confirm_password: '',
                });
                Swal.fire({
                    title: 'Success!',
                    text: res.data.message,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    timer: 3000,
                });
            } else if (res.data.status === 400) {
                setError(res.data.validation_errors);
            }
        } catch (error) {
            errorToast(error)
        }
    };

    return (
        <div className="bg-white p-6 rounded-md mb-5">
            <div className="flex flex-1 flex-col md:flex-row justify-start items-end gap-3 ">
                <CustomInput
                    placeholder={`Current Password`}
                    label={`Current Password`}
                    value={userpassword.current_password}
                    name="current_password"
                    type="password"
                    errorMsg={error?.current_password}
                    onChange={updateUserPassword}
                />
                <CustomInput
                    placeholder={`New Password`}
                    label={`New Password`}
                    value={userpassword.password}
                    name="password"
                    type="password"
                    errorMsg={error?.password}
                    onChange={updateUserPassword}
                />
                <CustomInput
                    placeholder={`Retype New Password`}
                    label={`Retype New Password`}
                    value={userpassword.confirm_password}
                    name="confirm_password"
                    type="password"
                    errorMsg={error?.confirm_password}
                    onChange={updateUserPassword}
                />
                <button
                    type="button"
                    onClick={submitPassword}
                    className=" text-white w-fit bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2  dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                >
                    Update
                </button>
            </div>
        </div>
    );
}

export default ChangePassword