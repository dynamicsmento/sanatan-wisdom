import React from 'react';

export const Loader = ({ size = 'md', text = 'Connecting to divine wisdom...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* Spiritual Wheel style loader */}
      <div 
        className={`${sizeClasses[size]} border-t-primary border-r-transparent border-b-secondary border-l-transparent rounded-full animate-spin`} 
        style={{ animationDuration: '1s' }}
      />
      {text && (
        <p className="text-sm font-serif italic text-accent font-medium animate-pulse text-center">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
