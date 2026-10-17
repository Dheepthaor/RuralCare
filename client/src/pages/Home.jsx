import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  PhoneCall,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Building2,
  Clock,
  Sparkles,
  WifiOff,
  Users,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { FacilityCard } from '../components/FacilityCard';
import { DoctorCard } from '../components/DoctorCard';
import { LoadingState } from '../components/LoadingState';

export const Home = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facRes, docRes] = await Promise.all([
          api.getFacilities({ limit: 3 }),
          api.getDoctors({ limit: 3 }),
        ]);

        if (facRes.success) setFacilities(facRes.facilities);
        if (docRes.success) setDoctors(docRes.doctors);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const featureCards = [
    {
      title: t('pillarServicesTitle'),
      desc: t('pillarServicesDesc'),
      icon: Building2,
      link: '/services',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      badge: 'PHCs & Hospitals',
    },
    {
      title: t('pillarBookingTitle'),
      desc: t('pillarBookingDesc'),
      icon: Calendar,
      link: '/doctors',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badge: 'Zero Waiting Queue',
    },
    {
      title: t('pillarEmergencyTitle'),
      desc: t('pillarEmergencyDesc'),
      icon: PhoneCall,
      link: '/emergency',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      badge: 'Direct 108 Call',
    },
    {
      title: t('pillarOfflineTitle'),
      desc: t('pillarOfflineDesc'),
      icon: BookOpen,
      link: '/health-info',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      badge: 'No Internet Needed',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-teal-900/10 via-slate-50 to-slate-50 pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-slate-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/80 px-3 py-1.5 rounded-full text-xs font-bold text-teal-800">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {lang === 'ml'
                    ? 'കേരളത്തിലെ ഗ്രാമീണ ആരോഗ്യ മുന്നേറ്റം'
                    : 'Rural Health Initiative for Kerala'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {t('heroHeading')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('heroSubheading')}
              </p>

              {/* Prominent Facility Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto lg:mx-0"
              >
                <div className="flex items-center gap-2.5 px-3 w-full flex-1">
                  <Search className="w-5 h-5 text-teal-700 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchFacilityPlaceholder')}
                    className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-xs transition"
                >
                  <span>{t('searchAction')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick district search pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Quick Areas:</span>
                {['Wayanad', 'Palakkad (Attappady)', 'Idukki (Munnar)', 'Sulthan Bathery'].map(
                  (district) => (
                    <button
                      key={district}
                      onClick={() =>
                        navigate(
                          `/services?district=${encodeURIComponent(
                            district.split(' ')[0]
                          )}`
                        )
                      }
                      className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-700 hover:text-teal-800 transition font-medium text-[11px]"
                    >
                      📍 {district}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Right Hero Visual: Rural Healthcare Scene */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
                    alt="Rural healthcare doctor and patient consultation"
                    className="w-full h-80 sm:h-96 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="inline-block bg-teal-600/90 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                      Direct Community Care
                    </span>
                    <p className="text-sm font-bold">
                      Connecting tea-estate workers & rural hamlets with verified medical officers
                    </p>
                  </div>
                </div>

                {/* Floating Emergency Badge */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Ambulance Line
                    </span>
                    <a
                      href="tel:108"
                      className="text-sm font-black text-red-600 hover:underline"
                    >
                      Dial 108 Kanivu ↗
                    </a>
                  </div>
                </div>

                {/* Floating Offline Badge */}
                <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Offline Guides
                    </span>
                    <span className="text-xs font-bold text-teal-900">
                      Saved in Browser
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Core Pillars / Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'ml' ? 'പ്രധാന സേവനങ്ങൾ' : 'Core Healthcare Pillars'}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Designed specifically for geographical accessibility and low-bandwidth rural conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.link}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-teal-700/50 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-teal-800 group-hover:translate-x-1 transition">
                  <span>{t('viewDetails')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Nearby Healthcare Facilities (from Backend) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified Institutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'ml' ? 'സമീപത്തെ ആരോഗ്യ കേന്ദ്രങ്ങൾ' : 'Public Healthcare Facilities'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Taluk hospitals, Community Health Centres, and Primary Health Centres ready to serve.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-50 px-4 py-2.5 rounded-xl border border-teal-200 transition shrink-0"
          >
            <span>View All Facilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Loading facilities from database..." />
        ) : facilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <FacilityCard key={facility._id} facility={facility} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">No facilities registered in the database yet.</p>
          </div>
        )}
      </section>

      {/* 4. Featured Doctors (from Backend) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Certified Medical Officers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'ml' ? 'ഡോക്ടർമാരുടെ വിവരങ്ങൾ' : 'Featured Medical Practitioners'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a doctor to inspect available daily OPD consultation time slots.
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-50 px-4 py-2.5 rounded-xl border border-teal-200 transition shrink-0"
          >
            <span>All Doctors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Loading doctor directory..." />
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">No doctor profiles available at this time.</p>
          </div>
        )}
      </section>

      {/* 5. How It Works Section */}
      <section className="bg-teal-950 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {lang === 'ml' ? 'റൂറൽ കെയർ എങ്ങനെ പ്രവർത്തിക്കുന്നു?' : 'How RuralCare Works'}
            </h2>
            <p className="text-xs sm:text-sm text-teal-200/80 mt-2">
              Empowering patients without technical complexity or prolonged waiting lines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Search Nearest Facility',
                desc: 'Find government PHCs, CHCs, or Taluk hospitals in your taluk or district with one tap.',
              },
              {
                step: '02',
                title: 'Pick Doctor & Date',
                desc: 'Browse verified medical officers, their specialty, and select an open consultation slot.',
              },
              {
                step: '03',
                title: 'Get Instant Reference',
                desc: 'Receive your server-confirmed appointment token (e.g. RC-2026-XXXX) right on your phone.',
              },
              {
                step: '04',
                title: 'Access Care & Offline Guides',
                desc: 'Visit during your confirmed slot, or read saved health guides even if phone signal drops.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-teal-900/40 p-6 rounded-2xl border border-teal-800/60 relative"
              >
                <span className="text-3xl font-black text-emerald-400/40 block mb-3 font-mono">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-teal-100/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Health Awareness & Offline Access Promotion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline-First Progressive Web App</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Save Critical Health Guides for Mountain Travel
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              Mobile reception often drops along forest roads, high-range tea estates, and tribal belts. RuralCare lets you save first aid, snakebite protocols, and child nutrition articles directly into your device storage for instant offline viewing.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/health-info"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-teal-900 text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition"
              >
                <BookOpen className="w-4 h-4 text-teal-700" />
                <span>Explore Health Library</span>
              </Link>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-sm w-full space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">Offline Guides Included:</h4>
            <div className="space-y-2 text-teal-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Snakebite First Aid & Anti-venom steps</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Monsoon Fever (Dengue & Rat Fever) care</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Maternal nutrition in remote settlements</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Drinking water hygiene & chlorination</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Trust and Accessibility Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Zero Hidden Charges</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  RuralCare does not charge patients any booking fees. Consultations at Government PHCs and CHCs are 100% free under national health mission guidelines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Patient Privacy Protection</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Your appointment history is protected with server-validated authorization. No sensitive health records are stored in public browser caches.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Direct Telephone Links</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Every ambulance and emergency helpline connects directly through your device telephone dialer for immediate voice communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
