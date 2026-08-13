import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import logoImage from '../assets/logo.jpeg';

export const Sidebar: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavLinks = () => {
    const role = user?.role;
    switch (role) {
      case 'MANAGER':
        return [
          { name: 'Dashboard', path: '/' },
          // CHANGED: Added 'Incidents' menu
          { name: 'Incidents', path: '/incidents' },
          { name: 'Analytics', path: '/analytics' },
        ];
      default:
        return [{ name: 'Dashboard', path: '/' }];
    }
  };

  const links = getNavLinks();

  return (
    <aside className="w-64 bg-[#0E1720] text-[#EEF7FC] h-screen flex flex-col border-r border-[#253642] shrink-0">
      {/* Brand / Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-[#253642]">
        <div className="flex items-center gap-3">
          <img
            src={logoImage}
            alt="KAIROS HIMS Logo"
            className="w-10 h-10 object-cover rounded-full shadow-md"
          />
          <span className="font-extrabold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#55B5A7] to-[#5593B5]">
            KAIROS
          </span>
        </div>
      </div>

      {/* REMOVED: User Profile Area from here */}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          // Check if the current path starts with the link path (for nested routes like /incidents/1)
          const isActive =
            location.pathname === link.path ||
            (link.path !== '/' && location.pathname.startsWith(link.path));

          return (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#45A79A]/20 text-[#4DC4B5] border border-[#45A79A]/30'
                  : 'text-[#8FA8B4] hover:bg-[#253642]/50 hover:text-[#EEF7FC]'
              }`}
            >
              {link.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
