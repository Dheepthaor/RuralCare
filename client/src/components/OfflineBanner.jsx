import React, { useState, useEffect } from 'react';
import { WifiOff, BookOpen, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2.5 text-sm shadow-md transition-all sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
          <span>
            {lang === 'ml'
              ? 'ഓഫ്‌ലൈൻ മോഡ് സജീവം: ഇന്റർനെറ്റ് ലഭ്യമല്ല. ഫോണിൽ സൂക്ഷിച്ച ആരോഗ്യവിവരങ്ങൾ വായിക്കാം.'
              : 'Offline Mode Active: Internet connection unavailable. Saved health articles remain accessible.'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/health-info"
            className="inline-flex items-center gap-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-2.5 py-1 rounded transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {lang === 'ml' ? 'സൂക്ഷിച്ച ലേഖനങ്ങൾ കാണുക' : 'Read Saved Articles'}
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-200 hover:text-white rounded"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
