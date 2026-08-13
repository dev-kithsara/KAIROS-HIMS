import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen bg-[#090F16] text-[#EEF7FC] overflow-hidden antialiased">
      {/* Left Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Section */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-[#090F16]">
        {/* 2. Add the Header component here */}
        <Header />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#253642] bg-[#0E1720]/40 backdrop-blur-md py-3 px-6 text-xs text-[#8FA8B4] flex justify-between items-center">
          <div>
            &copy; {new Date().getFullYear()}{' '}
            <span className="font-semibold text-[#45A79A]">KAIROS HIMS</span>. Hospital Incident &
            Risk Management.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4DC4B5] animate-pulse"></span>
            <span className="text-[11px] text-[#4DC4B5] font-mono">SYSTEM ONLINE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
