import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/context/AuthContext';
import logoImage from '../../assets/logo.jpeg';
import { X } from 'lucide-react';


export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

    // Controls the visibility of the clinical logout confirmation modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Trigger custom logout modal instead of native browser popup
  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const getNavLinks = () => {
    const role = user?.role;
    switch (role) {
      case 'MANAGER':
        return [
          {
            name: 'Dashboard',
            path: '/',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            ),
          },
          {
            name: 'Incidents',
            path: '/incidents',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            ),
          },
          {
            name: 'My Team',
            path: '/team',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            ),
          },
          {
            name: 'Analytics',
            path: '/analytics',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            ),
          },
        ];
      case 'STAFF':
        return [
          {
            name: 'My Incidents',
            path: '/my-incidents',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            ),
          },
          {
            name: 'Report Incident',
            path: '/submit-incident',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            ),
          },
        ];
      case 'INVESTIGATOR':
        return [
          {
            name: 'My Investigations',
            path: '/',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            ),
          },
        ];
      case 'ACTION_OWNER':
        return [
          {
            name: 'Pending Actions',
            path: '/',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ),
          },
        ];
      default:
        return [
          {
            name: 'Dashboard',
            path: '/',
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            ),
          },
        ];
    }
  };

  const links = getNavLinks();

   return (
    <>
      <aside
        className="w-64 h-screen flex flex-col shrink-0"
        style={{
          backgroundColor: 'var(--k-sidebar-bg)',
          borderRight: '1px solid var(--k-sidebar-border)',
        }}
      >
        {/* Brand / Logo Area */}
        <div
          className="h-20 flex items-center px-6 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
        >
          <div className="flex items-center gap-3.5">
            <img
              src={logoImage}
              alt="KAIROS HIMS Logo"
              className="w-11 h-11 object-cover rounded-xl shadow-md border border-white/20"
              style={{ boxShadow: '0 3px 10px rgba(0,0,0,0.35)' }}
            />
            <div>
              <span className="font-extrabold text-[19px] tracking-wider text-white block leading-tight">
                KAIROS
              </span>
              <span
                className="text-[11px] font-bold tracking-[0.22em] uppercase block mt-0.5"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                HIMS Safety
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== '/' && location.pathname.startsWith(link.path)) ||
              (user?.role === 'INVESTIGATOR' &&
                link.name === 'My Investigations' &&
                location.pathname.startsWith('/investigator'));

            return (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className="w-full flex items-center gap-3.5 px-4 py-3 text-[15px] font-semibold rounded-xl transition-all cursor-pointer text-left"
                style={{
                  backgroundColor: isActive ? 'var(--k-sidebar-active)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--k-sidebar-hover)';
                    (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                  }
                }}
              >
                <svg
                  className="w-5 h-5 shrink-0 opacity-85"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {link.icon}
                </svg>
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Area */}
        <div className="p-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.65)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--k-sidebar-hover)';
              (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)';
            }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Custom Animated Clinical Logout Modal ────────────────────────────── */}
            {/* ── Enterprise Clean Clinical Logout Modal ───────────────────────── */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Confirm Sign Out
              </h3>
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to sign out of{' '}
                <span className="font-semibold text-slate-800">
                  {user?.name || user?.email || 'your account'}
                </span>
                ?
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Any unsaved draft notes or ongoing incident form updates may be lost.
              </p>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-xs cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </> 
  );
};
