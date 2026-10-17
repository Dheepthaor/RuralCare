import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Building2, Calendar, Languages, ArrowRight, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DoctorCard = ({ doctor }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-4 mb-4">
          {/* Doctor Image or Avatar */}
          <div className="relative shrink-0">
            {doctor.profileImage ? (
              <img
                src={doctor.profileImage}
                alt={doctor.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-xs"
                loading="lazy"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold text-lg">
                {doctor.name
                  .replace('Dr. ', '')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white shadow-xs" title="Verified Practitioner" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition truncate">
              {doctor.name}
            </h3>
            <p className="text-xs font-semibold text-teal-700 mt-0.5">{doctor.speciality}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{doctor.qualifications}</p>
          </div>
        </div>

        {/* Facility Info */}
        {doctor.facility && (
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
            <Building2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="truncate">
              {doctor.facility.name} ({doctor.facility.locality})
            </span>
          </div>
        )}

        {/* Schedule & Languages */}
        <div className="space-y-1.5 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {doctor.availableDays && doctor.availableDays.length === 6
                ? 'Mon - Sat (Regular OPD)'
                : doctor.availableDays?.join(', ')}
            </span>
          </div>

          {doctor.languages && doctor.languages.length > 0 && (
            <div className="flex items-center gap-2">
              <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{doctor.languages.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Fee & Booking CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('fee')}</span>
          <span className="text-xs font-bold text-slate-800">
            {doctor.consultationFee === 0 ? (
              <span className="text-emerald-700">{t('freeGovt')}</span>
            ) : (
              `₹${doctor.consultationFee}`
            )}
          </span>
        </div>

        <Link
          to={`/book/${doctor._id}`}
          className="inline-flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition group-hover:scale-[1.02]"
        >
          <span>{t('bookAppointment')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
