import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { setSidebarOpen } from '../features/ui/uiSlice';
import { logOut } from '../features/auth/authSlice';
import { 
  Home, BookOpen, FileText, Bookmark, User, Settings, LogOut, X, Heart
} from 'lucide-react';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLinkClick = () => {
    dispatch(setSidebarOpen(false));
  };

  const handleLogout = () => {
    dispatch(logOut());
    dispatch(setSidebarOpen(false));
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Scriptures', path: '/books', icon: BookOpen },
    { name: 'Journal Notes', path: '/notes', icon: FileText },
    { name: 'Saved Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const activeStyle = "flex items-center space-x-3 px-4 py-3 bg-primary/10 text-accent font-semibold border-l-4 border-primary rounded-r-xl transition-all";
  const inactiveStyle = "flex items-center space-x-3 px-4 py-3 text-text/75 hover:text-accent hover:bg-primary/5 border-l-4 border-transparent rounded-r-xl transition-all";

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => dispatch(setSidebarOpen(false))}
          className="fixed inset-0 z-40 bg-text/30 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-card border-r border-gold/20 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:sticky md:top-[65px] md:h-[calc(100vh-65px)] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex-1 py-5 overflow-y-auto">
          {/* Header in mobile mode */}
          <div className="flex justify-between items-center px-6 pb-5 border-b border-gold-light/20 md:hidden mb-4">
            <span className="font-serif font-bold text-accent text-lg">Navigation</span>
            <button
              onClick={() => dispatch(setSidebarOpen(false))}
              className="p-1 text-text hover:bg-primary/15 rounded-lg transition-colors"
              aria-label="Close menu drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-sans">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer actions / credits */}
        <div className="p-4 border-t border-gold-light/25 bg-card">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-700 hover:text-red-950 hover:bg-red-50/50 border-l-4 border-transparent rounded-r-xl transition-all"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="text-sm font-semibold">Sign Out</span>
            </button>
          )}

          <div className="mt-4 pt-2 text-center text-3xs font-semibold text-text/40 flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-accent fill-accent animate-pulse" />
            <span>for Dharma</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
