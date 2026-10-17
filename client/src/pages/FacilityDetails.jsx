import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Building2,
  Stethoscope,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { LeafletMap } from '../components/LeafletMap';
import { DoctorCard } from '../components/DoctorCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const FacilityDetails = () => {
  const { id } = useParams();
  const { lang, t } = useLanguage();

  const [facility, setFacility] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFacility = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getFacilityById(id);
      if (res.success) {
        setFacility(res.facility);
        setDoctors(res.doctors || []);
      }
    } catch (err) {
      setError(err.message || 'Healthcare facility could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacility();
  }, [id]);

  if (loading) return <LoadingState message="Loading healthcare facility profile..." />;
  if (error || !facility) return <ErrorState message={error} onRetry={fetchFacility} />;

  const lat = facility.coordinates?.lat;
  const lng = facility.coordinates?.lng;
  const directionsUrl =
    lat && lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${facility.name}, ${facility.locality}, ${facility.district}`
        )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Health Services Directory</span>
        </Link>
      </div>

      {/* Facility Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wider">
                {facility.type}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {facility.district} District
              </span>
              {facility.emergencyNumber && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                  24/7 Casualty Support
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {facility.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">{facility.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>{facility.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Operating Hours: {facility.openingHours || '8:00 AM - 5:00 PM'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 shrink-0 lg:w-72">
            <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Immediate Contact
            </span>

            <a
              href={`tel:${facility.contactNumber}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {facility.contactNumber}</span>
            </a>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition"
            >
              <Navigation className="w-4 h-4 text-teal-700" />
              <span>Open in Maps</span>
            </a>

            {facility.emergencyNumber && (
              <div className="pt-2 border-t border-slate-200 text-[11px] text-red-700 flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Emergency Casualty: {facility.emergencyNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services List and Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Services Provided */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-700" />
            <span>Available Medical Services</span>
          </h2>

          {facility.services && facility.services.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5">
              {facility.services.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 text-xs text-slate-800 font-medium border border-slate-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">General OPD and primary consultation available.</p>
          )}
        </div>

        {/* Facility Location Map */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-700" />
              <span>Facility Geo-Location</span>
            </h2>
            <span className="text-xs text-slate-400">
              {facility.locality}, {facility.district}
            </span>
          </div>

          <LeafletMap facilities={[facility]} selectedFacility={facility} />
        </div>
      </div>

      {/* Associated Medical Officers / Doctors */}
      <div className="space-y-6 pt-4">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-700" />
            <span>Doctors Stationed at this Facility</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Reserve an appointment slot in advance to avoid waiting at the registration desk.
          </p>
        </div>

        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={{ ...doctor, facility }} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">
              General duty medical officers rotate at this facility. In-person walk-in OPD is open daily.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
