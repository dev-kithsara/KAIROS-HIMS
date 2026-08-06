import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { getDepartmentName } from '../utils/constants';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); // To check the current active route

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  // 1. Define navigation links based on the user's role
  // This is how we achieve Role-Based UI navigation
  const getNavLinks = () => {
    const role = user?.role;

    switch (role) {
      case 'MANAGER':
        return [
          { name: 'Dashboard', path: '/' },
          { name: 'Analytics', path: '/analytics' }, // Future feature
        ];
      case 'STAFF':
        return [
          { name: 'My Incidents', path: '/' },
          { name: 'Report Incident', path: '/report' },
        ];
      case 'INVESTIGATOR':
        return [{ name: 'My Investigations', path: '/' }];
      case 'ACTION_OWNER':
        return [{ name: 'Pending Actions', path: '/' }];
      default:
        return [{ name: 'Dashboard', path: '/' }];
    }
  };

  const links = getNavLinks();

  return (
    // 2. Sidebar Container: Fixed width, full height, dark theme
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col shadow-xl">
      {/* 3. Brand / Logo Area */}
      <div className="h-16 flex items-center px-6 bg-gray-950 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg">
            K
          </div>
          <span className="font-bold text-xl tracking-wider">KAIROS</span>
        </div>
      </div>

      {/* 4. User Profile Area (Shows Name, Role, and Department) */}
      {user && (
        <div className="px-6 py-6 border-b border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Logged in as:</p>
          <p className="font-semibold text-lg truncate">{user.name}</p>

          <div className="mt-2 flex flex-col gap-1">
            <span className="inline-block px-2 py-1 bg-blue-900/50 text-blue-300 text-xs font-medium rounded border border-blue-800/50 w-max">
              {user.role?.replace('_', ' ')}
            </span>
            {/* Displaying the Department Name using our helper function */}
            <span className="text-xs text-gray-400 mt-1">
              {getDepartmentName(user.departmentId)}
            </span>
          </div>
        </div>
      )}

      {/* 5. Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {link.name}
            </button>
          );
        })}
      </nav>

      {/* 6. Logout Area at the bottom */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
