import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Clock,
  WifiOff,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { getSavedArticles, saveArticleOffline, removeArticleOffline, isArticleSaved } from '../utils/offlineDb';
import { LoadingState } from '../components/LoadingState';

export const HealthInfo = () => {
  const { lang, t } = useLanguage();

  const [articles, setArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'saved'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setActiveTab('saved'); // Auto switch to saved articles when offline
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadSavedArticles = async () => {
    try {
      const items = await getSavedArticles();
      setSavedArticles(items);
      setSavedIds(new Set(items.map((i) => i._id)));
    } catch (err) {
      console.error('Failed to load saved offline articles:', err);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();

      const res = await api.getArticles(params);
      if (res.success) {
        setArticles(res.articles);
      }
    } catch (err) {
      console.warn('Network fetch failed; falling back to offline articles:', err);
      setActiveTab('saved');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedArticles();
    if (navigator.onLine) {
      fetchArticles();
    } else {
      setActiveTab('saved');
      setLoading(false);
    }
  }, [selectedCategory]);

  const handleToggleSave = async (e, article) => {
    e.preventDefault();
    e.stopPropagation();

    const id = article._id;
    if (savedIds.has(id)) {
      await removeArticleOffline(id);
      savedIds.delete(id);
      setSavedIds(new Set(savedIds));
    } else {
      await saveArticleOffline(article);
      savedIds.add(id);
      setSavedIds(new Set(savedIds));
    }
    await loadSavedArticles();
  };

  const categories = [
    { value: 'ALL', label: 'All Topics' },
    { value: 'FIRST_AID', label: 'First Aid & Snakebite' },
    { value: 'PREVENTIVE', label: 'Monsoon Fevers & NCDs' },
    { value: 'MATERNAL', label: 'Maternal Nutrition' },
    { value: 'HYGIENE', label: 'Drinking Water & Sanitation' },
    { value: 'CHILD_HEALTH', label: 'Child Health' },
    { value: 'GENERAL', label: 'General Wellness' },
  ];

  const displayedArticles = activeTab === 'saved' ? savedArticles : articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block mb-1">
            Preventive & First Aid Education
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'ml' ? 'പൊതുജനാരോഗ്യ ലൈബ്രറി' : 'Rural Public Health Library'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Practical health guides you can save and read anywhere, even without mobile reception.
          </p>
        </div>

        {/* Tab switcher: All Articles vs Saved Offline */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>All Articles</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'saved'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Saved Offline ({savedArticles.length})</span>
          </button>
        </div>
      </div>

      {/* Offline Status Notice */}
      {!isOnline && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
          <WifiOff className="w-5 h-5 text-amber-700 shrink-0" />
          <div>
            <strong>Offline Mode Active:</strong> You are browsing previously saved articles from your device’s IndexedDB storage.
          </div>
        </div>
      )}

      {/* Search and Category Filter (only active in 'all' tab) */}
      {activeTab === 'all' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchArticles();
            }}
            className="flex gap-3"
          >
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by title or keyword (e.g. snakebite, fever, nutrition)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition shrink-0"
            >
              Search
            </button>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition border ${
                  selectedCategory === c.value
                    ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {loading ? (
        <LoadingState message="Loading health guidance articles..." />
      ) : displayedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article) => {
            const isSaved = savedIds.has(article._id);
            const title =
              lang === 'ml' && article.malayalamTitle ? article.malayalamTitle : article.title;
            const summary =
              lang === 'ml' && article.malayalamSummary
                ? article.malayalamSummary
                : article.summary;

            return (
              <div
                key={article._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wider">
                      {article.category}
                    </span>

                    <button
                      onClick={(e) => handleToggleSave(e, article)}
                      className={`p-1.5 rounded-lg border transition ${
                        isSaved
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                      }`}
                      title={isSaved ? 'Saved for Offline Reading' : 'Save for Offline'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <Link to={`/health-info/${article.slug || article._id}`}>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition line-clamp-2 mb-2">
                      {title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTimeMinutes || 4} min read</span>
                  </div>

                  <Link
                    to={`/health-info/${article.slug || article._id}`}
                    className="inline-flex items-center gap-1 text-teal-800 font-bold hover:text-teal-950 transition"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-md mx-auto space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            {activeTab === 'saved' ? 'No Saved Articles Yet' : 'No Articles Found'}
          </h3>
          <p className="text-xs text-slate-500">
            {activeTab === 'saved'
              ? 'Click the bookmark icon on any article to store it in your device for reading in no-network zones.'
              : 'Try clearing your category filter or search keywords.'}
          </p>
        </div>
      )}

      {/* Medical Disclaimer Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t('medicalDisclaimer')}</p>
      </div>
    </div>
  );
};
