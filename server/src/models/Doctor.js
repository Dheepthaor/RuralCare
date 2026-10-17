import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    speciality: {
      type: String,
      required: [true, 'Speciality is required'],
      trim: true,
      default: 'General Medicine',
    },
    qualifications: {
      type: String,
      required: [true, 'Qualifications are required'],
      trim: true,
      default: 'MBBS (Demo Credential)',
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: [true, 'Facility is required'],
    },
    languages: {
      type: [String],
      default: ['Malayalam', 'English'],
    },
    consultationFee: {
      type: Number,
      default: 0, // Free at government PHCs/CHCs or demo fee
      min: 0,
    },
    profileImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: 'Dedicated rural medical officer providing primary healthcare and community wellness.',
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    timeSlots: {
      type: [String],
      default: [
        '09:00 AM',
        '09:30 AM',
        '10:00 AM',
        '10:30 AM',
        '11:00 AM',
        '11:30 AM',
        '02:00 PM',
        '02:30 PM',
        '03:00 PM',
        '03:30 PM',
      ],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

doctorSchema.index({ name: 'text', speciality: 'text' });
doctorSchema.index({ facility: 1, active: 1 });

export const Doctor = mongoose.model('Doctor', doctorSchema);
