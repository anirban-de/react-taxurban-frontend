import { HashRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { APP_BASE_URL } from './config';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotifications } from './redux/notificationSlice';
import { errorToast, getAuthToken } from './utils';
import loadable from '@loadable/component';

const MainRoutes = loadable(() => import('./MainRoutes'));

axios.defaults.baseURL = APP_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(async function (config) {
  let token = getAuthToken();
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.code === "ERR_NETWORK") {
      errorToast("Network Error")
    }
    return Promise.reject(error);
  }
);


function App() {
  const dispatch = useDispatch();

  let getBrowserCache = async () => {
    let cache = await caches.open('notification-cache');
    const response = await cache.match('/notification');

    if (response) {
      const data = await response.json();
      let audio = new Audio(
        'https://upload.wikimedia.org/wikipedia/commons/3/34/Sound_Effect_-_Door_Bell.ogg'
      );
      audio.autoplay = true;
      audio?.play();
      if (data) {
        dispatch(addNotifications(data));
        caches.delete('notification-cache');
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      getBrowserCache();
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);


  return (
    <Router>
      <MainRoutes />
    </Router>
  );
}

export default App;
