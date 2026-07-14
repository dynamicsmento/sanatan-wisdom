import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../features/ui/uiSlice';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const ToastItem = ({ id, type, message }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, 4500);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-primary shrink-0" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-orange-50 border-orange-200 text-orange-950',
  };

  return (
    <div 
      className={`flex items-start justify-between p-4 mb-3 border rounded-xl shadow-soft min-w-[280px] max-w-sm transition-all duration-300 animate-slide-in ${bgColors[type] || bgColors.info}`}
      style={{
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div className="flex items-start space-x-3">
        {icons[type] || icons.info}
        <p className="text-sm font-medium pt-0.5">{message}</p>
      </div>
      <button
        onClick={() => dispatch(removeToast(id))}
        className="text-text/40 hover:text-text/75 transition-colors p-0.5 ml-2 self-start"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const toasts = useSelector((state) => state.ui.toasts);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  );
};
