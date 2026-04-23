import express from 'express';
import { GalleryItem } from '../models/GalleryItem.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../lib/upload.js';

const router = express.Router();

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

router.get('/', async (_req, res) => {
  const items = await GalleryItem.find().sort({ trainingDate: -1, createdAt: -1 });
  res.json(items);
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Training photo is required' });
  }

  const item = await GalleryItem.create({
    title: req.body.title,
    description: req.body.description,
    imageUrl: `/uploads/${req.file.filename}`,
    trainingDate: req.body.trainingDate || undefined,
    location: req.body.location,
    audience: req.body.audience,
    tags: toArray(req.body.tags)
  });

  res.status(201).json(item);
});

router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Gallery item not found' });
  }

  item.title = req.body.title;
  item.description = req.body.description;
  item.trainingDate = req.body.trainingDate || undefined;
  item.location = req.body.location;
  item.audience = req.body.audience;
  item.tags = toArray(req.body.tags);

  if (req.file) {
    item.imageUrl = `/uploads/${req.file.filename}`;
  }

  await item.save();
  res.json(item);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await GalleryItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Gallery item deleted' });
});

export default router;
