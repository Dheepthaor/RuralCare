import mongoose from 'mongoose';

const ambulanceContactSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
    },
    telephoneNumber: {
      type: String,
      required: [true, 'Telephone number is required'],
      trim: true,
    },
    serviceArea: {
      type: String,
      required: [true, 'Service area is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    contactType: {
      type: String,
      enum: ['GOVERNMENT', 'COMMUNITY', 'PRIVATE', 'CHARITABLE'],
      default: 'GOVERNMENT',
    },
    vehicleType: {
      type: String,
      enum: ['BASIC_LIFE_SUPPORT', 'ADVANCED_LIFE_SUPPORT', 'PATIENT_TRANSPORT', '4WD_TERRAIN_AMBULANCE'],
      default: 'BASIC_LIFE_SUPPORT',
    },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED_ACTIVE', 'DEMO_DATA', 'UNVERIFIED'],
      default: 'DEMO_DATA',
    },
    lastVerifiedDate: {
      type: Date,
      default: Date.now,
    },
    operationalHours: {
      type: String,
      default: '24 Hours / 7 Days',
      trim: true,
    },
    notes: {
      type: String,
      default: 'Direct telephonic coordination. Call and describe nearest accessible road landmark.',
      trim: true,
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

ambulanceContactSchema.index({ district: 1, active: 1 });

export const AmbulanceContact = mongoose.model('AmbulanceContact', ambulanceContactSchema);
