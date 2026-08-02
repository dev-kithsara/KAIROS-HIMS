import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. The Navbar will always stay at the top of the layout */}
      <Navbar />
      
      {/* 2. The main content area where child routes will be rendered */}
      <main className="flex-grow">
        {/* The Outlet is a placeholder for the child routes (Dashboard, Details, etc.) */}
        <Outlet />
      </main>
      
      {/* 3. Optional: A simple footer for the application */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} KAIROS HIMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
};