const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID =
  process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = process.env.REACT_APP_FIREBASE_APP_ID;
const FIREBASE_MEASUREMENT_ID = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;
const FIREBASE_VAID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;
const APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const ENV = process.env.REACT_APP_ENV;
const LOCAL_STORAGE_KEY = process.env.REACT_APP_LOCAL_STORAGE_KEY;
const SESSION_STORAGE_KEY = process.env.REACT_APP_SESSION_STORAGE_KEY;

const isDev = ENV === 'dev' ? true : false;

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

export const ROUTES = {
  1: '/admin',
  2: '/branch',
  3: '/customer',
  4: '/department',
  5: '/staff',
  6: '/verificationteam',
};

export {
  FIREBASE_VAID_KEY,
  APP_BASE_URL,
  isDev,
  SESSION_STORAGE_KEY,
  LOCAL_STORAGE_KEY
};
