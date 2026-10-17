import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight, CheckCircle2, Navigation } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const typeColors = {
  HOSPITAL: 'bg-rose-50 text-rose-700 border-rose-200',
  PHC: 'bg-teal-50 text-teal-700 border-teal-200',
  CHC: 'bg-blue-50 text-blue-700 border-blue-200',
  CLINIC: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PHARMACY: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const FacilityCard = ({ facility }) => {
  const { lang, t } = useLanguage();

  const lat = facility.coordinates?.lat;
  const lng = facility.coordinates?.lng;
  const directionsUrl =
    lat && lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${facility.name}, ${facility.locality}, ${facility.district}`
        )}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Type & District */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              typeColors[facility.type] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {facility.type}
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {facility.district}
          </span>
        </div>

        {/* Facility Name */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition line-clamp-2">
          {facility.name}
        </h3>

        {/* Locality & Address */}
        <div className="flex items-start gap-2 text-xs text-slate-500 mt-2">
          <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{facility.address}</span>
        </div>

        {/* Opening Hours */}
        <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{facility.openingHours || '8:00 AM - 5:00 PM'}</span>
        </div>

        {/* Available Services (up to 3 pills) */}
        {facility.services && facility.services.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
            {facility.services.slice(0, 3).map((service, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded"
              >
                {service}
              </span>
            ))}
            {facility.services.length > 3 && (
              <span className="text-[10px] font-medium text-slate-400 self-center">
                +{facility.services.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${facility.contactNumber}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1.5 rounded-lg transition"
            title="Call Facility"
          >
            <Phone className="w-3 h-3 text-teal-700" />
            <span>{t('callNow')}</span>
          </a>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition"
            title="Get Directions"
          >
            <Navigation className="w-3 h-3" />
            <span className="hidden sm:inline">{t('getDirections')}</span>
          </a>
        </div>

        <Link
          to={`/services/${facility._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950 transition"
        >
          <span>{t('viewDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>
    </div>
  );
};
