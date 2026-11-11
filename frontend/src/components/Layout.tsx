import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h1 className="text-lg sm:text-xl font-bold">Autospare POS</h1>
              </div>
              <div className="flex space-x-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/dashboard') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                >
                  Dashboard
                </Link>
                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'cashier') && (
                  <Link
                    to="/pos"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/pos') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                  >
                    POS
                  </Link>
                )}
                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'storekeeper') && (
                  <Link
                    to="/products"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/products') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                  >
                    Products
                  </Link>
                )}
                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'cashier') && (
                  <Link
                    to="/customers"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/customers') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                  >
                    Customers
                  </Link>
                )}
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <Link
                    to="/reports"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/reports') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                  >
                    Reports
                  </Link>
                )}
                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'storekeeper') && (
                  <>
                    <Link
                      to="/purchases"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/purchases') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                    >
                      Purchases
                    </Link>
                    <Link
                      to="/suppliers"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/suppliers') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                    >
                      Suppliers
                    </Link>
                  </>
                )}
                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'cashier') && (
                  <Link
                    to="/cash-sessions"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/cash-sessions') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                  >
                    Cash Sessions
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/users"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/users') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                  >
                    Users
                  </Link>
                )}
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <>
                    <Link
                      to="/expenses"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/expenses') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                    >
                      Expenses
                    </Link>
                    <Link
                      to="/settings"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive('/settings') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                    >
                      Settings
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{user?.full_name}</span>
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {user?.role?.toUpperCase()}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
