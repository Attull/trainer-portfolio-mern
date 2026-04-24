import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    headline: { type: String, default: '', trim: true },
    quote: { type: String, default: '', trim: true },
    source: { type: String, default: '', trim: true },
    screenshotUrl: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isFeatured: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
