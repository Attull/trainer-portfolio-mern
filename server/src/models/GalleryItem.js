import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    imageUrl: { type: String, required: true },
    trainingDate: { type: Date },
    location: { type: String, default: '', trim: true },
    audience: { type: String, default: '', trim: true },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
