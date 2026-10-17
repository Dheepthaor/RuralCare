import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  BookmarkCheck,
  LogOut,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  FileText,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getSavedArticles, removeArticleOffline } from '../utils/offlineDb';
import { AppointmentCard } from '../components/AppointmentCard';
import { LoadingState } from '../components/LoadingState';

export const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading, logout, updateUserProfile } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/dashboard');
    }
  }, [authLoading, isAuthenticated]);

  const loadData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [apptRes, articles] = await Promise.all([
        api.getMyAppointments(),
        getSavedArticles(),
      ]);

      if (apptRes.success) setAppointments(apptRes.appointments);
      setSavedArticles(articles);

      if (user) {
        setProfileName(user.name || '');
        setProfilePhone(user.phone || '');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated, user]);

  const handleCancelAppointment = async (id, reason) => {
    try {
      const res = await api.cancelAppointment(id, reason);
      if (res.success) {
        setToastMessage('Appointment cancelled successfully. Slot freed for other patients.');
        await loadData();
        setTimeout(() => setToastMessage(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment.');
    }
  };

  const handleRemoveSavedArticle = async (id) => {
    await removeArticleOffline(id);
    const updated = await getSavedArticles();
    setSavedArticles(updated);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await api.updateProfile({ name: profileName, phone: profilePhone });
      if (res.success) {
        updateUserProfile(res.user);
        setEditingProfile(false);
        setToastMessage('Profile details updated successfully.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Profile update failed.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (authLoading || loading) return <LoadingState message="Loading your patient dashboard..." />;

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'BOOKED' && a.appointmentDate >= todayStr
  );
  const pastAppointments = appointments.filter(
    (a) => a.status !== 'BOOKED' || a.appointmentDate < todayStr
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {lang === 'ml' ? 'രോഗിയുടെ പ്രൊഫൈൽ' : 'Patient Portal'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-teal-200/80">
            {user?.email} • Role: {user?.role}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Appointments (Upcoming & Past) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Upcoming Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-700" />
                <span>Upcoming Appointments ({upcomingAppointments.length})</span>
              </h2>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appt) => (
                  <AppointmentCard
                    key={appt._id}
                    appointment={appt}
                    onCancel={handleCancelAppointment}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No Upcoming Appointments</p>
                <p className="text-xs text-slate-400">
                  You do not have any active doctor consultations scheduled.
                </p>
                <Link
                  to="/doctors"
                  className="inline-block mt-2 text-xs font-bold text-teal-800 hover:underline"
                >
                  Browse doctors & reserve a slot →
                </Link>
              </div>
            )}
          </div>

          {/* Past / History Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" />
                <span>Past & Cancelled Bookings ({pastAppointments.length})</span>
              </h2>
            </div>

            {pastAppointments.length > 0 ? (
              <div className="space-y-4">
                {pastAppointments.map((appt) => (
                  <AppointmentCard key={appt._id} appointment={appt} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
                No past appointment history recorded.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile & Saved Offline Articles */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-700" />
                <span>Profile Details</span>
              </h3>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="text-xs text-teal-800 font-bold hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {editingProfile ? (
              <form onSubmit={handleProfileUpdate} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="px-3 py-1.5 text-slate-500 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="px-3 py-1.5 bg-teal-800 text-white rounded-lg font-bold"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <span className="font-bold text-slate-800">{user?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address</span>
                  <span className="font-bold text-slate-800">{user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone Contact</span>
                  <span className="font-bold text-slate-800">{user?.phone || 'Not provided'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Saved Offline Articles in IndexedDB */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <span>Saved Offline Articles</span>
              </h3>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {savedArticles.length}
              </span>
            </div>

            {savedArticles.length > 0 ? (
              <div className="space-y-3">
                {savedArticles.map((article) => (
                  <div
                    key={article._id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2 text-xs"
                  >
                    <div className="flex-1">
                      <Link
                        to={`/health-info/${article.slug || article._id}`}
                        className="font-bold text-slate-800 hover:text-teal-800 line-clamp-1 block"
                      >
                        {article.title}
                      </Link>
                      <span className="text-[10px] text-slate-400">
                        Saved: {new Date(article.savedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveSavedArticle(article._id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Remove from offline storage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                No health guides saved offline yet. Bookmark articles from the Health Library.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
