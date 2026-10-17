import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true,
      maxlength: 150,
    },
    type: {
      type: String,
      enum: ['HOSPITAL', 'CLINIC', 'PHC', 'CHC', 'PHARMACY'],
      required: [true, 'Facility type is required'],
      default: 'PHC',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Locality is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    state: {
      type: String,
      default: 'Kerala',
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: false,
      },
      lng: {
        type: Number,
        required: false,
      },
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    emergencyNumber: {
      type: String,
      trim: true,
      default: '',
    },
    openingHours: {
      type: String,
      default: '8:00 AM - 5:00 PM',
      trim: true,
    },
    services: {
      type: [String],
      default: [],
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

facilitySchema.index({ name: 'text', locality: 'text', district: 'text', services: 'text' });
facilitySchema.index({ district: 1, type: 1, active: 1 });

export const Facility = mongoose.model('Facility', facilitySchema);
