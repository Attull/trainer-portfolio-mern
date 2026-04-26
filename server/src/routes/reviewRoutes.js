import express from 'express';
import { Review } from '../models/Review.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../lib/upload.js';

const router = express.Router();

function normalizeReview(review) {
  return {
    ...review,
    quote: review.quote || review.message || ''
  };
}

router.get('/', async (req, res) => {
  const query = req.query.admin === 'true' ? {} : { isPublished: true };
  const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
  res.json(reviews.map(normalizeReview));
});

router.get('/featured', async (_req, res) => {
  const reviews = await Review.find({ isPublished: true, isFeatured: true }).sort({ createdAt: -1 }).lean();
  res.json(reviews.map(normalizeReview));
});

router.post('/submit', async (req, res) => {
  const { studentName, email, course, headline, quote, rating } = req.body;

  if (!studentName || !quote) {
    return res.status(400).json({ message: 'Student name and feedback are required' });
  }

  const review = await Review.create({
    studentName,
    email,
    course,
    headline,
    quote,
    rating: Number(rating || 5),
    source: course ? `Student feedback - ${course}` : 'Student feedback',
    isFeatured: false,
    isPublished: true
  });

  res.status(201).json(normalizeReview(review.toObject()));
});

router.post('/', requireAuth, upload.single('screenshot'), async (req, res) => {
  const review = await Review.create({
    studentName: req.body.studentName,
    email: req.body.email,
    course: req.body.course,
    headline: req.body.headline,
    quote: req.body.quote,
    source: req.body.source,
    rating: Number(req.body.rating || 5),
    isPublished: req.body.isPublished !== 'false',
    isFeatured: req.body.isFeatured !== 'false',
    screenshotUrl: req.file ? `/uploads/${req.file.filename}` : ''
  });

  res.status(201).json(normalizeReview(review.toObject()));
});

router.put('/:id', requireAuth, upload.single('screenshot'), async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  review.studentName = req.body.studentName;
  review.email = req.body.email;
  review.course = req.body.course;
  review.headline = req.body.headline;
  review.quote = req.body.quote;
  review.source = req.body.source;
  review.rating = Number(req.body.rating || 5);
  review.isPublished = req.body.isPublished !== 'false';
  review.isFeatured = req.body.isFeatured !== 'false';

  if (req.file) {
    review.screenshotUrl = `/uploads/${req.file.filename}`;
  }

  await review.save();
  res.json(normalizeReview(review.toObject()));
});

router.delete('/:id', requireAuth, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted' });
});

export default router;
