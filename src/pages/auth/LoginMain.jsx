import axios from 'axios';
import React, { useState } from 'react';
import { FiUser, FiLock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CustomBtn, CustomInput } from '../../components';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/AuthSlice';
import { ROUTES } from '../../config';
import { errorToast, secureLocalStorage, secureSessionStorage } from '../../utils';
import { SR_MODES } from '../../utils/config';
import { toast } from 'react-toastify';


const LoginMain = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(
    secureLocalStorage.getItem('remember') || true
  );
  const navigation = useNavigate();

  const [loginInput, setLoginInput] = useState({
    email: '',
    password: '',
    error_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setLoginInput({ ...loginInput, error_list: [] });

    try {
      const data = {
        email: loginInput.email,
        password: loginInput.password,
      };

      setLoading(true);
      await axios.post(`api/login`, data).then((res) => {
        if (res.data.status === 200) {
          secureLocalStorage.setItem('remember', JSON.stringify(remember));

          if (remember) {
            secureLocalStorage.setItem('auth_token', res.data.token);
          } else {
            secureSessionStorage.setItem('auth_token', res.data.token);
          }

          let userData = {
            role: res.data.role,
            name: res.data.name,
            email: res.data.username,
          };

          if (res.data.role === 2) {
            userData.transaction_id = res.data.transaction_id;
          }

          dispatch(setAuth(userData));

          if (
            (res.data.role === 2 && res.data.transaction_id === 'n_a') ||
            res.data.transaction_id === null
          ) {
            navigation('/branch/activation');
          } else {
            navigation(`${ROUTES[res.data.role]}/service-request/${SR_MODES[0]}/1`);
          }
        } else if (res.data.status === 404) {
          Swal.fire({
            title: 'Unauthorized!',
            text: res.data.message,
            icon: 'warning',
            confirmButtonText: 'Ok',
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (res.data.status === 401) {
          Swal.fire({
            title: 'Warning!',
            text: res.data.message,
            icon: 'warning',
            confirmButtonText: 'Ok',
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          setLoginInput({
            ...loginInput,
            error_list: res.data.validation_errors,
          });
        }
      });
    } catch (error) {
      errorToast(error);
    } finally {
      setLoading(false);
    }
  };

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
          <p className="my-4 text-gray-500 leading-7">
            We provide you a wide range of services for all the business needs.
            Get our services on a few clicks or steps from any location.
          </p>

          {/* form here  */}
          <form className="mt-5" onSubmit={submitForm}>
            <div className="relative mb-4">
              <CustomInput
                icon={<FiUser />}
                errorMsg={loginInput.error_list?.email}
                type="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                placeholder="Email"
                name="email"
                onChange={handleInput}
                value={loginInput.email}
              />
            </div>
            <div className="relative mb-4">
              <CustomInput
                icon={<FiLock />}
                errorMsg={loginInput.error_list?.password}
                type="password"
                id="input-group-2"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                placeholder="Password"
                name="password"
                onChange={handleInput}
                value={loginInput.password}
              />
            </div>
            <div className="flex justify-between items-start my-4">
              <div className="flex gap-2 items-center ">
                <input
                  className="outline-none text-green-400 rounded-md"
                  type="checkbox"
                  checked={remember}
                  value={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="text-sm">Remeber Me </span>
              </div>
              <Link
                to="/forgot-password"
                className="cursor-pointer text-xs md:text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Forgot Password ?
              </Link>
            </div>
            <CustomBtn type="submit" loading={loading}>
              Login
            </CustomBtn>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginMain;
