import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LoaderDark } from './assets';
import useCheckAuth from './hooks/useCheckAuth';
import { useSelector } from 'react-redux';
import { ROUTES } from './config';
import loadable from '@loadable/component'
import { getAuthToken } from './utils';
import Error404 from './pages/common/Error404';

//common Routes
const Account = loadable(() => import('./pages/common/Account'));
const GenerateSR = loadable(() => import('./pages/common/GenerateSR'));
const EditSR = loadable(() => import('./pages/common/EditServiceRequest'));
const UpdateClientDocument = loadable(() => import('./pages/common/UpdateClientDocument'));

//auth routes
const LoginMain = loadable(() => import('./pages/auth/LoginMain'));
const BranchRegister = loadable(() => import('./pages/auth/BranchRegister'));
const CustomerRegister = loadable(() => import('./pages/auth/CustomerRegister'));
const ForgotPassword = loadable(() => import('./pages/auth/ForgotPassword'));

// customer routes
const CustomerHome = loadable(() => import('./pages/Customer'));
const CustomerServiceRequest = loadable(() => import('./pages/Customer/Service Request/CustomerServiceRequest'));
const CustomerClientList = loadable(() => import('./pages/Customer/Clients/List'));
const CustomerClientManage = loadable(() => import('./pages/Customer/Clients/Manage'));
const CustomerPayment = loadable(() => import('./pages/Customer/Service Request/Payment'));

// branch routes
const BranchHome = loadable(() => import('./pages/Branch'));
const BranchServiceRequest = loadable(() => import('./pages/Branch/Service Request/BranchServiceRequest'));
const BranchCustomersList = loadable(() => import('./pages/Branch/Customer/CustomerList'));
const BranchCustomersClientsList = loadable(() => import('./pages/Branch/Customer/ClientList'));
const BranchPayement = loadable(() => import('./pages/Branch/Service Request/Payment'));
const BranchWallet = loadable(() => import('./pages/Branch/Wallet/Passbook'));
const BranchActivation = loadable(() => import('./pages/Branch/Activation'));
const BranchSRSearch = loadable(() => import('./pages/Branch/Service Request/SRSearch'));
const BranchCommision = loadable(() => import('./pages/Branch/BranchCommision'));

//department routes
const DepartMentHome = loadable(() => import('./pages/Department'));
const DepartmentStaff = loadable(() => import('./pages/Department/Staff/List'));
const DepartmentStaffView = loadable(() => import('./pages/Department/Staff/View'));
const DepartmentServiceRequest = loadable(() => import('./pages/Department/Service Request/List'));

//verification team routes
const VerificationTeamHome = loadable(() => import('./pages/Verification Team'));
const VerificationTeamServiceRequest = loadable(() => import('./pages/Verification Team/Service Request/List'));

//Staff Routes
const StaffHome = loadable(() => import('./pages/Staff'));
const StaffServiceRequest = loadable(() => import('./pages/Staff/Service Request/List'));

//super admin
const AdminHome = loadable(() => import('./pages/admin'));
const AdminServiceRequest = loadable(() => import('./pages/admin/Service Request/AdminServiceRequest'));
const AdminWallet = loadable(() => import('./pages/admin/Wallet/Passbook'));
const AdminServices = loadable(() => import('./pages/admin/Services/AdminServices'));
const AddAdminServices = loadable(() => import('./pages/admin/Services/AddServices'));
const EditAdminServices = loadable(() => import('./pages/admin/Services/EditServices'));
const AdminStaff = loadable(() => import('./pages/admin/Office/AllStaff'));
const AdminAddEditStaff = loadable(() => import('./pages/admin/Office/AddEditStaff'));
const AdminAllBranchs = loadable(() => import('./pages/admin/Branch/AllBranch'));
const AdminEditBranchRegister = loadable(() => import('./pages/admin/Branch/EditBranchRegister'));
const AdminCustomerList = loadable(() => import('./pages/admin/Customer/CustomerList'));
const AdminClientList = loadable(() => import('./pages/admin/Customer/ClientList'));
const AdminClientEdit = loadable(() => import('./pages/admin/Customer/Edit'));
const AdminCustomerEdit = loadable(() => import('./pages/admin/Customer/CustomerEdit'));
const AdminDepartment = loadable(() => import('./pages/admin/Department/Department'));
const AdminCommission = loadable(() => import('./pages/admin/Commission/AdminCommission'));
const AdminUnit = loadable(() => import('./pages/admin/Unit/AllUnit'));
const AdminActionUnit = loadable(() => import('./pages/admin/Unit/Action'));

// SR Report
const SrReport = loadable(() => import('./pages/admin/Reports/SrReport'));
const InvoiceReport = loadable(() => import('./pages/admin/Reports/InvoiceReport'));
const BranchReceivedVoucher = loadable(() => import('./pages/admin/Reports/BranchReceivedVoucher'));
const BranchList = loadable(() => import('./pages/admin/Reports/BranchList'));

// Gst Package Customer
const GstPackage = loadable(() => import('./pages/Customer/GstPackage/List'));
const ActionGstPackage = loadable(() => import('./pages/Customer/GstPackage/Action'));

// Gst Package Branch
const BranchGstPackage = loadable(() => import('./pages/Branch/GstPackage/List'));
const BranchActionGstPackage = loadable(() => import('./pages/Branch/GstPackage/Action'));

// Gst Package Admin
const AdminGstPackage = loadable(() => import('./pages/admin/GstPackage/List'));
const AdminActionGstPackage = loadable(() => import('./pages/admin/GstPackage/Action'));

// Gst Package verify
const VerifyGstPackage = loadable(() => import('./pages/Verification Team/GstPackage/List'));
const VerifyActionGstPackage = loadable(() => import('./pages/Verification Team/GstPackage/Action'));

const UnprotectedRoutes = ({ children }) => {
  const user = useSelector((state) => state?.auth);
  const token = getAuthToken();
  const auth = token ? true : false;

  if (auth) {
    return <Navigate to={`${ROUTES[user?.role]}/service-request`} />
  }

  return children;
}

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state?.auth);
  const location = useLocation();

  const token = getAuthToken();
  const auth = token ? true : false;

  if (user.role === 2 && auth && (user.transaction_id === null || user.transaction_id === 'n_a')) {
    if (location.pathname === '/branch-activation') {
      return children;
    }
    return <Navigate to={'/branch-activation'} replace />
  }

  if (!auth) {
    return <Navigate to={'/login'} replace />
  }

  return children;
}


const MainRoutes = () => {
  const { loading } = useCheckAuth();
  const user = useSelector((state) => state?.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={LoaderDark} alt="loader" className="w-10 h-10" />
      </div>
    );
  }

  return (
    <Routes>
      {/* auth routes  */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="login" element={<UnprotectedRoutes><LoginMain /></UnprotectedRoutes>} />
      <Route path="branch-register" element={<UnprotectedRoutes><BranchRegister /></UnprotectedRoutes>} />
      <Route path="customer-register" element={<UnprotectedRoutes><CustomerRegister /></UnprotectedRoutes>} />
      <Route path="forgot-password" element={<UnprotectedRoutes><ForgotPassword /></UnprotectedRoutes>} />

      {/* admin routes  */}
      {user?.role === 1 &&
        <Route path="/admin" element={<ProtectedRoute><AdminHome /></ProtectedRoute>}>
          <Route path="services" element={<AdminServices />} />
          <Route path="services/addService" element={<AddAdminServices />} />
          <Route path="services/editService/:id" element={<EditAdminServices />} />
          <Route path="office-management" element={<AdminStaff />} />
          <Route path="add-staff" element={<AdminAddEditStaff />} />
          <Route path="edit-staff/:id" element={<AdminAddEditStaff />} />
          <Route path="customer" element={<AdminCustomerList />} />
          <Route path="client/list/:id" element={<AdminClientList />} />
          <Route path="client/edit/:id" element={<AdminClientEdit />} />
          <Route path="customer/edit/:id" element={<AdminCustomerEdit />} />
          <Route path="branch" element={<AdminAllBranchs />} />
          <Route path="edit-branch/:id" element={<AdminEditBranchRegister />} />
          <Route path="service-request/:mode?/:page?" element={<AdminServiceRequest />} />
          <Route path="service-request/generate" element={<GenerateSR />} />
          <Route path="service-request/edit/:id" element={<EditSR />} />
          <Route path="department/:id" element={<AdminDepartment />} />
          <Route path="wallet" element={<AdminWallet />} />
          <Route path="commission" element={<AdminCommission />} />
          <Route path="account" element={<Account />} />
          <Route path="unit" element={<AdminUnit />} />
          <Route path="unit/add" element={<AdminActionUnit />} />
          <Route path="unit/edit/:id" element={<AdminActionUnit />} />
          {/* Sr Report */}
          <Route path="sr-report" element={<SrReport />} />
          <Route path="invoice-report" element={<InvoiceReport />} />
          <Route path="branch-received-voucher" element={<BranchReceivedVoucher />} />
          <Route path="branch-list" element={<BranchList />} />
          {/* GST Package */}
          <Route path="gst-package" element={<AdminGstPackage />} />
          <Route path="gst-package/add" element={<AdminActionGstPackage />} />
          <Route path="gst-package/edit/:id" element={<AdminActionGstPackage />} />
        </Route>
      }

      {/* branch routes  */}
      {user?.role === 2 &&
        <Route path="/branch" element={<ProtectedRoute><BranchHome /></ProtectedRoute>}>
          <Route path="customer" element={<BranchCustomersList />} />
          <Route path="client/list/:id" element={<BranchCustomersClientsList />} />
          <Route path="service-request/:mode?/:page?" element={<BranchServiceRequest />} />
          <Route path="service-request/generate" element={<GenerateSR />} />
          <Route path="service-request/edit/:id" element={<EditSR />} />
          {/* Sr Report */}
          <Route path="sr-report" element={<SrReport />} />
          <Route path="invoice-report" element={<InvoiceReport />} />
          <Route path="branch-received-voucher" element={<BranchReceivedVoucher />} />
          {/* GST Package */}
          <Route path="gst-package" element={<BranchGstPackage />} />
          <Route path="gst-package/add" element={<BranchActionGstPackage />} />
          <Route path="gst-package/edit/:id" element={<BranchActionGstPackage />} />
        </Route>
      }

      {/* customer routes  */}
      {user?.role === 3 &&
        <Route path="/customer" element={<ProtectedRoute><CustomerHome /></ProtectedRoute>}>
          {/* user routes  */}
          <Route path="clients/:page?" element={<CustomerClientList />} />
          <Route path="clients/add" element={<CustomerClientManage />} />
          <Route path="clients/edit/:id" element={<CustomerClientManage />} />
          {/* service request  */}
          <Route path="service-request/:mode?/:page?" element={<CustomerServiceRequest />} />
          <Route path="service-request/generate" element={<GenerateSR />} />
          <Route path="service-request/:status?/payment/:id" element={<CustomerPayment />} />
          <Route path="service-request/edit-doc/:id/:clientId" element={<UpdateClientDocument />} />
          {/* account routes  */}
          <Route path="account" element={<Account />} />
          {/* GST Package */}
          <Route path="gst-package" element={<GstPackage />} />
          <Route path="gst-package/add" element={<ActionGstPackage />} />
          <Route path="gst-package/edit/:id" element={<ActionGstPackage />} />
        </Route>
      }

      {/* department routes  */}
      {user?.role === 4 &&
        <Route path="/department" element={<ProtectedRoute><DepartMentHome /></ProtectedRoute>}>
          <Route path="staff" element={<DepartmentStaff />} />
          <Route path="staff/view/:id" element={<DepartmentStaffView />} />
          <Route path="service-request/:mode?/:page?" element={<DepartmentServiceRequest />} />
          <Route path="service-request/view/:id" element={<EditSR />} />
          <Route path="account" element={<Account />} />
        </Route>
      }

      {/* staff routes  */}
      {user?.role === 5 &&
        <Route path="/staff" element={<ProtectedRoute><StaffHome /></ProtectedRoute>}>
          <Route path="service-request/:mode?/:page?" element={<StaffServiceRequest />} />
          <Route path="service-request/view/:id" element={<EditSR />} />
          <Route path="account" element={<Account />} />
        </Route>
      }

      {/* branch routes */}
      {user?.role === 2 &&
        <Route path="/branch" element={<ProtectedRoute><BranchHome /></ProtectedRoute>}>
          <Route path="customer" element={<BranchCustomersList />} />
          <Route path="client/list/:id" element={<BranchCustomersClientsList />} />
          <Route path="service-request/:mode?/:page?" element={<BranchServiceRequest />} />
          <Route path="service-request/generate" element={<GenerateSR />} />
          <Route path="service-request/:status?/payment/:id" element={<BranchPayement />} />
          <Route path="service-request/edit-doc/:id/:clientId" element={<UpdateClientDocument />} />
          <Route path="commission" element={<BranchCommision />} />
          <Route path="wallet" element={<BranchWallet />} />
          <Route path="search-sr" element={<BranchSRSearch />} />
          <Route path="account" element={<Account />} />
          {/* GST Package */}
          <Route path="gst-package" element={<BranchGstPackage />} />
          <Route path="gst-package/add" element={<BranchActionGstPackage />} />
          <Route path="gst-package/edit/:id" element={<BranchActionGstPackage />} />
        </Route>
      }

      {user?.role === 2 &&
        <Route path="/branch-activation" element={<ProtectedRoute><BranchActivation /></ProtectedRoute>} />
      }

      {/* verificationteam routes  */}
      {user?.role === 6 &&
        <Route path="/verificationteam" element={<ProtectedRoute><VerificationTeamHome /></ProtectedRoute>}>
          <Route path="service-request/:mode?/:page?" element={<VerificationTeamServiceRequest />} />
          <Route path="service-request/view/:id" element={<EditSR />} />
          <Route path="account" element={<Account />} />
          <Route path="service-request/generate" element={<GenerateSR />} />

          {/* GST Package */}
          <Route path="gst-package" element={<VerifyGstPackage />} />
          <Route path="gst-package/add" element={<VerifyActionGstPackage />} />
          <Route path="gst-package/edit/:id" element={<VerifyActionGstPackage />} />

        </Route>
      }
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default MainRoutes;
