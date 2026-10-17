import mongoose from 'mongoose';

const healthArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: [
        'GENERAL',
        'FIRST_AID',
        'MATERNAL',
        'CHILD_HEALTH',
        'NUTRITION',
        'HYGIENE',
        'IMMUNISATION',
        'PREVENTIVE',
      ],
      required: [true, 'Category is required'],
      default: 'GENERAL',
    },
    summary: {
      type: String,
      required: [true, 'English summary is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'English content is required'],
      trim: true,
    },
    malayalamTitle: {
      type: String,
      trim: true,
      default: '',
    },
    malayalamSummary: {
      type: String,
      trim: true,
      default: '',
    },
    malayalamContent: {
      type: String,
      trim: true,
      default: '',
    },
    sourceAttribution: {
      type: String,
      default: 'National Health Mission (Kerala) & Directorate of Health Services',
      trim: true,
    },
    readTimeMinutes: {
      type: Number,
      default: 4,
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

healthArticleSchema.index({ title: 'text', content: 'text', summary: 'text' });
healthArticleSchema.index({ category: 1, active: 1 });

export const HealthArticle = mongoose.model('HealthArticle', healthArticleSchema);
