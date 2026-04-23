import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: 'Learning', trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    likes: { type: Number, default: 0 },
    comments: [commentSchema],
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Blog = mongoose.model('Blog', blogSchema);
