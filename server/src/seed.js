import 'dotenv/config';
import { connectDb } from './lib/db.js';
import { Blog } from './models/Blog.js';
import { GalleryItem } from './models/GalleryItem.js';

await connectDb();

await Blog.deleteMany({});
await GalleryItem.deleteMany({});

await Blog.create([
  {
    title: 'How I Plan a Practical MERN Stack Workshop',
    slug: 'how-i-plan-a-practical-mern-stack-workshop',
    category: 'Training',
    excerpt: 'A simple framework for turning broad technical topics into learner-friendly practice sessions.',
    content:
      'Good workshops are not just about slides. I begin with the target outcome, design a small project around that outcome, and then break it into checkpoints where learners can pause, ask, build, and reflect.',
    tags: ['MERN', 'Training', 'Teaching'],
    likes: 7
  },
  {
    title: 'My Current Learning Notes on React State',
    slug: 'my-current-learning-notes-on-react-state',
    category: 'Learning',
    excerpt: 'A personal note about choosing between local state, context, and server state.',
    content:
      'I am learning to keep state close to where it is used. Local UI state belongs in components, shared preferences can move to context, and API data needs careful loading and error states.',
    tags: ['React', 'Learning'],
    likes: 4
  }
]);

await GalleryItem.create([
  {
    title: 'Full Stack Development Bootcamp',
    description: 'Hands-on coding session focused on building APIs and connecting them with React.',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    location: 'Bengaluru',
    audience: 'Engineering students',
    tags: ['MERN', 'Workshop']
  },
  {
    title: 'JavaScript Fundamentals Training',
    description: 'Interactive problem-solving session for beginners moving into web development.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    location: 'Hyderabad',
    audience: 'Junior developers',
    tags: ['JavaScript', 'Basics']
  }
]);

console.log('Seed data inserted');
process.exit(0);
