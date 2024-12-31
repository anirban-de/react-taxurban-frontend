import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCache } from '../redux/cacheSlice';
import axios from 'axios';
import { errorToast, getAuthToken } from '../utils';

const useFetch = ({ uid, url, method = 'GET', body, onMount = true }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const cache = useSelector((state) => state.cache);

  const getData = async () => {
    if (cache?.[uid]?.hasOwnProperty(url)) {
      setLoading(false);
      setData(cache[uid][url]);
      return;
    }

    setLoading(true);

    let headers = {
      'Content-Type': 'application/json',
      withCredentials: true,
    };

    let token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await axios(url, {
        headers,
        method,
        data: body,
      });

      if (res?.data?.status !== 200) {
        throw new Error(res?.data?.message);
      }

      setData(res?.data);
      dispatch(addCache({ uid: uid, url: url, data: res?.data }));
    } catch (error) {
      errorToast(error);
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
  };

  useEffect(() => {
    if (data === null && onMount) {
      getData();
    }
  }, [data]);

  return { data, loading, getData, clearData };
};

export default useFetch;
