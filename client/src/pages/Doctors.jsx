import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Stethoscope, Filter, RotateCcw, Building2 } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { DoctorCard } from '../components/DoctorCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const Doctors = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [speciality, setSpeciality] = useState(searchParams.get('speciality') || 'ALL');
  const [language, setLanguage] = useState(searchParams.get('language') || 'ALL');

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (speciality !== 'ALL') params.speciality = speciality;
      if (language !== 'ALL') params.language = language;

      const res = await api.getDoctors(params);
      if (res.success) {
        setDoctors(res.doctors);
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to doctors directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [speciality, language]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSpeciality('ALL');
    setLanguage('ALL');
    setSearchParams({});
  };

  const specialitiesList = [
    'ALL',
    'General Medicine',
    'Pediatrics',
    'Obstetrics & Gynecology',
    'Community Health & Nutrition',
    'Orthopedics & Trauma',
    'Family Medicine & Diabetology',
  ];

  const languagesList = ['ALL', 'Malayalam', 'English', 'Tamil'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block mb-1">
          Medical Practitioners
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {lang === 'ml' ? 'ഗ്രാമീണ ഡോക്ടർമാർ' : 'Rural Doctor Directory'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore certified medical officers, consultation days, and schedule your appointment online.
        </p>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor name or specialty (e.g. Anand, Pediatrics, Diabetology)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-700 focus:outline-hidden transition"
            />
          </div>

          <button
            type="submit"
            className="bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Speciality filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">Speciality:</span>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              >
                {specialitiesList.map((s) => (
                  <option key={s} value={s}>
                    {s === 'ALL' ? 'All Specialities' : s}
                  </option>
                ))}
              </select>
            </div>

            {/* Language filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              >
                {languagesList.map((l) => (
                  <option key={l} value={l}>
                    {l === 'ALL' ? 'All Languages' : l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-teal-800 font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Main Doctors List */}
      {loading ? (
        <LoadingState message="Loading doctor profiles..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDoctors} />
      ) : (
        <div className="space-y-6">
          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{doctors.length}</strong> medical officers
          </div>

          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No Doctors Found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                No doctors matched your specialty or keyword criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
