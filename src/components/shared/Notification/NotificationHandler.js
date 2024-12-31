import { useEffect } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import { notificationPermission } from '../../../utils/firebase';
import { useDispatch } from 'react-redux';
import { addNotifications } from '../../../redux/notificationSlice';

const NotificationHandler = () => {
  const messaging = getMessaging();
  const dispatch = useDispatch();

  const handleNotification = (payload) => {
    dispatch(addNotifications([{ ...payload, timestamp: new Date() }]));
  };

  useEffect(() => {
    notificationPermission().then(() => {
      if (Notification.permission === 'granted') {
        const unsubscribe = onMessage(messaging, (payload) => {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
          });
          handleNotification(payload);
          let audio = new Audio(
            'https://upload.wikimedia.org/wikipedia/commons/3/34/Sound_Effect_-_Door_Bell.ogg'
          );
          audio.autoplay = true;
          audio?.play();
        });

        return () => unsubscribe;
      }
    });
  }, []);

  return null;
};

export default NotificationHandler;
