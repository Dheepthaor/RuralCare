import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    appointmentRef: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient is required'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required'],
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: [true, 'Facility is required'],
    },
    appointmentDate: {
      type: String, // ISO date string 'YYYY-MM-DD'
      required: [true, 'Appointment date is required'],
      trim: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['BOOKED', 'COMPLETED', 'CANCELLED'],
      default: 'BOOKED',
    },
    isActiveSlot: {
      type: Boolean,
      default: true,
      index: true,
    },
    symptoms: {
      type: String,
      trim: true,
      default: '',
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: '',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Database-level compound unique index on active slots
// When isActiveSlot is true, only ONE document can exist for (doctor, appointmentDate, timeSlot).
// When an appointment is cancelled, isActiveSlot is set to false, allowing the slot to be booked again.
appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { isActiveSlot: true },
  }
);

appointmentSchema.index({ patient: 1, createdAt: -1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
