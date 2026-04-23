import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    name: 'Your Name',
    role: 'Corporate Trainer | MERN Stack Mentor | Learning Facilitator',
    summary:
      'I design practical, hands-on training experiences that help learners gain confidence with modern web development, problem solving, and real project delivery.',
    location: 'India',
    email: 'trainer@example.com',
    phone: '+91 00000 00000',
    skills: ['MERN Stack', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Training Design'],
    stats: [
      { label: 'Training Hours', value: '500+' },
      { label: 'Learners Guided', value: '1,200+' },
      { label: 'Workshops', value: '80+' }
    ]
  });
});

export default router;
