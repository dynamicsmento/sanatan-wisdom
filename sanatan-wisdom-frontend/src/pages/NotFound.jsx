import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-6 animate-fade-in">
      <div className="p-4 bg-primary/10 rounded-full text-accent shadow-gold border border-gold-light/20">
        <Compass className="w-12 h-12" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-accent">Path Not Found</h1>
        <p className="text-sm text-text/80 max-w-sm mx-auto leading-relaxed font-serif italic">
          "The path you seek does not lead to eternal truth. You have wandered away from the guidelines of dharma."
        </p>
      </div>

      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary hover:bg-secondary text-white text-xs font-semibold rounded-xl shadow-soft saffron-hover"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
