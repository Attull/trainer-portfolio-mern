import express from 'express';
import { Review } from '../models/Review.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../lib/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const query = req.query.admin === 'true' ? {} : { isFeatured: true };
  const reviews = await Review.find(query).sort({ createdAt: -1 });
  res.json(reviews);
});

router.post('/', requireAuth, upload.single('screenshot'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Review screenshot is required' });
  }

  const review = await Review.create({
    studentName: req.body.studentName,
    headline: req.body.headline,
    quote: req.body.quote,
    source: req.body.source,
    rating: Number(req.body.rating || 5),
    isFeatured: req.body.isFeatured !== 'false',
    screenshotUrl: `/uploads/${req.file.filename}`
  });

  res.status(201).json(review);
});

router.put('/:id', requireAuth, upload.single('screenshot'), async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  review.studentName = req.body.studentName;
  review.headline = req.body.headline;
  review.quote = req.body.quote;
  review.source = req.body.source;
  review.rating = Number(req.body.rating || 5);
  review.isFeatured = req.body.isFeatured !== 'false';

  if (req.file) {
    review.screenshotUrl = `/uploads/${req.file.filename}`;
  }

  await review.save();
  res.json(review);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted' });
});

export default router;
