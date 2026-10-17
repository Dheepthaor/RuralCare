import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Stethoscope, User, AlertCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AppointmentCard = ({ appointment, onCancel }) => {
  const { lang, t } = useLanguage();
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reason, setReason] = useState('');

  const statusStyles = {
    BOOKED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const handleConfirmCancel = async () => {
    setCancelling(true);
    await onCancel(appointment._id, reason);
    setCancelling(false);
    setShowCancelModal(false);
  };

  const isBooked = appointment.status === 'BOOKED';

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition">
        {/* Header: Reference & Status */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block tracking-wider uppercase">
              {t('bookingReference')}
            </span>
            <span className="font-mono text-sm font-bold text-teal-900">
              {appointment.appointmentRef}
            </span>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              statusStyles[appointment.status] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {appointment.status}
          </span>
        </div>

        {/* Doctor and Facility Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-y border-slate-100 text-sm">
          <div className="flex items-start gap-2.5">
            <Stethoscope className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">{appointment.doctor?.name || 'Assigned Medical Officer'}</p>
              <p className="text-xs text-teal-700 font-medium">
                {appointment.doctor?.speciality || 'General OPD'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">{appointment.facility?.name || 'Health Facility'}</p>
              <p className="text-xs text-slate-500">
                {appointment.facility?.locality}, {appointment.facility?.district}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule & Notes */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Calendar className="w-3.5 h-3.5 text-teal-700" />
              {appointment.appointmentDate}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              {appointment.timeSlot}
            </span>
          </div>

          {/* Cancellation Action */}
          {isBooked && onCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition"
            >
              {t('cancelAppointment')}
            </button>
          )}
        </div>

        {appointment.symptoms && (
          <div className="mt-3 text-xs bg-slate-50 text-slate-600 p-2.5 rounded-xl border border-slate-100">
            <strong className="text-slate-800">Symptoms noted:</strong> {appointment.symptoms}
          </div>
        )}

        {appointment.status === 'CANCELLED' && appointment.cancellationReason && (
          <div className="mt-3 text-xs bg-rose-50 text-rose-700 p-2.5 rounded-xl border border-rose-100">
            <strong>Cancellation note:</strong> {appointment.cancellationReason}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t('cancelAppointment')}</h3>
            </div>

            <p className="text-xs text-slate-600 mb-4">{t('confirmCancelPrompt')}</p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('cancelReasonLabel')}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Schedule conflict, feeling better, or visiting local clinic"
                rows={2}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition disabled:opacity-50"
              >
                {cancelling ? 'Releasing Slot...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
