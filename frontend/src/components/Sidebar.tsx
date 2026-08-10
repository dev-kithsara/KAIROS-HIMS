import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { getDepartmentName } from '../utils/constants';
import logoImage from '../assets/logo.jpeg';

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
    // Sidebar Container: Fixed width, full height, Dark Slate theme (#111827)
    <aside className="w-64 bg-[#111827] text-[#F1F5F9] h-screen flex flex-col border-r border-[#1E293B] shadow-xl shrink-0">
      {/* Brand / Logo Area */}
      <div className="h-20 flex items-center px-6 bg-[#0B1120] border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <img
            src={logoImage}
            alt="KAIROS HIMS Logo"
            className="w-12 h-12 object-cover rounded-full shadow-md border border-[#1E293B]"
          />

          <span className="font-extrabold text-xl tracking-wider text-[#F1F5F9]">KAIROS</span>
        </div>
      </div>

      {/* User Profile Area */}
      {user && (
        <div className="px-6 py-5 border-b border-[#1E293B] bg-[#1E293B]/40">
          <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-1">
            Logged in as:
          </p>
          <p className="font-bold text-[#F1F5F9] text-base truncate">{user.name}</p>

          <div className="mt-2 flex flex-col gap-1">
            <span className="inline-block px-2.5 py-0.5 bg-[#0D9488] text-white text-[11px] font-bold rounded-md tracking-wide w-max shadow-sm">
              {user.role?.replace('_', ' ')}
            </span>
            <span className="text-xs font-medium text-[#94A3B8] mt-1">
              {getDepartmentName(user.departmentId)}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0D9488] text-white shadow-lg shadow-[#0D9488]/20'
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
              }`}
            >
              {link.name}
            </button>
          );
        })}
      </nav>

      {/* Logout Area */}
      <div className="p-4 border-t border-[#1E293B] bg-[#0B1120]/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 rounded-xl transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
