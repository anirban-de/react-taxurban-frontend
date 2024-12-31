import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const root = ReactDOM.createRoot(document.getElementById('root'));

const queryClient = new QueryClient()

const toastConfig = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <div className='max-h-screen max-w-screen'>
          <App />
          <ToastContainer {...toastConfig} />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </div>
      </PersistGate>
    </Provider>
  </QueryClientProvider>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js').then(() => {
      if (!('PushManager' in window)) {
        console.log('Push messaging isn\'t supported.');
        return;
      }
      if (Notification.permission === 'denied') {
        console.log('The user has blocked notifications.');
        return;
      }
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}
