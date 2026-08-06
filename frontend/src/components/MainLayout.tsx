import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const MainLayout: React.FC = () => {
  return (
    // 1. Full viewport height, dark hospital background (#090f16), flex layout
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden antialiased">
      {/* 2. Left Fixed Sidebar */}
      <Sidebar />

      {/* 3. Main Content Section */}
      {/* flex-1 & min-w-0: Prevents wide grid components from breaking layout flexbox */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-background">
        {/* Scrollable Dashboard View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

        {/* 4. Glassmorphism Modern Footer */}
        <footer className="border-t border-border/40 bg-card/40 backdrop-blur-md py-3 px-6 text-xs text-muted-foreground flex justify-between items-center">
          <div>
            &copy; {new Date().getFullYear()}{' '}
            <span className="font-semibold gradient-text">KAIROS HIMS</span>. Hospital Incident &
            Risk Management.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-[11px] text-teal-400 font-mono">SYSTEM ONLINE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
