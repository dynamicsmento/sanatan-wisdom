import React from 'react';

export const Skeleton = ({ variant = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <>
        {items.map((_, idx) => (
          <div key={idx} className="bg-card rounded-xl p-5 border border-gold/20 animate-pulse space-y-4 shadow-soft">
            <div className="h-44 bg-text/10 rounded-lg w-full" />
            <div className="space-y-2">
              <div className="h-5 bg-text/15 rounded w-2/3" />
              <div className="h-4 bg-text/10 rounded w-full" />
              <div className="h-4 bg-text/10 rounded w-5/6" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-9 bg-text/15 rounded-lg w-28" />
              <div className="h-9 bg-text/10 rounded-full w-9" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3 w-full">
        {items.map((_, idx) => (
          <div key={idx} className="flex items-center space-x-4 p-4 bg-card rounded-xl border border-gold/15 animate-pulse">
            <div className="w-12 h-12 bg-text/10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-text/15 rounded w-1/3" />
              <div className="h-3 bg-text/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-3 w-full">
      <div className="h-4 bg-text/15 rounded w-full" />
      <div className="h-4 bg-text/10 rounded w-5/6" />
      <div className="h-4 bg-text/10 rounded w-4/5" />
    </div>
  );
};

export default Skeleton;
