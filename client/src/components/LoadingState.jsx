import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading healthcare data...' }) => {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
        <Loader2 className="w-6 h-6 text-teal-700 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Connecting to RuralCare Health Service</p>
    </div>
  );
};
