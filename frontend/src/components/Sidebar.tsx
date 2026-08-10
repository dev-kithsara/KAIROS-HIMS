import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { getDepartmentName } from '../utils/constants';
import logoImage from '../assets/logo.jpeg';

// ── KAIROS Clinical Palette ────────────────────────────────────────────────
const BG        = '#090F16';
const PANEL     = '#0E1720';
const TEXT      = '#EEF7FC';
const TEAL      = '#45A79A';
const ACCENT    = '#4DC4B5';
const MUTED     = '#8FA8B4';
const BORDER    = '#253642';
const DANGER    = '#EF4444';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const getNavLinks = () => {
    const role = user?.role;
    switch (role) {
      case 'MANAGER':
        return [
          { name: 'Dashboard', path: '/' },
          { name: 'Analytics', path: '/analytics' },
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
    <aside
      className="w-64 h-screen flex flex-col shrink-0"
      style={{ backgroundColor: PANEL, borderRight: `1px solid ${BORDER}` }}
    >
      {/* Brand / Logo Area */}
      <div
        className="h-20 flex items-center px-6 shrink-0"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-3">
          <img
            src={logoImage}
            alt="KAIROS HIMS Logo"
            className="w-11 h-11 object-cover rounded-full"
            style={{ border: `2px solid ${TEAL}` }}
          />
          <span className="font-extrabold text-xl tracking-widest" style={{ color: TEXT }}>
            KAIROS
          </span>
        </div>
      </div>

      {/* User Profile Area */}
      {user && (
        <div className="px-6 py-5 shrink-0" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: MUTED }}>
            Logged in as:
          </p>
          <p className="font-bold text-base truncate" style={{ color: TEXT }}>{user.name}</p>

          <div className="mt-2 flex flex-col gap-1">
            <span
              className="inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-md tracking-wide w-max"
              style={{ backgroundColor: `${TEAL}22`, color: ACCENT, border: `1px solid ${TEAL}55` }}
            >
              {user.role?.replace('_', ' ')}
            </span>
            <span className="text-xs font-medium mt-1" style={{ color: MUTED }}>
              {getDepartmentName(user.departmentId)}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className="w-full flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer"
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${TEAL}33, #4588AB33)`,
                      color: ACCENT,
                      border: `1px solid ${TEAL}55`,
                    }
                  : {
                      color: MUTED,
                      border: '1px solid transparent',
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = `${BORDER}`;
                  (e.currentTarget as HTMLElement).style.color = TEXT;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = MUTED;
                }
              }}
            >
              {link.name}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer"
          style={{ color: DANGER, backgroundColor: `${DANGER}15`, border: `1px solid ${DANGER}40` }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = `${DANGER}25`; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = `${DANGER}15`; }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
