importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyCW3O7xfn3thTKvY8qJKcZw85nVMhYUpsI',
  authDomain: 'taxurban-web.firebaseapp.com',
  projectId: 'taxurban-web',
  storageBucket: 'taxurban-web.appspot.com',
  messagingSenderId: '61433881651',
  appId: '1:61433881651:web:d1d116e1195ecd3aafef46',
  measurementId: 'G-M7DTJGZR9Z',
});

let messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.png',
    timestamp: Math.floor(Date.now()),
    data: {
      ...payload.data,
    },
  };

  const cacheName = 'notification-cache';
  const dataKey = 'notification';

  caches.open(cacheName).then(async (cache) => {
    try {
      // Retrieve existing data from the cache
      const cachedResponse = await cache.match(dataKey);
      const cachedData = cachedResponse ? await cachedResponse.json() : [];

      // Add the new data to the existing array
      const updatedData = [
        ...cachedData,
        { ...payload, timestamp: new Date() },
      ];

      // Store the updated array in the cache
      await cache.put(dataKey, new Response(JSON.stringify(updatedData)));
    } catch (error) {
      console.error('Error storing data in cache:', error);
    }
  });

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  const urlToOpen = event.notification?.data?.screen || '/';
  event.waitUntil(clients.openWindow(urlToOpen));
  event.notification.close();
});
