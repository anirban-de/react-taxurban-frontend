import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetAuth, setAuth } from '../redux/AuthSlice';
import { errorToast, getAuthToken, secureLocalStorage, secureSessionStorage } from '../utils';
import Swal from 'sweetalert2';

const useCheckAuth = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigateToPage = (url) => {
    let remeber = secureLocalStorage.getItem('remember') || false;
    if (remeber) {
      secureLocalStorage.clear();
    } else {
      secureSessionStorage.clear();
    }
    dispatch(resetAuth());
    Swal.fire({
      title: 'Error!',
      text: 'Something went wrong',
      icon: 'error',
      timer: 2000,
    });
    navigate(url, { replace: true })
  }

  const checkAuthenticated = async () => {
    let token = getAuthToken();

    if (token === null || token === undefined) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('api/checking-Authenticated');
      if (res?.data?.status === 200) {
        let userData = {
          role: res.data.role,
          name: res.data.name,
          email: res.data.email,
        };

        if (res.data.role === 2) {
          userData.transaction_id = res.data.transaction_id;
        }

        dispatch(setAuth(userData));
      }
      setLoading(false);
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        navigateToPage('/login');
      } else {
        errorToast(error)
      }
    } finally {
      setLoading(false);
    }
  };

  axios.interceptors.response.use(
    undefined,
    function axiosRetryInterceptor(error) {
      if (error?.response?.status === 401) {
        navigateToPage('/login');
      }

      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error?.response?.status === 403) {
        navigateToPage('/login');
      } else if (error?.response?.status === 404) {
        navigateToPage('/login');
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    checkAuthenticated();
  }, []);

  return { loading };
};

export default useCheckAuth;
