import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, HeartPulse } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto">
          <HeartPulse className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900">404</h1>
        <h2 className="text-base font-bold text-slate-700">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The healthcare resource or page you requested does not exist or may have been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-5 py-3 rounded-xl transition"
        >
          <Home className="w-4 h-4" />
          <span>Return to RuralCare Home</span>
        </Link>
      </div>
    </div>
  );
};
