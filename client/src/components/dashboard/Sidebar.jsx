import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUser, 
  FiFileText, 
  FiFolder, 
  FiChevronDown, 
  FiChevronRight,
  FiMenu,
  FiX,
  FiPlus,
  FiList
} from 'react-icons/fi';

import { useSelector } from 'react-redux';



const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [proposalsOpen, setProposalsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const credits = user?.credits;

  // Navigation items with nested structure
  const navItems = [
    {
      title: 'Dashboard',
      icon: <FiHome className="w-5 h-5" />,
      path: '/dashboard',
      exact: true
    },
    {
      title: 'Freelance Profile',
      icon: <FiUser className="w-5 h-5" />,
      path: '/dashboard/profile'
    },
    {
      title: 'Projects',
      icon: <FiFolder className="w-5 h-5" />,
      path: '/dashboard/projects'
    },
    {
      title: 'Proposals',
      icon: <FiFileText className="w-5 h-5" />,
      isDropdown: true,
      isOpen: proposalsOpen,
      toggle: () => setProposalsOpen(!proposalsOpen),
      subItems: [
        {
          title: 'Generate Proposal',
          icon: <FiPlus className="w-4 h-4" />,
          path: '/dashboard/proposals/generate'
        },
        {
          title: 'All Proposals',
          icon: <FiList className="w-4 h-4" />,
          path: '/dashboard/proposals/all'
        }
      ]
    }
  ];

  // Check if a path is active
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center">
            {isOpen ? (
              <span className="text-xl font-bold text-emerald-600">Proposly</span>
            ) : (
              <span className="text-xl font-bold text-emerald-600">P</span>
            )}
          </Link>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden"
          >
            <FiX className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleSidebar}
            className="hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none md:block"
          >
            {isOpen ? <FiChevronRight className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                {item.isDropdown ? (
                  <div className="space-y-1">
                    <button
                      onClick={item.toggle}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.subItems[0].path) || isActive(item.subItems[1].path)
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {isOpen && <span>{item.title}</span>}
                      </div>
                      {isOpen && (
                        <span>
                          {item.isOpen ? (
                            <FiChevronDown className="w-4 h-4" />
                          ) : (
                            <FiChevronRight className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </button>
                    
                    {/* Dropdown items */}
                    {(item.isOpen || !isOpen) && (
                      <ul className={`mt-1 space-y-1 ${isOpen ? 'pl-10' : 'pl-0'}`}>
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                isActive(subItem.path)
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <span className="mr-3">{subItem.icon}</span>
                              {isOpen && <span>{subItem.title}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {isOpen && <span>{item.title}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <span className="text-sm font-medium">{user.username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
                <p className="text-xs text-gray-500">Credits: {credits || 0}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
