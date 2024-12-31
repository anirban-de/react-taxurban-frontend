import {
  configureStore,
  combineReducers,
} from '@reduxjs/toolkit';
import BranchSlice from './BranchesSlice';
import ServiceRequestSlice from './ServiceRequestSlice';
import ServicesSlice from './ServicesSlice';
import OfficeSlice from './OfficeSlice';
import WalletSlice from './WalletSlice';
import CustomerSlice from './CustomerSlice';
import ClientSlice from './ClientSlice';
import ClientIDSlice from './ClientIDSlice';
import SettingsSlice from './SettingsSlice';
import AccountSlice from './AccountSlice';
import NotificationSlice from './notificationSlice';
import cacheSlice from './cacheSlice';
import AuthSlice from './AuthSlice';
import SrReportSlice from './SrReportSlice';
import InvoiceReportSlice from './InvoiceReportSlice';
import BranchReportSlice from './BranchReportSlice';
import GstPackageSlice from './GstPackageSlice';
import UnitSlice from './UnitSlice';

import { persistReducer, persistStore } from 'redux-persist';
import { SecureAsyncLocalStorage } from '../utils';
import { isDev } from '../config';

const rootReducer = combineReducers({
  braches: BranchSlice,
  serviceRequests: ServiceRequestSlice,
  services: ServicesSlice,
  office: OfficeSlice,
  wallet: WalletSlice,
  customer: CustomerSlice,
  clients: ClientSlice,
  clientsid: ClientIDSlice,
  settings: SettingsSlice,
  auth: AuthSlice,
  account: AccountSlice,
  notify: NotificationSlice,
  cache: cacheSlice,
  srreport: SrReportSlice,
  invoicereport: InvoiceReportSlice,
  branchreport: BranchReportSlice,
  gstpackage: GstPackageSlice,
  unit: UnitSlice
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: SecureAsyncLocalStorage,
  whitelist: ['notify'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: isDev ? true : false,
});

export const persistor = persistStore(store);
export default store;
