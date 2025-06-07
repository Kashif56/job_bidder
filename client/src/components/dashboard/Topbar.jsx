import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiMenu, FiSearch, FiHelpCircle, FiSettings } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';


const Topbar = ({ toggleSidebar }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const credits = 0;

  const handle_logout = (e) => {
    dispatch(logout())
    toast.done("Logout Successfull")
    navigate('/login')
  }



  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setNotificationsOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-600 md:hidden"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            {/* Search bar */}
            <div className="relative ml-4 md:ml-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  type="search"
                  placeholder="Search proposals..."
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Credits display */}
            <div className="hidden md:block">
              <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {credits} Credits
              </div>
            </div>

            {/* Help button */}
            <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
              <FiHelpCircle className="h-6 w-6" />
            </button>

            {/* Settings button */}
            <Link to="/dashboard/settings" className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
              <FiSettings className="h-6 w-6" />
            </Link>

            {/* Notifications dropdown */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
              >
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                <FiBell className="h-6 w-6" />
              </button>

              {/* Notifications dropdown panel */}
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-2 px-4 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="py-2 px-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">Your proposal was generated</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                    <div className="py-2 px-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">Credits running low</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                    <div className="py-2 px-4 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">Welcome to Proposly!</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="py-2 px-4 border-t border-gray-100 text-center">
                    <a href="#" className="text-xs text-emerald-600 font-medium hover:text-emerald-500">
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <span className="font-medium">{user.username.charAt(0).toUpperCase()}</span>
                </div>
              </button>

              {/* User dropdown panel */}
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/dashboard/billing"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Billing
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      onClick={handle_logout}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
