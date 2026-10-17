import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  AlertOctagon,
  ShieldAlert,
  Info,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Ambulance,
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { LoadingState } from '../components/LoadingState';

export const Emergency = () => {
  const { lang, t } = useLanguage();
  const [ambulances, setAmbulances] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        const [ambRes, facRes] = await Promise.all([
          api.getAmbulanceContacts(selectedDistrict !== 'ALL' ? { district: selectedDistrict } : {}),
          api.getFacilities({ limit: 4 }),
        ]);

        if (ambRes.success) setAmbulances(ambRes.contacts);
        if (facRes.success) setFacilities(facRes.facilities.filter((f) => f.emergencyNumber));
      } catch (err) {
        console.error('Failed to load emergency contacts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyData();
  }, [selectedDistrict]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. High Visibility Urgent Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-red-500/30">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-red-100">
              <AlertOctagon className="w-4 h-4 animate-pulse text-amber-300" />
              <span>Immediate Medical Emergency Action</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {lang === 'ml' ? 'അടിയന്തര ആംബുലൻസ് സഹായം' : 'Emergency & Ambulance Assistance'}
            </h1>
            <p className="text-sm sm:text-base text-red-100 leading-relaxed">
              If someone is severely injured, unresponsive, experiencing acute chest pain, or has suffered a snakebite, initiate an immediate direct phone call to Kerala’s centralized emergency dispatch.
            </p>
          </div>

          {/* Large Mobile Friendly Call Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href="tel:108"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-red-700 text-lg font-black px-8 py-5 rounded-2xl shadow-2xl transition transform hover:scale-105"
            >
              <PhoneCall className="w-6 h-6 animate-bounce" />
              <span>Call 108 Kanivu</span>
            </a>

            <a
              href="tel:1056"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-950/70 hover:bg-red-950 text-white border border-red-400/40 text-sm font-bold px-5 py-5 rounded-2xl transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>DISHA 1056</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Critical Operator Communication Checklist */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-amber-900">
          <Info className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="text-base font-bold">{t('emergencyNoticeTitle')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-950">
          <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
            <span className="font-bold text-amber-800 block">1. Location & Landmark:</span>
            <p className="text-slate-600 leading-relaxed">{t('emergencyNotice1')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
            <span className="font-bold text-amber-800 block">2. Patient Vital Signs:</span>
            <p className="text-slate-600 leading-relaxed">{t('emergencyNotice2')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
            <span className="font-bold text-amber-800 block">3. Road Accessibility:</span>
            <p className="text-slate-600 leading-relaxed">{t('emergencyNotice3')}</p>
          </div>
        </div>

        <p className="text-[11px] text-amber-800/80 italic pt-1">
          Technical notice: Clicking telephone buttons connects your phone’s regular voice dialer. This application does not pretend to perform automated GPS vehicle dispatch or tracking.
        </p>
      </div>

      {/* 3. Verified Emergency & Ambulance Contacts */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-teal-700" />
              <span>Ambulance Directory by Region</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified state emergency helplines and rural mountain 4WD emergency units.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-600">Filter District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            >
              <option value="ALL">All Kerala & Statewide</option>
              <option value="Wayanad">Wayanad</option>
              <option value="Palakkad">Palakkad (Attappady)</option>
              <option value="Idukki">Idukki (Munnar)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingState message="Fetching emergency contacts..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambulances.map((item) => {
              const isDemo = item.verificationStatus === 'DEMO_DATA';
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {item.vehicleType.replace(/_/g, ' ')}
                      </span>
                      {isDemo ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Demonstration Unit
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified Active
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">{item.displayName}</h3>
                    <p className="text-xs text-slate-500 mb-3">📍 {item.serviceArea}</p>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                      {item.notes}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-400">
                      Checked: {new Date(item.lastVerifiedDate).toLocaleDateString()}
                    </div>

                    <a
                      href={`tel:${item.telephoneNumber}`}
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{item.telephoneNumber}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. 24x7 Emergency Casualty Hospitals */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-700" />
            <span>24/7 Hospital Casualty Units</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key government medical institutions equipped with trauma units and anti-snake venom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facilities.map((fac) => (
            <div
              key={fac._id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  📍 {fac.locality}, {fac.district}
                </p>
                <span className="text-[11px] text-red-600 font-bold block mt-1">
                  Casualty Line: {fac.emergencyNumber || fac.contactNumber}
                </span>
              </div>

              <a
                href={`tel:${fac.emergencyNumber || fac.contactNumber}`}
                className="inline-flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Casualty</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
