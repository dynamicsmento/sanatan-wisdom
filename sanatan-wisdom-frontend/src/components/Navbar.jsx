import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toggleSidebar, toggleTheme } from '../features/ui/uiSlice';
import { Menu, Sun, Moon, User, LogOut } from 'lucide-react';
import { logOut } from '../features/auth/authSlice';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.ui.theme);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-45 w-full bg-card/90 backdrop-blur-md border-b border-gold/20 py-3 px-4 md:px-6 flex justify-between items-center shadow-soft">
      {/* Left side */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="md:hidden p-2 text-accent hover:bg-primary/10 rounded-lg transition-colors"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-serif font-bold text-sm shadow-sm select-none">
            ॐ
          </span>
          <span className="text-lg md:text-xl font-serif font-bold text-accent tracking-wide group-hover:text-primary transition-colors">
            Sanatan Wisdom
          </span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 text-accent hover:bg-primary/10 rounded-full transition-colors"
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {/* User Info / Actions */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <span className="hidden md:inline text-xs font-semibold text-text/80">
              Pranam, {user?.name || 'Devotee'}
            </span>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 text-accent hover:bg-primary/10 rounded-full transition-colors bg-background border border-gold/30"
              title="Profile"
              aria-label="View profile"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-accent hover:bg-accent/15 hover:text-accent rounded-full transition-colors hidden md:block"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="text-xs font-semibold text-accent hover:text-primary transition-colors px-3 py-1.5 rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3.5 py-1.5 bg-primary hover:bg-secondary text-white text-xs font-semibold rounded-lg shadow-sm saffron-hover"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
