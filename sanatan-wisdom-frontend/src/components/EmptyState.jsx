import React from 'react';
import { BookOpen } from 'lucide-react';

export const EmptyState = ({ 
  title = 'No Items Found', 
  message = 'Nothing has been created or bookmarked here yet.', 
  icon: Icon = BookOpen, 
  actionText, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-card/60 rounded-xl border border-dashed border-gold/30 max-w-md mx-auto my-6 shadow-insetGold">
      <div className="p-4 bg-primary/10 rounded-full text-accent mb-4 border border-gold-light/20">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-serif font-bold text-accent mb-1">{title}</h3>
      <p className="text-sm text-text/70 mb-6">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-primary hover:bg-secondary text-white font-medium rounded-xl shadow-soft saffron-hover"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
