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
    // 2. Sidebar Container: Fixed width, full height, white theme with dark elements
    <aside className="w-64 bg-white text-slate-900 h-screen flex flex-col border-r border-slate-200 shadow-sm shrink-0">
      {/* 3. Brand / Logo Area */}
      <div className="h-16 flex items-center px-6 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
            K
          </div>
          <span className="font-extrabold text-xl tracking-wider text-slate-900">KAIROS</span>
        </div>
      </div>

      {/* 4. User Profile Area (Shows Name, Role, and Department) */}
      {user && (
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Logged in as:</p>
          <p className="font-bold text-slate-900 text-base truncate">{user.name}</p>

          <div className="mt-2 flex flex-col gap-1">
            <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-white text-[11px] font-bold rounded-md tracking-wide w-max shadow-sm">
              {user.role?.replace('_', ' ')}
            </span>
            {/* Displaying the Department Name using our helper function */}
            <span className="text-xs font-medium text-slate-500 mt-1">
              {getDepartmentName(user.departmentId)}
            </span>
          </div>
        </div>
      )}

      {/* 5. Navigation Links (Dark/Black styled bars) */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.name}
            </button>
          );
        })}
      </nav>

      {/* 6. Logout Area at the bottom */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
