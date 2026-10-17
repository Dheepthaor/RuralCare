import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Clock,
  Calendar,
  ShieldCheck,
  Globe,
  Share2,
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { isArticleSaved, saveArticleOffline, removeArticleOffline, getSavedArticles } from '../utils/offlineDb';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const HealthArticleDetails = () => {
  const { id } = useParams();
  const { lang: globalLang, t } = useLanguage();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [articleLang, setArticleLang] = useState(globalLang); // Article-level language toggle

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);

    // If offline, check IndexedDB first
    if (!navigator.onLine) {
      try {
        const savedList = await getSavedArticles();
        const found = savedList.find((a) => a.slug === id || a._id === id);
        if (found) {
          setArticle(found);
          setIsSaved(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Failed reading IndexedDB offline:', err);
      }
    }

    try {
      const res = await api.getArticle(id);
      if (res.success) {
        setArticle(res.article);
        const saved = await isArticleSaved(res.article._id);
        setIsSaved(saved);
      }
    } catch (err) {
      // If network fails, attempt fallback to IndexedDB
      try {
        const savedList = await getSavedArticles();
        const found = savedList.find((a) => a.slug === id || a._id === id);
        if (found) {
          setArticle(found);
          setIsSaved(true);
          setLoading(false);
          return;
        }
      } catch (e) {}

      setError(err.message || 'Article could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const handleToggleSave = async () => {
    if (!article) return;
    if (isSaved) {
      await removeArticleOffline(article._id);
      setIsSaved(false);
    } else {
      await saveArticleOffline(article);
      setIsSaved(true);
    }
  };

  if (loading) return <LoadingState message="Loading health guidance article..." />;
  if (error || !article) return <ErrorState message={error} onRetry={fetchArticle} />;

  const isMalayalam = articleLang === 'ml' && article.malayalamContent;
  const currentTitle = isMalayalam ? article.malayalamTitle : article.title;
  const currentSummary = isMalayalam ? article.malayalamSummary : article.summary;
  const currentContent = isMalayalam ? article.malayalamContent : article.content;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/health-info"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Health Library</span>
        </Link>
      </div>

      {/* Main Article Container */}
      <article className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wider">
              {article.category}
            </span>

            {/* Language toggle button for this article */}
            {article.malayalamContent && (
              <button
                onClick={() => setArticleLang(articleLang === 'en' ? 'ml' : 'en')}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-teal-700" />
                <span>{articleLang === 'en' ? 'മലയാളത്തിൽ വായിക്കുക' : 'Read in English'}</span>
              </button>
            )}
          </div>

          {/* Save for offline button */}
          <button
            onClick={handleToggleSave}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl border transition ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <span>Saved for Offline</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save for Offline</span>
              </>
            )}
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
          {currentTitle}
        </h1>

        {/* Summary callout */}
        <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs sm:text-sm text-teal-950 font-medium leading-relaxed">
          {currentSummary}
        </div>

        {/* Attribution Bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-slate-100 pb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated: {new Date(article.lastUpdated || article.updatedAt).toLocaleDateString()}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.readTimeMinutes || 4} min read</span>
          </span>
          <span className="text-slate-500 font-medium">Source: {article.sourceAttribution}</span>
        </div>

        {/* Article Body Content */}
        <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-normal">
          {currentContent}
        </div>

        {/* Footer Medical Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 flex items-start gap-3 bg-slate-50 p-4 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Clinical Disclaimer:</strong> This article is published for community health literacy and general first aid guidance. It does not replace direct diagnosis or treatment by a licensed physician. If acute symptoms or life-threatening reactions occur, contact emergency helpline 108 or report directly to the nearest hospital casualty.
          </p>
        </div>
      </article>
    </div>
  );
};
