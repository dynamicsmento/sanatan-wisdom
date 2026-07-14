import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-text/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />
      {/* Content Card */}
      <div className="relative bg-background border gold-border rounded-xl shadow-soft w-full max-w-lg overflow-hidden z-10 max-h-[90vh] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-light/40 bg-card">
          <h3 className="text-lg font-serif font-bold text-accent">{title}</h3>
          <button
            onClick={onClose}
            className="text-text/60 hover:text-text p-1.5 hover:bg-text/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-text">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
