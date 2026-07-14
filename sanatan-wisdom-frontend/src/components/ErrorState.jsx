import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto my-6 bg-red-50 border border-red-200 rounded-xl shadow-soft">
      <AlertCircle className="w-10 h-10 text-red-600 mb-3" />
      <h4 className="text-md font-bold text-red-950 mb-1">Service Unreachable</h4>
      <p className="text-xs text-red-800 mb-4">{message || 'Unable to retrieve spiritual data at this time. Check your connection.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
