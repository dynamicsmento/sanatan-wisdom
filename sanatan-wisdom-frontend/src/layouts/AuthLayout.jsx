import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from '../components/Toast';

export const AuthLayout = () => {
  const theme = useSelector((state) => state.ui.theme);

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 bg-background transition-colors duration-300 ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* Brand logo header */}
      <div className="mb-6 text-center">
        <Link to="/" className="flex flex-col items-center space-y-2">
          <span className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-serif font-bold text-lg shadow-gold select-none">
            ॐ
          </span>
          <h1 className="text-2xl font-serif font-bold text-accent tracking-wide mt-2">
            Sanatan Wisdom
          </h1>
          <p className="text-xs text-text/60 italic font-medium">
            Journey to Truth and Inner Peace
          </p>
        </Link>
      </div>

      {/* Glass card container */}
      <div className="w-full max-w-md bg-card border gold-border rounded-xl shadow-soft p-8 glass-card relative overflow-hidden">
        {/* Spiritual corner decor */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/20 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/20 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/20 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/20 rounded-br-xl" />
        
        <Outlet />
      </div>

      {/* Brand copyrights */}
      <div className="mt-8 text-center text-3xs text-text/40 font-semibold tracking-wider">
        © {new Date().getFullYear()} SANATAN WISDOM. SHARING SACRED TRADITIONS.
      </div>

      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
