import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, FileText, Bookmark, User } from 'lucide-react';

export const BottomNavigation = () => {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Scriptures', path: '/books', icon: BookOpen },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const activeStyle = "flex flex-col items-center justify-center flex-1 py-2 text-accent font-semibold scale-105 transition-all duration-200";
  const inactiveStyle = "flex flex-col items-center justify-center flex-1 py-2 text-text/60 hover:text-accent transition-all duration-200";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-gold/25 md:hidden flex justify-around items-center px-2 py-1 shadow-[0_-4px_15px_-3px_rgba(62,39,35,0.06)]">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <span className="text-3xs mt-1 font-sans font-medium tracking-wide">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavigation;
