import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ title = 'Failed to load content', message, onRetry }) => {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 mb-5">{message || 'An unexpected network error occurred.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
