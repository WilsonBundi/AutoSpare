import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Expenses from './pages/Expenses';
import Purchases from './pages/Purchases';
import CashSessions from './pages/CashSessions';
import Users from './pages/Users';
import Suppliers from './pages/Suppliers';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const RoleProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="pos"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager', 'cashier']}>
                <POS />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="products"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager', 'storekeeper']}>
                <Products />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="customers"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager', 'cashier']}>
                <Customers />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                <Reports />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="purchases"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager', 'storekeeper']}>
                <Purchases />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="suppliers"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager', 'storekeeper']}>
                <Suppliers />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="cash-sessions"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager', 'cashier']}>
                <CashSessions />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <Users />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="expenses"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                <Expenses />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                <Settings />
              </RoleProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
