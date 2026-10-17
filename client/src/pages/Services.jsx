import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  List,
  Map as MapIcon,
  RotateCcw,
  Navigation,
  Building2,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { FacilityCard } from '../components/FacilityCard';
import { LeafletMap } from '../components/LeafletMap';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const Services = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'ALL');
  const [district, setDistrict] = useState(searchParams.get('district') || 'ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [locating, setLocating] = useState(false);
  const [userLocationNote, setUserLocationNote] = useState('');

  const fetchFacilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (type !== 'ALL') params.type = type;
      if (district !== 'ALL') params.district = district;

      const res = await api.getFacilities(params);
      if (res.success) {
        setFacilities(res.facilities);
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to healthcare facilities registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [type, district]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFacilities();
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('ALL');
    setDistrict('ALL');
    setUserLocationNote('');
    setSearchParams({});
  };

  // Optional Geolocation trigger (only requested when user explicitly clicks)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your current browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const { latitude, longitude } = position.coords;
        setUserLocationNote(`Coordinates obtained (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
        setViewMode('map');
      },
      (err) => {
        setLocating(false);
        alert(
          'Location access was declined or timed out. Please select your district from the dropdown filter.'
        );
      },
      { timeout: 10000 }
    );
  };

  const districtsList = ['ALL', 'Wayanad', 'Palakkad', 'Idukki', 'Kozhikode', 'Malappuram'];
  const typesList = [
    { value: 'ALL', label: 'All Facility Types' },
    { value: 'PHC', label: 'Primary Health Centre (PHC)' },
    { value: 'CHC', label: 'Community Health Centre (CHC)' },
    { value: 'HOSPITAL', label: 'Taluk / District Hospital' },
    { value: 'PHARMACY', label: 'Jan Aushadhi Pharmacy' },
    { value: 'CLINIC', label: 'Specialty Rural Clinic' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block mb-1">
            Directory & Discovery
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'ml' ? 'ഗ്രാമീണ ആരോഗ്യ കേന്ദ്രങ്ങൾ' : 'Rural Health Service Finder'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Locate government primary health centres, taluk referral hospitals, and medicine dispensaries.
          </p>
        </div>

        {/* View Mode Toggle (List vs Map) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'list'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'map'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>OpenStreetMap</span>
            </button>
          </div>

          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold px-3 py-2 rounded-xl transition"
            title="Use device location to find nearest facility"
          >
            <Navigation className="w-3.5 h-3.5 text-teal-700" />
            <span>{locating ? 'Locating...' : 'Locate Me'}</span>
          </button>
        </div>
      </div>

      {userLocationNote && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 text-xs px-4 py-2 rounded-xl flex items-center justify-between">
          <span>📍 {userLocationNote}</span>
          <button
            onClick={() => setUserLocationNote('')}
            className="text-teal-700 font-bold hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by facility name, locality, or services (e.g. anti-venom, maternity)..."
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

        {/* Quick Filter Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Type selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">Type:</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              >
                {typesList.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* District selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">District:</span>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              >
                {districtsList.map((d) => (
                  <option key={d} value={d}>
                    {d === 'ALL' ? 'All Districts' : d}
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

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Fetching healthcare facilities..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchFacilities} />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{facilities.length}</strong> healthcare centres
            </span>
          </div>

          {viewMode === 'map' && (
            <div className="space-y-4">
              <LeafletMap facilities={facilities} />
              <p className="text-xs text-slate-400 text-center">
                Click on any pin to view facility hours, direct phone number, and directions.
              </p>
            </div>
          )}

          {facilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <FacilityCard key={facility._id} facility={facility} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No Facilities Match Your Criteria</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try selecting "All Districts" or clearing search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
