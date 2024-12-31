import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CustomBtn } from '../../components';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [loginInput, setLoginInput] = useState({
    email: '',
  });

  const handleInput = (e) => {
    e.persist();
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    setLoginInput({ ...loginInput, error: [] });

    const data = {
      email: loginInput.email,
    };

    setLoading(true);
    axios.get('/sanctum/csrf-cookie').then((response) => {
      axios.post(`api/forgot-password`, data).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
            timerProgressBar: true,
          });

          setLoginInput({
            email: '',
            error: '',
          });
        } else {
          setLoginInput({
            ...loginInput,
            error: res.data.validation_error,
          });
        }
      });
      setLoading(false);
    });
  };

  useEffect(() => { }, []);

  return (
    <div>
      {/* navbar  */}
      <nav className="bg-white flex items-center" style={{ height: '10vh' }}>
        <div className="md:container mx-auto flex justify-between">
          <div className="flex items-center">
            <img src='https://taxurbanmis.s3.ap-south-1.amazonaws.com/assets/taxurban+logo.png' alt="logo" width={150} />
          </div>
          <div className="flex justify-between">
            <div>
              <Link
                to={'/branch-register'}
                className="hidden md:block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Become a Partner
              </Link>
            </div>
            <div className="ml-5">
              <Link
                to={'/customer-register'}
                className="hidden md:block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Become a Customer
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* main area  */}
      <main
        className="flex justify-center items-center"
        style={{ height: '90vh' }}
      >
        <div className="bg-white md:w-96 w-11/12 rounded-md p-8">
          <h1 className="text-2xl font-bold text-gray-700">
            Welcome to TaxUrban
          </h1>
          <h2 className="text-sm md:text-base font-semibold text-gray-600 ">
            Manage your <span className="text-green-500">taxes</span> like a{' '}
            <span className="text-green-500">PRO</span>
          </h2>
          <p className="my-4 text-gray-500 text-justify">Enter your Email ID</p>

          {/* form here  */}
          <form className="mt-5" onSubmit={submitForm}>
            <div className="relative mb-4">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <FiUser />
              </div>
              <input
                type="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                placeholder="Email"
                name="email"
                onChange={handleInput}
                value={loginInput.email}
              />
              <small className="text-red-500">{loginInput.error}</small>
            </div>
            <CustomBtn type="submit" loading={loading}>
              Submit
            </CustomBtn>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
