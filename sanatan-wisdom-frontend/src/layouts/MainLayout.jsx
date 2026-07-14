import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BottomNavigation from '../components/BottomNavigation';
import { ToastContainer } from '../components/Toast';

export const MainLayout = () => {
  const theme = useSelector((state) => state.ui.theme);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* Header Navbar */}
      <Navbar />

      {/* Main body viewport */}
      <div className="flex-1 flex relative">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic Nested Page viewports */}
        <main className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-8 overflow-x-hidden min-h-[calc(100vh-65px)] bg-background">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Bar Navigation */}
      <BottomNavigation />

      {/* Floating Toast alerts */}
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
