import express from 'express';
import slugify from 'slugify';
import { Blog } from '../models/Blog.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../lib/upload.js';

const router = express.Router();

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

async function uniqueSlug(title, currentId) {
  const base = slugify(title, { lower: true, strict: true }) || 'blog';
  let slug = base;
  let count = 2;

  while (await Blog.exists({ slug, _id: { $ne: currentId } })) {
    slug = `${base}-${count}`;
    count += 1;
  }

  return slug;
}

router.get('/', async (req, res) => {
  const query = req.query.admin === 'true' ? {} : { isPublished: true };
  const blogs = await Blog.find(query).sort({ createdAt: -1 });
  res.json(blogs);
});

router.get('/:slug', async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog || (!blog.isPublished && req.query.admin !== 'true')) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  res.json(blog);
});

router.post('/', requireAuth, upload.single('coverImage'), async (req, res) => {
  const { title, category, excerpt, content, isPublished } = req.body;
  const blog = await Blog.create({
    title,
    slug: await uniqueSlug(title),
    category,
    excerpt,
    content,
    tags: toArray(req.body.tags),
    isPublished: isPublished !== 'false',
    coverImage: req.file ? `/uploads/${req.file.filename}` : ''
  });

  res.status(201).json(blog);
});

router.put('/:id', requireAuth, upload.single('coverImage'), async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const { title, category, excerpt, content, isPublished } = req.body;
  blog.title = title;
  blog.slug = await uniqueSlug(title, blog._id);
  blog.category = category;
  blog.excerpt = excerpt;
  blog.content = content;
  blog.tags = toArray(req.body.tags);
  blog.isPublished = isPublished !== 'false';

  if (req.file) {
    blog.coverImage = `/uploads/${req.file.filename}`;
  }

  await blog.save();
  res.json(blog);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted' });
});

router.post('/:slug/like', async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { likes: 1 } },
    { new: true }
  );

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  res.json({ likes: blog.likes });
});

router.post('/:slug/comments', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ message: 'Name and comment are required' });
  }

  const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  blog.comments.push({ name, message });
  await blog.save();
  res.status(201).json(blog.comments.at(-1));
});

export default router;
