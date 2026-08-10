import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const MainLayout: React.FC = () => {
  return (
    // Full viewport height, KAIROS Deep Navy background (#0B1120), flex layout
    <div className="flex h-screen w-screen bg-[#0B1120] text-[#F1F5F9] overflow-hidden antialiased">
      {/* Left Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Section */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-[#0B1120]">
        {/* Scrollable Dashboard View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1E293B] bg-[#111827] py-3 px-6 text-xs text-[#94A3B8] flex justify-between items-center">
          <div>
            &copy; {new Date().getFullYear()}{' '}
            <span className="font-semibold text-[#22D3EE]">KAIROS HIMS</span>. Hospital Incident &
            Risk Management.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse"></span>
            <span className="text-[11px] text-[#22D3EE] font-mono">SYSTEM ONLINE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
