import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Building2,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  User,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const BookAppointment = () => {
  const { doctorId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [doctorError, setDoctorError] = useState(null);

  // Guided Steps: 1 = Doctor Review, 2 = Date Picker, 3 = Slot Picker, 4 = Review & Symptoms, 5 = Server Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Booking selections
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');

  // Real-time slot availability from backend
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      setLoadingDoctor(true);
      setDoctorError(null);
      try {
        const res = await api.getDoctorById(doctorId);
        if (res.success) {
          setDoctor(res.doctor);
        }
      } catch (err) {
        setDoctorError(err.message || 'Doctor profile could not be loaded.');
      } finally {
        setLoadingDoctor(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate || !doctorId) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSlotError('');
      setSelectedSlot('');
      try {
        const res = await api.getDoctorAvailability(doctorId, selectedDate);
        if (res.success) {
          setAvailableSlots(res.slots || []);
        }
      } catch (err) {
        setSlotError(err.message || 'Could not fetch time slot availability.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, doctorId]);

  // Generate next 14 available days for date selection
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();

      // Check if doctor works on this day
      const fullDayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const isDoctorDay = doctor?.availableDays?.includes(fullDayName);

      if (isDoctorDay) {
        dates.push({
          dateStr: isoStr,
          dayName,
          monthName,
          dayNum,
          fullDayName,
        });
      }
    }
    return dates;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/book/${doctorId}`);
      return;
    }

    setSubmitting(true);
    setBookingError('');

    try {
      const res = await api.bookAppointment({
        doctorId: doctor._id,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        symptoms: symptoms.trim(),
      });

      if (res.success && res.appointment) {
        setConfirmedBooking(res.appointment);
        setCurrentStep(5); // Move to Step 5: Confirmed!
      }
    } catch (err) {
      if (err.status === 409 || err.code === 'SLOT_ALREADY_BOOKED') {
        setBookingError(
          'Conflict: This exact time slot was just booked by another patient. Please choose an alternate slot.'
        );
        setCurrentStep(3); // Back to slot selector
      } else {
        setBookingError(err.message || 'Booking failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) return <LoadingState message="Loading consultation booking wizard..." />;
  if (doctorError || !doctor) return <ErrorState message={doctorError} />;

  const availableDates = generateAvailableDates();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Wizard Progress Stepper */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 overflow-x-auto pb-2 sm:pb-0 gap-2">
          {[
            { step: 1, label: t('stepReviewDoctor') },
            { step: 2, label: t('stepSelectDate') },
            { step: 3, label: t('stepSelectSlot') },
            { step: 4, label: t('stepReviewPatient') },
            { step: 5, label: t('stepConfirmed') },
          ].map((s) => (
            <div
              key={s.step}
              className={`flex items-center gap-1.5 shrink-0 ${
                currentStep === s.step
                  ? 'text-teal-800 font-extrabold'
                  : currentStep > s.step
                  ? 'text-emerald-700'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === s.step
                    ? 'bg-teal-800 text-white'
                    : currentStep > s.step
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > s.step ? '✓' : s.step}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {bookingError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <strong className="block font-bold">Booking Unsuccessful</strong>
            <span>{bookingError}</span>
          </div>
        </div>
      )}

      {/* STEP 1: Review Doctor & Facility */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block mb-1">
              Step 1 of 5
            </span>
            <h2 className="text-xl font-bold text-slate-900">Review Doctor & Consultation Terms</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            <img
              src={doctor.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400'}
              alt={doctor.name}
              className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
              <p className="text-xs font-bold text-teal-800">{doctor.speciality}</p>
              <p className="text-xs text-slate-500">{doctor.qualifications}</p>
              <div className="pt-2 text-xs text-slate-600 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-700" />
                <span>
                  {doctor.facility?.name} ({doctor.facility?.locality}, {doctor.facility?.district})
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs text-slate-700 space-y-2">
            <div className="flex items-center justify-between font-bold text-teal-900">
              <span>Consultation Charge:</span>
              <span>{doctor.consultationFee === 0 ? 'Free (Govt PHC/CHC Policy)' : `₹${doctor.consultationFee}`}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              RuralCare guarantees zero booking commission. You are booking an official token slot at this medical facility.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-6 py-3 rounded-xl transition"
            >
              <span>Next: Select Date</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Date */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block mb-1">
                Step 2 of 5
              </span>
              <h2 className="text-xl font-bold text-slate-900">Select an Appointment Date</h2>
            </div>
            <span className="text-xs text-slate-500">Upcoming 14 Days</span>
          </div>

          <p className="text-xs text-slate-600">
            {doctor.name} is scheduled on: <strong>{doctor.availableDays?.join(', ')}</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {availableDates.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-teal-800 text-white border-teal-800 shadow-md ring-2 ring-teal-700/20'
                      : 'bg-slate-50 hover:bg-teal-50/60 text-slate-800 border-slate-200'
                  }`}
                >
                  <span className={`text-[11px] font-bold uppercase ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                    {item.dayName}
                  </span>
                  <span className="text-lg font-black">{item.dayNum}</span>
                  <span className={`text-[10px] font-medium ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                    {item.monthName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              disabled={!selectedDate}
              className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-6 py-3 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next: Select Time Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Select Time Slot */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block mb-1">
                Step 3 of 5
              </span>
              <h2 className="text-xl font-bold text-slate-900">Choose Available Consultation Slot</h2>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400 block">Date:</span>
              <strong className="text-teal-900 font-bold">{selectedDate}</strong>
            </div>
          </div>

          {loadingSlots ? (
            <LoadingState message="Checking active slot availability with server..." />
          ) : slotError ? (
            <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl">{slotError}</div>
          ) : (
            <div>
              <p className="text-xs text-slate-500 mb-4">
                Available slots are confirmed in real-time from the clinic database:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableSlots.map((slotObj) => {
                  const isAvailable = slotObj.isAvailable;
                  const isSelected = selectedSlot === slotObj.timeSlot;

                  return (
                    <button
                      key={slotObj.timeSlot}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlot(slotObj.timeSlot)}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-teal-800 text-white border-teal-800 shadow-md ring-2 ring-teal-700/20'
                          : isAvailable
                          ? 'bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-950 border-emerald-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-xs font-bold">{slotObj.timeSlot}</span>
                      <span
                        className={`text-[10px] font-semibold ${
                          isSelected
                            ? 'text-teal-200'
                            : isAvailable
                            ? 'text-emerald-700'
                            : 'text-rose-500'
                        }`}
                      >
                        {isAvailable ? 'Available' : 'Booked'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Date</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              disabled={!selectedSlot}
              className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-6 py-3 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next: Review & Confirm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review Patient Info & Symptoms */}
      {currentStep === 4 && (
        <form onSubmit={handleBookingSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block mb-1">
              Step 4 of 5
            </span>
            <h2 className="text-xl font-bold text-slate-900">Review Booking Details</h2>
          </div>

          {/* Authentication check notice */}
          {!isAuthenticated ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between gap-4">
              <div>
                <strong className="block font-bold">Sign In Required to Finalize Booking</strong>
                <span>Please log in to your patient account to reserve this consultation token.</span>
              </div>
              <Link
                to={`/login?redirect=/book/${doctorId}`}
                className="bg-amber-800 text-white px-3.5 py-2 rounded-xl font-bold shrink-0 hover:bg-amber-900"
              >
                Sign In Now
              </Link>
            </div>
          ) : (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 flex items-center gap-3">
              <User className="w-5 h-5 text-teal-700 shrink-0" />
              <div>
                <span className="text-[11px] text-teal-700 block">Booking on behalf of:</span>
                <strong className="text-sm font-bold">{user?.name}</strong> ({user?.email}) • {user?.phone || 'No phone recorded'}
              </div>
            </div>
          )}

          {/* Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block">Doctor:</span>
              <strong className="text-slate-800 font-bold">{doctor.name}</strong>
              <p className="text-[11px] text-teal-700">{doctor.speciality}</p>
            </div>
            <div>
              <span className="text-slate-400 block">Appointment Date:</span>
              <strong className="text-slate-800 font-bold">{selectedDate}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Confirmed Slot:</span>
              <strong className="text-slate-800 font-bold">{selectedSlot}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('symptomsLabel')}
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Mild continuous fever for 3 days, joint aches, or follow-up blood pressure review"
              rows={3}
              className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Slots</span>
            </button>

            <button
              type="submit"
              disabled={submitting || !isAuthenticated}
              className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-xl shadow-xs transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{submitting ? 'Locking Slot on Server...' : t('confirmBookingBtn')}</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: Server Confirmed Result */}
      {currentStep === 5 && confirmedBooking && (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 text-center space-y-6 shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              Server Confirmed
            </span>
            <h2 className="text-2xl font-black text-slate-900">{t('bookingSuccessTitle')}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your appointment slot is reserved in the hospital database.
            </p>
          </div>

          {/* Confirmation Voucher Box */}
          <div className="bg-slate-50 border-2 border-dashed border-teal-200 p-6 rounded-2xl max-w-md mx-auto text-left space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {t('bookingReference')}
              </span>
              <span className="font-mono text-lg font-black text-teal-900">
                {confirmedBooking.appointmentRef}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Patient:</span>
                <strong className="text-slate-800">{user?.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Doctor:</span>
                <strong className="text-slate-800">{doctor.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Date:</span>
                <strong className="text-slate-800">{confirmedBooking.appointmentDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Time Slot:</span>
                <strong className="text-slate-800">{confirmedBooking.timeSlot}</strong>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-500">
              📍 <strong>Location:</strong> {doctor.facility?.name}, {doctor.facility?.locality}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
            >
              <span>View in My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              <span>Print / Save Slip</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
