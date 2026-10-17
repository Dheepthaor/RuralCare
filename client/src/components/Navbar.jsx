import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  PhoneCall,
  Globe,
  Menu,
  X,
  User,
  ShieldAlert,
  Calendar,
  LogOut,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: t('navHome') },
    { to: '/services', label: t('navServices') },
    { to: '/doctors', label: t('navDoctors') },
    { to: '/emergency', label: t('navEmergency'), badge: '108' },
    { to: '/health-info', label: t('navHealthInfo') },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-sm group-hover:bg-teal-900 transition">
              <HeartPulse className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-teal-950 flex items-center gap-1.5">
                {t('brand')}
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              </span>
              <p className="text-[11px] font-medium text-slate-500 -mt-0.5 hidden sm:block">
                {lang === 'ml' ? 'ഗ്രാമീണ ആരോഗ്യവേദി' : 'Rural Healthcare Platform'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-600 hover:text-teal-800 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
                {link.badge && (
                  <span className="bg-red-100 text-red-700 text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Online / Offline badge */}
            <div
              className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={isOnline ? 'Online mode connected' : 'Offline mode active'}
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px]">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Offline</span>
                </>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200"
              title="Toggle English / Malayalam"
            >
              <Globe className="w-3.5 h-3.5 text-teal-700" />
              <span>{lang === 'en' ? 'മലയാളം' : 'English'}</span>
            </button>

            {/* Emergency Helpline direct call */}
            <a
              href="tel:108"
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs transition"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span>108 Kanivu</span>
            </a>

            {/* Authentication States */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-lg text-sm font-semibold text-teal-900 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name?.split(' ')[0]}</span>
                  {isAdmin && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-800"
                    >
                      <Calendar className="w-4 h-4 text-teal-600" />
                      {t('navDashboard')}
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 font-medium"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        {t('navAdmin')}
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('navLogout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-teal-800 hover:text-teal-950 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 px-3.5 py-2 rounded-lg shadow-xs transition"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLanguage}
              className="p-2 text-xs font-bold text-teal-800 bg-teal-50 rounded-lg"
            >
              {lang === 'en' ? 'മല' : 'EN'}
            </button>
            <a
              href="tel:108"
              className="p-2 text-white bg-red-600 rounded-lg"
              title="Call 108"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-500">
            <span>Status: {isOnline ? 'Online' : 'Offline'}</span>
            <span className="font-semibold text-teal-800">
              {lang === 'ml' ? 'മലയാളം തിരഞ്ഞെടുത്തിരിക്കുന്നു' : 'English selected'}
            </span>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-base font-semibold ${
                    isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center justify-between">
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg">
                  <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-teal-800 hover:bg-teal-50"
                >
                  {t('navDashboard')}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-amber-700 hover:bg-amber-50"
                  >
                    {t('navAdmin')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  {t('navLogout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-teal-900 bg-slate-100 rounded-lg"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-white bg-teal-800 rounded-lg"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
