import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden antialiased" style={{ backgroundColor: '#090F16', color: '#EEF7FC' }}>
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#090F16' }}>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

        <footer
          className="py-3 px-6 text-xs flex justify-between items-center shrink-0"
          style={{ backgroundColor: '#0E1720', borderTop: '1px solid #253642', color: '#8FA8B4' }}
        >
          <div>
            &copy; {new Date().getFullYear()}{' '}
            <span
              className="font-semibold"
              style={{ background: 'linear-gradient(to right, #55B5A7, #5593B5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              KAIROS HIMS
            </span>
            . Hospital Incident &amp; Risk Management.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#45A79A' }}></span>
            <span className="text-[11px] font-mono" style={{ color: '#4DC4B5' }}>SYSTEM ONLINE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
