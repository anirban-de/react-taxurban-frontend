import { AsyncEncryptStorage, EncryptStorage } from 'encrypt-storage';
import { LOCAL_STORAGE_KEY, SESSION_STORAGE_KEY } from "../config";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
export const secureLocalStorage = new EncryptStorage(LOCAL_STORAGE_KEY, {
  prefix: 'local_storage_prefix',
  storageType: 'localStorage',
  stateManagementUse: true,
});

export const secureSessionStorage = new EncryptStorage(SESSION_STORAGE_KEY, {
  prefix: 'session_storage_prefix',
  storageType: 'sessionStorage'
});

export const SecureAsyncLocalStorage = new AsyncEncryptStorage(LOCAL_STORAGE_KEY, {
  prefix: 'local_storage_prefix',
  storageType: 'localStorage',
  stateManagementUse: false,
});

export const getAuthToken = () => {
  let remeber = secureLocalStorage.getItem('remember') || false;
  let token = null;
  if (remeber) {
    token = secureLocalStorage.getItem('auth_token');
  } else {
    token = secureSessionStorage.getItem('auth_token');
  }
  return token;
};

export const errorToast = (error) => {
  toast.error(error || error?.response?.data?.message || error?.message || 'Something went wrong')
}

export const successToast = (message) => {
  toast.success(message || 'Successfully Completed');
}

export const Swalwait = () => {
  Swal.fire({
    icon: 'info',
    title: 'Please wait...',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}