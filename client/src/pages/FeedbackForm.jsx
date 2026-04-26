import { useState } from 'react';
import { MessageSquareHeart, Send, Star } from 'lucide-react';
import { api } from '../api.js';

const initialForm = {
  studentName: '',
  email: '',
  course: '',
  headline: '',
  quote: '',
  rating: 5
};

export default function FeedbackForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');

    try {
      await api.post('/reviews/submit', form);
      setForm(initialForm);
      setStatus('Thank you. Your feedback has been submitted.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Could not submit feedback right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section feedback-shell">
      <div className="section-heading">
        <p className="eyebrow"><MessageSquareHeart size={16} /> Student Feedback</p>
        <h1>Share your learning experience</h1>
        <p>If you attended a session, workshop, or mentorship program, you can leave your feedback here.</p>
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="feedback-grid">
          <input
            placeholder="Your name"
            value={form.studentName}
            onChange={(event) => setForm({ ...form, studentName: event.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            placeholder="Course or session name"
            value={form.course}
            onChange={(event) => setForm({ ...form, course: event.target.value })}
          />
          <input
            placeholder="Short headline"
            value={form.headline}
            onChange={(event) => setForm({ ...form, headline: event.target.value })}
          />
        </div>

        <label className="rating-field">
          <span>Rating</span>
          <select
            value={form.rating}
            onChange={(event) => setForm({ ...form, rating: event.target.value })}
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>{rating} / 5</option>
            ))}
          </select>
        </label>

        <textarea
          className="tall"
          placeholder="Tell others how the session helped you"
          value={form.quote}
          onChange={(event) => setForm({ ...form, quote: event.target.value })}
          required
        />

        <button className="primary-button" type="submit" disabled={submitting}>
          <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>

        {status && <p className="feedback-status">{status}</p>}
      </form>

      <div className="feedback-note">
        <Star size={16} />
        <span>Your feedback may also be featured on the trainer profile.</span>
      </div>
    </section>
  );
}
