import { initializeApp } from 'firebase/app';
import { getToken } from 'firebase/messaging';
import { getMessaging } from 'firebase/messaging/sw';
import axios from 'axios';
import { FIREBASE_VAID_KEY, firebaseConfig } from '../config';

initializeApp(firebaseConfig);
export const messaging = getMessaging();

export const notificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const currentToken = await getToken(messaging, {
      vapidKey: FIREBASE_VAID_KEY,
    });

    if (currentToken) {
      const res = await axios.post('api/notification-update', {
        web_notify_token: currentToken,
      });

      if (res.data.status !== 200) {
        console.log('token not updated');
      }
    } else {
      console.log('Failed to generate the app registration token.');
    }
  } else {
    console.log('User Permission Denied.');
  }
};
